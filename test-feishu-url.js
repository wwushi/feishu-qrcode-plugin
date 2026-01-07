const { generateQRCode } = require('./index');
const fs = require('fs');
const path = require('path');

// 生成指定网站的Q级容错率二维码
async function generateFeishuQRCode() {
  const url = 'https://feishu.feishu.cn/docx/SZFpd9v6EoHMI7xEhWhckLLfnBh';
  const errorLevel = 'Q'; // Q级容错率（25%）
  
  try {
    console.log(`开始生成 ${url} 的 ${errorLevel} 级容错率二维码...`);
    
    const base64 = await generateQRCode(url, '#000000', '#ffffff', 300, errorLevel);
    
    // 提取Base64图片数据
    const base64Data = base64.replace(/^data:image\/png;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    // 保存图片到文件
    const filename = `qrcode-feishu-doc-Q.png`;
    const filepath = path.join(__dirname, filename);
    fs.writeFileSync(filepath, buffer);
    
    console.log(`✓ 生成成功: ${filename}`);
    console.log(`✓ 容错率: ${errorLevel} (25%)`);
    console.log(`✓ 尺寸: 300x300`);
    console.log(`✓ 保存路径: ${filepath}`);
    
  } catch (error) {
    console.error(`✗ 生成失败:`, error.message);
  }
}

// 运行生成函数
generateFeishuQRCode();
