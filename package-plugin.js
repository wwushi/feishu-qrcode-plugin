// 引入文件系统模块，用于文件操作
const fs = require('fs');
// 引入路径模块，用于处理文件路径
const path = require('path');
// 引入archiver模块，用于创建ZIP压缩包
const archiver = require('archiver');

/**
 * 安装archiver库（如果尚未安装）
 * 功能：确保打包所需的依赖存在
 * @returns {Promise<void>}
 */
const installArchiver = async () => {
  // 引入子进程模块，用于执行命令行命令
  const { execSync } = require('child_process');
  try {
    // 尝试加载archiver库，如果成功则说明已安装
    require('archiver');
  } catch (e) {
    // 如果加载失败，则安装archiver库
    console.log('安装archiver库...');
    execSync('npm install archiver --save-dev', { stdio: 'inherit' });
  }
};

/**
 * 打包插件的主函数
 * 功能：将插件文件打包成ZIP文件，用于上传到飞书开发者后台
 * @returns {Promise<void>}
 */
const packagePlugin = async () => {
  // 1. 确保archiver库已安装
  await installArchiver();
  
  // 2. 创建ZIP文件输出流
  const output = fs.createWriteStream(path.join(__dirname, 'output.zip'));
  
  // 3. 初始化archiver实例，使用最高压缩级别
  const archive = archiver('zip', { zlib: { level: 9 } });

  // 4. 监听ZIP文件关闭事件，输出打包结果
  output.on('close', () => {
    console.log(`插件包已生成: output.zip (${archive.pointer()} bytes)`);
  });

  // 5. 监听打包错误事件
  archive.on('error', (err) => {
    throw err;
  });

  // 6. 将archiver输出流指向ZIP文件
  archive.pipe(output);

  // 7. 定义需要打包的文件列表
  const filesToInclude = [
    'index.js',          // 插件主逻辑文件
    'manifest.json',     // 插件配置文件
    'package.json',      // 项目依赖配置
    'package-lock.json', // 项目依赖锁定文件
    'qr.svg'             // 插件图标文件
  ];

  // 8. 遍历文件列表，将每个文件添加到ZIP包中
  filesToInclude.forEach(file => {
    // 检查文件是否存在
    if (fs.existsSync(path.join(__dirname, file))) {
      // 将文件添加到ZIP包中，保持原文件名
      archive.file(file, { name: file });
      console.log(`添加文件: ${file}`);
    }
  });

  // 9. 将node_modules目录添加到ZIP包中，包含所有依赖
  archive.directory('node_modules/', 'node_modules');
  console.log('添加目录: node_modules/');

  // 10. 完成ZIP包的创建
  await archive.finalize();
};

// 执行插件打包函数
// 如果出现错误，打印错误信息
packagePlugin().catch(console.error);