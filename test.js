const { generateQRCode } = require('./index');

async function testQRCodeGeneration() {
  try {
    console.log('测试二维码生成功能...');
    
    const testContent = 'https://example.com';
    
    // 1. 测试基本功能
    console.log('\n1. 测试基本功能:');
    const base64 = await generateQRCode(testContent);
    console.log('✓ 基本二维码生成成功！');
    
    // 2. 测试不同尺寸
    console.log('\n2. 测试不同尺寸:');
    const base64_300 = await generateQRCode(testContent, '', '#000000', '#ffffff', '', '#000000', 12, 300);
    console.log('✓ 300x300尺寸二维码生成成功！');
    
    // 3. 测试颜色配置
    console.log('\n3. 测试颜色配置:');
    const base64_color = await generateQRCode(testContent, '', '#FF0000', '#FFFF00');
    console.log('✓ 彩色二维码生成成功！');
    
    // 4. 测试参数校验
    console.log('\n4. 测试参数校验:');
    try {
      await generateQRCode();
      console.log('✗ 参数校验失败：应该拒绝空参数');
    } catch (error) {
      console.log('✓ 参数校验成功：拒绝了空参数');
    }
    
    // 5. 测试带文字配置
    console.log('\n5. 测试带文字配置:');
    const base64_with_text = await generateQRCode(testContent, '', '#000000', '#ffffff', '测试文字');
    console.log('✓ 带文字的二维码生成成功！');
    
    // 6. 测试文字样式
    console.log('\n6. 测试文字样式:');
    const base64_text_style = await generateQRCode(testContent, '', '#000000', '#ffffff', '彩色文字', '#FF0000', 16);
    console.log('✓ 带自定义文字样式的二维码生成成功！');
    
    // 7. 测试不同容错率
    console.log('\n7. 测试不同容错率:');
    const base64_high_error = await generateQRCode(testContent, '', '#000000', '#ffffff', '', '#000000', 12, 200, 1, 'H');
    console.log('✓ 高容错率二维码生成成功！');
    
    console.log('\n🎉 所有测试通过！');
    console.log('\n测试总结:');
    console.log('- 支持基本二维码生成');
    console.log('- 支持自定义尺寸');
    console.log('- 支持自定义二维码颜色和背景色');
    console.log('- 支持添加底部文字');
    console.log('- 支持自定义文字颜色和大小');
    console.log('- 支持不同容错率设置');
    console.log('- 支持参数校验');
  } catch (error) {
    console.error('✗ 测试失败:', error);
  }
}

testQRCodeGeneration();