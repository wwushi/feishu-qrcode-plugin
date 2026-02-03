const { testField, createFieldContext } = require('@lark-opdev/block-basekit-server-api');

async function run() {
  try {
    console.log('开始测试二维码生成字段捷径');
    
    // 创建测试上下文
    const context = await createFieldContext();
    
    // 测试字段
    await testField({
      account: 100,
      content: 'https://example.com', // 测试用的二维码内容
      qrColor: '#000000',
      bgColor: '#ffffff',
      size: 200,
      errorCorrectionLevel: 'M'
    }, context as any);
    
    console.log('测试完成');
  } catch (error) {
    console.error('测试失败:', error);
  }
}

run();
