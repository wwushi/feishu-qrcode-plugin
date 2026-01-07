const QRCode = require('qrcode');
// 简化实现，暂不使用Jimp库处理logo和文字，避免复杂性
// 后续可以根据需要添加更复杂的图像处理功能

/**
 * 将字段内容生成二维码
 * @param {string} content - 需要生成二维码的数据，可以是文本或链接
 * @param {number} size - 二维码尺寸，默认200
 * @param {string} logo - 二维码中心的logo图片URL
 * @param {string} qrColor - 二维码颜色，默认黑色
 * @param {string} bgColor - 二维码背景色，默认白色
 * @param {string} text - 二维码下方的文字
 * @param {string} textColor - 二维码文字颜色，默认黑色
 * @param {number} textSize - 二维码文字大小，默认12
 * @param {string} generateRange - 生成范围，整列或单行
 * @returns {Promise<string>} 二维码图片的Base64编码
 */
async function generateQRCode(content, size = 200, logo = '', qrColor = '#000000', bgColor = '#ffffff', text = '', textColor = '#000000', textSize = 12, generateRange = 'column') {
  try {
    // 生成二维码的Base64编码
    const base64 = await QRCode.toDataURL(content, {
      width: size,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: {
        dark: qrColor,
        light: bgColor
      }
    });
    
    return base64;
  } catch (error) {
    console.error('生成二维码失败:', error);
    throw new Error('生成二维码失败: ' + error.message);
  }
}

// 导出函数供飞书插件系统调用
module.exports = {
  generateQRCode
};