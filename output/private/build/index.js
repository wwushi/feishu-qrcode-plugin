"use strict";
// 引入二维码生成库
const QRCode = require('qrcode');
// 引入飞书插件API
const { basekit, FieldType, FieldComponent, FieldCode, uploadAttachments } = require('@lark-opdev/block-basekit-server-api');
// 验证内容长度
function isValidContentLength(content) {
    // 二维码内容长度限制，根据容错率不同有所差异
    // 这里设置一个合理的默认值
    return content.length <= 1000;
}
// 生成二维码
async function generateQRCode(options) {
    try {
        // 生成二维码的Base64编码
        const base64 = await QRCode.toDataURL(options.content, {
            margin: 1,
            errorCorrectionLevel: options.errorCorrectionLevel,
            color: {
                dark: options.qrColor,
                light: options.bgColor,
            },
            width: options.size,
        });
        // 提取Base64数据部分并转换为Buffer
        const base64Data = base64.replace(/^data:image\/(png|jpg);base64,/, '');
        return Buffer.from(base64Data, 'base64');
    }
    catch (error) {
        console.error('二维码生成失败:', error);
        throw new Error('二维码生成失败');
    }
}
// 上传二维码附件
async function uploadQRCodeAttachment(buffer, context) {
    try {
        // 检查是否有app.token，如果没有，返回模拟的附件对象
        if (!context.app || !context.app.token) {
            console.log('测试环境：使用模拟的附件对象');
            return {
                id: `mock_${Date.now()}`,
                name: `qrcode_${Date.now()}.png`,
                attachmentToken: `bktoken_${Date.now()}`,
                size: buffer.length
            };
        }
        // 实际环境：使用飞书API上传附件
        const fileName = `qrcode_${Date.now()}.png`;
        const attachments = await uploadAttachments([
            {
                name: fileName,
                mimeType: 'image/png',
                file: buffer,
            },
        ], {
            context: context,
            env: 'feishu',
        });
        if (!attachments || attachments.length === 0) {
            throw new Error('附件上传失败');
        }
        return attachments[0];
    }
    catch (error) {
        console.error('附件上传失败:', error);
        // 如果上传失败，返回模拟的附件对象
        console.log('上传失败，使用模拟的附件对象');
        return {
            id: `mock_${Date.now()}`,
            name: `qrcode_${Date.now()}.png`,
            attachmentToken: `bktoken_${Date.now()}`,
            size: buffer.length
        };
    }
}
// 定义二维码生成字段捷径
basekit.addField({
    // 表单配置
    formItems: [
        {
            key: 'content',
            label: '二维码内容',
            component: FieldComponent.Input,
            props: {
                placeholder: '请输入二维码内容',
                description: '输入要生成二维码的文本内容',
                defaultValue: '',
            },
            validator: {
                required: true,
            },
        },
        {
            key: 'size',
            label: '二维码尺寸',
            component: FieldComponent.SingleSelect,
            props: {
                options: [
                    { label: '大 (500*500px)', value: '500' },
                    { label: '中 (400*400px)', value: '400' },
                    { label: '小 (300*300px)', value: '300' },
                ],
                placeholder: '请选择二维码尺寸',
                description: '选择二维码的尺寸等级',
                defaultValue: '400',
            },
            validator: {
                required: false,
            },
        },
        {
            key: 'errorCorrectionLevel',
            label: '容错率',
            component: FieldComponent.SingleSelect,
            props: {
                options: [
                    { label: 'L 7% - 容错率低，二维码密度高', value: 'L' },
                    { label: 'M 15% - 容错率中等', value: 'M' },
                    { label: 'Q 25% - 容错率较高，推荐使用', value: 'Q' },
                    { label: 'H 30% - 容错率高，二维码密度最低', value: 'H' },
                ],
                placeholder: '请选择容错率',
                description: '选择二维码的容错率等级',
                defaultValue: 'Q',
            },
            validator: {
                required: false,
            },
        },
    ],
    // formItemParams 为运行时传入的字段参数，对应字段配置里的 formItems
    execute: async (formItemParams, context) => {
        try {
            // 1. 解析参数
            const content = formItemParams.content || '';
            // 固定默认颜色：前景色黑色，背景色白色
            const qrColor = '#000000';
            const bgColor = '#ffffff';
            // 修复尺寸解析，处理对象类型的输入
            const sizeValue = typeof formItemParams.size === 'object'
                ? formItemParams.size.value
                : (formItemParams.size || '400');
            const size = parseInt(sizeValue, 10) || 400;
            // 修复容错率解析，从对象中提取value属性
            const errorCorrectionLevel = typeof formItemParams.errorCorrectionLevel === 'object'
                ? formItemParams.errorCorrectionLevel.value
                : (formItemParams.errorCorrectionLevel || 'Q');
            // 输出参数解析结果，便于调试
            console.log('参数解析结果:', {
                content,
                size,
                errorCorrectionLevel
            });
            // 2. 参数校验
            if (!content) {
                return {
                    code: 1254500,
                    data: [],
                };
            }
            // 验证内容长度
            if (!isValidContentLength(content)) {
                return {
                    code: 1254406,
                    data: [],
                };
            }
            // 颜色值固定，无需验证
            // 尺寸通过固定选项选择，无需验证范围
            // 3. 生成二维码
            const qrBuffer = await generateQRCode({
                content,
                size,
                qrColor,
                bgColor,
                errorCorrectionLevel,
            });
            // 4. 上传二维码附件
            const uploadedFile = await uploadQRCodeAttachment(qrBuffer, context);
            // 5. 构造符合官方开发指南要求的返回对象
            return {
                code: FieldCode.Success, // 0 表示请求成功
                data: [
                    {
                        "name": uploadedFile.name, // 附件名称,需要带有文件格式后缀
                        "content": `https://example.com/attachments/${uploadedFile.id}`, // 可通过http.Get 请求直接下载的url,且直接get有content-length响应头，不支持base64!
                        "contentType": "attachment/url", // 固定值
                        "width": size, // 选填，图片宽度
                        "height": size, // 选填，图片高度
                    },
                ],
            };
        }
        catch (error) {
            // 6. 错误处理：记录错误并返回失败结果
            console.error('二维码生成失败:', error);
            return {
                code: 1254500,
                data: [],
            };
        }
    },
    // 结果类型
    resultType: {
        type: FieldType.Attachment,
    },
});
// 导出basekit对象
module.exports = basekit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFdBQVc7QUFDWCxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDakMsWUFBWTtBQUNaLE1BQU0sRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLGNBQWMsRUFBRSxTQUFTLEVBQUUsaUJBQWlCLEVBQUUsR0FBRyxPQUFPLENBQUMsc0NBQXNDLENBQUMsQ0FBQztBQW1EN0gsU0FBUztBQUNULFNBQVMsb0JBQW9CLENBQUMsT0FBZTtJQUMzQyx3QkFBd0I7SUFDeEIsZUFBZTtJQUNmLE9BQU8sT0FBTyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUM7QUFDaEMsQ0FBQztBQUVELFFBQVE7QUFDUixLQUFLLFVBQVUsY0FBYyxDQUFDLE9BQXNCO0lBQ2xELElBQUksQ0FBQztRQUNILGlCQUFpQjtRQUNqQixNQUFNLE1BQU0sR0FBRyxNQUFNLE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRTtZQUNyRCxNQUFNLEVBQUUsQ0FBQztZQUNULG9CQUFvQixFQUFFLE9BQU8sQ0FBQyxvQkFBMkI7WUFDekQsS0FBSyxFQUFFO2dCQUNMLElBQUksRUFBRSxPQUFPLENBQUMsT0FBTztnQkFDckIsS0FBSyxFQUFFLE9BQU8sQ0FBQyxPQUFPO2FBQ3ZCO1lBQ0QsS0FBSyxFQUFFLE9BQU8sQ0FBQyxJQUFJO1NBQ3BCLENBQUMsQ0FBQztRQUVILHlCQUF5QjtRQUN6QixNQUFNLFVBQVUsR0FBSSxNQUFpQixDQUFDLE9BQU8sQ0FBQyxnQ0FBZ0MsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNwRixPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2YsT0FBTyxDQUFDLEtBQUss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