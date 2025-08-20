const { createProgressBar, handleError, checkImgType, getVersionPlusNum } = require('../utils/common');

// 基础功能测试
function testCommonUtils() {
  console.log('🧪 开始测试公共工具函数...');
  
  // 测试图片类型检查
  console.log('测试图片类型检查:');
  console.log('test.jpg:', checkImgType('test.jpg')); // true
  console.log('test.txt:', checkImgType('test.txt')); // false
  
  // 测试版本号处理
  console.log('测试版本号处理:');
  console.log('1.0.0 ->', getVersionPlusNum('1.0.0')); // 1.0.1
  console.log('1.9.9 ->', getVersionPlusNum('1.9.9')); // 2.0.0
  
  // 测试错误处理
  console.log('测试错误处理:');
  try {
    throw new Error('测试错误');
  } catch (error) {
    handleError(error, '测试');
  }
  
  console.log('✅ 公共工具函数测试完成\n');
}

// 测试进度条
function testProgressBar() {
  console.log('🧪 开始测试进度条...');
  const progressBar = createProgressBar({ color: 'green' });
  
  let progress = 0;
  const interval = setInterval(() => {
    progress += 10;
    progressBar.run(progress);
    
    if (progress >= 100) {
      clearInterval(interval);
      console.log('\n✅ 进度条测试完成\n');
    }
  }, 100);
}

// 运行所有测试
function runTests() {
  console.log('🚀 开始运行测试...\n');
  
  testCommonUtils();
  testProgressBar();
  
  console.log('🎉 所有测试完成！');
}

// 如果直接运行此文件，则执行测试
if (require.main === module) {
  runTests();
}

module.exports = {
  testCommonUtils,
  testProgressBar,
  runTests
};
