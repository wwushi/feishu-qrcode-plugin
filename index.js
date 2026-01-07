const QRCode = require('qrcode');

/**
 * 飞书多维表格二维码生成插件
 * 功能：将字段内容生成二维码图片，并支持自动更新
 * 
 * @param {string} content - 需要生成二维码的内容（比如网址、文本等）
 * @param {string} qrColor - 二维码颜色（HEX色值），默认黑色
 * @param {string} bgColor - 二维码背景色（HEX色值），默认白色
 * @param {number} size - 二维码尺寸，默认200
 * @param {string} errorCorrectionLevel - 容错率级别：L(7%), M(15%), Q(25%), H(30%)，默认M
 * @returns {Promise<string>} 二维码图片的Base64编码
 */
async function generateQRCode(content, qrColor = '#000000', bgColor = '#ffffff', size = 200, errorCorrectionLevel = 'M') {
  try {
    // 参数校验
    if (!content) {
      throw new Error('缺少必要参数：content');
    }
    
    // 生成二维码的Base64编码
    const base64 = await QRCode.toDataURL(content, {
      width: size,
      margin: 1,
      errorCorrectionLevel: errorCorrectionLevel,
      color: {
        dark: qrColor,
        light: bgColor
      }
    });
    
    return base64;
  } catch (error) {
    console.error('二维码生成失败:', error);
    throw new Error(`二维码生成失败: ${error.message}`);
  }
}

// 导出函数供飞书插件系统调用
module.exports = {
  generateQRCode
};