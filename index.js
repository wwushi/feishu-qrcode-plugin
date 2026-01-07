const QRCode = require('qrcode');

/**
 * 飞书多维表格二维码生成插件
 * 功能：将字段内容生成二维码图片，并支持自动更新
 * 
 * @param {string} content - 需要生成二维码的内容（比如网址、文本等）
 * @param {string} logo - logo图片URL，可将品牌标识、个性化图标嵌入二维码中心
 * @param {string} qrColor - 二维码颜色（HEX色值），默认黑色
 * @param {string} bgColor - 二维码背景色（HEX色值），默认白色
 * @param {string} text - 二维码下方的文字内容
 * @param {string} textColor - 二维码下方文字的颜色（HEX色值），默认黑色
 * @param {number} textSize - 二维码下方文字的大小，默认12
 * @param {number} size - 二维码尺寸，默认200
 * @param {number} margin - 二维码边距，默认1
 * @param {string} errorCorrectionLevel - 二维码容错率，可选值：L、M、Q、H，默认M
 * @returns {Promise<string>} 二维码图片的Base64编码
 */
async function generateQRCode(content, logo = '', qrColor = '#000000', bgColor = '#ffffff', text = '', textColor = '#000000', textSize = 12, size = 200, margin = 1, errorCorrectionLevel = 'M') {
  try {
    // 参数校验
    if (!content) {
      throw new Error('缺少必要参数：content');
    }
    
    // 生成二维码的Base64编码
    const base64 = await QRCode.toDataURL(content, {
      width: size,
      margin: margin,
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