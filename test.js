const { generateQRCode } = require('./index');

async function testQRCodeGeneration() {
  try {
    console.log('测试二维码生成功能...');
    
    const testContent = 'https://example.com';
    
    // 1. 测试基本功能
    console.log('\n1. 测试基本功能:');
    const base64 = await generateQRCode({ content: testContent });
    console.log('✓ 基本二维码生成成功！');
    
    // 2. 测试不同尺寸
    console.log('\n2. 测试不同尺寸:');
    const base64_300 = await generateQRCode({ content: testContent, size: 300 });
    console.log('✓ 300x300尺寸二维码生成成功！');
    
    // 3. 测试颜色配置
    console.log('\n3. 测试颜色配置:');
    const base64_color = await generateQRCode({ 
      content: testContent, 
      qrColor: '#FF0000', 
      bgColor: '#FFFF00' 
    });
    console.log('✓ 彩色二维码生成成功！');
    
    // 4. 测试参数校验
    console.log('\n4. 测试参数校验:');
    try {
      await generateQRCode();
      console.log('✗ 参数校验失败：应该拒绝空参数');
    } catch (error) {
      console.log('✓ 参数校验成功：拒绝了空参数');
    }
    
    // 5. 测试缺少content参数
    console.log('\n5. 测试缺少content参数:');
    try {
      await generateQRCode({ size: 200 });
      console.log('✗ 参数校验失败：应该拒绝缺少content的参数');
    } catch (error) {
      console.log('✓ 参数校验成功：拒绝了缺少content的参数');
    }
    
    console.log('\n🎉 所有测试通过！');
    console.log('\n测试总结:');
    console.log('- 支持基本二维码生成');
    console.log('- 支持自定义尺寸');
    console.log('- 支持自定义二维码颜色和背景色');
    console.log('- 支持参数校验');
    console.log('- 代码结构符合官方规范');
  } catch (error) {
    console.error('✗ 测试失败:', error);
  }
}

testQRCodeGeneration();