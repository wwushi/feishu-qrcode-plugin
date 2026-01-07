const { generateQRCode } = require('./index');
const fs = require('fs');
const path = require('path');

// 测试生成不同容错率的二维码
async function testErrorCorrectionLevels() {
  const content = 'www.bilibili.com';
  const errorLevels = ['L', 'M', 'Q', 'H'];
  const descriptions = ['7%容错率', '15%容错率', '25%容错率', '30%容错率'];
  
  console.log('开始生成 www.bilibili.com 的四种容错率二维码...');
  
  for (let i = 0; i < errorLevels.length; i++) {
    const level = errorLevels[i];
    const desc = descriptions[i];
    
    try {
      console.log(`生成 ${desc} (${level})...`);
      const base64 = await generateQRCode(content, '#000000', '#ffffff', 300, level);
      
      // 提取Base64图片数据
      const base64Data = base64.replace(/^data:image\/png;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      
      // 保存图片到文件
      const filename = `qrcode-bilibili-${level}.png`;
      const filepath = path.join(__dirname, filename);
      fs.writeFileSync(filepath, buffer);
      
      console.log(`✓ 生成成功: ${filename}`);
    } catch (error) {
      console.error(`✗ 生成失败 (${level}):`, error.message);
    }
  }
  
  console.log('\n测试完成！');
}

// 运行测试
testErrorCorrectionLevels();
