const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// 安装archiver库
const installArchiver = async () => {
  const { execSync } = require('child_process');
  try {
    require('archiver');
  } catch (e) {
    console.log('安装archiver库...');
    execSync('npm install archiver --save-dev', { stdio: 'inherit' });
  }
};

const packagePlugin = async () => {
  await installArchiver();
  
  const archiver = require('archiver');
  const output = fs.createWriteStream(path.join(__dirname, 'output.zip'));
  const archive = archiver('zip', { zlib: { level: 9 } });

  output.on('close', () => {
    console.log(`插件包已生成: output.zip (${archive.pointer()} bytes)`);
  });

  archive.on('error', (err) => {
    throw err;
  });

  archive.pipe(output);

  // 添加需要打包的文件
  const filesToInclude = [
    'index.js',
    'manifest.json',
    'package.json',
    'package-lock.json'
  ];

  filesToInclude.forEach(file => {
    if (fs.existsSync(path.join(__dirname, file))) {
      archive.file(file, { name: file });
      console.log(`添加文件: ${file}`);
    }
  });

  // 添加node_modules目录
  archive.directory('node_modules/', 'node_modules');
  console.log('添加目录: node_modules/');

  await archive.finalize();
};

packagePlugin().catch(console.error);