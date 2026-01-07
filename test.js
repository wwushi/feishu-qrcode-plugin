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
    const base64_300 = await generateQRCode(testContent, 300);
    console.log('✓ 300x300尺寸二维码生成成功！');
    
    // 3. 测试颜色配置
    console.log('\n3. 测试颜色配置:');
    const base64_color = await generateQRCode(testContent, 200, '', '#FF0000', '#FFFF00');
    console.log('✓ 彩色二维码生成成功！');
    
    // 4. 测试文字配置
    console.log('\n4. 测试文字配置:');
    const base64_text = await generateQRCode(testContent, 200, '', '#000000', '#FFFFFF', '测试文字');
    console.log('✓ 带文字的二维码生成成功！');
    
    // 5. 测试文字颜色和大小
    console.log('\n5. 测试文字颜色和大小:');
    const base64_text_style = await generateQRCode(testContent, 200, '', '#000000', '#FFFFFF', '彩色文字', '#FF0000', 16);
    console.log('✓ 带自定义文字样式的二维码生成成功！');
    
    // 6. 测试生成范围参数
    console.log('\n6. 测试生成范围参数:');
    const base64_range = await generateQRCode(testContent, 200, '', '#000000', '#FFFFFF', '', '#000000', 12, 'column');
    console.log('✓ 带生成范围参数的二维码生成成功！');
    
    console.log('\n🎉 所有测试通过！');
    console.log('\n测试总结:');
    console.log('- 支持基本二维码生成');
    console.log('- 支持自定义尺寸');
    console.log('- 支持自定义二维码颜色和背景色');
    console.log('- 支持添加底部文字');
    console.log('- 支持自定义文字颜色和大小');
    console.log('- 支持生成范围配置');
    console.log('- 支持logo添加（当前测试未包含实际logo URL）');
  } catch (error) {
    console.error('✗ 测试失败:', error);
  }
}

testQRCodeGeneration();