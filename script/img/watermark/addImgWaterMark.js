//引入path模块
const path = require("path");
//使用jimp插件库 npm install jimp
const jimp = require("jimp");

/**
 * 添加水印的函数封装
 *@param waterFile:水印路径
 *@param originFile：原始路径
 *@param targetFile：加水印后的图片路径
 *@param proportion：目标缩放比例
 *@param marginProportion：到图片边缘的比例
 * @returns {Promise<Jimp>}
 */
async function waterMark(
  waterFile,
  watermarkPos,
  originFile,
  targetFile,
  proportion = 5,
  marginProportion = 0.01
) {
  //使用promise.all方法同时返回水印对象和原始对象
  const [water, origin] = await Promise.all([
    jimp.read(waterFile),
    jimp.read(originFile),
  ]);

  /**
   * 对水印图片进行缩放
   * 当前比例=原始图宽度/水印图宽度
   * 设置比例=当前比例/目标比例
   * scale 进行缩放
   */
  const curProportion = origin.bitmap.width / water.bitmap.width;
  water.scale(curProportion / proportion);

  //计算水印图片左上角的坐标
  const { x, y } = getPosition(
    origin.bitmap,
    water.bitmap,
    watermarkPos,
    marginProportion
  );

  //写入水印
  origin.composite(water, x, y, {
    mode: jimp.BLEND_SOURCE_OVER,
    opacitySource: 0.7,
  });
  await origin.write(targetFile);
}
function getPosition(img, waterMark, pos, marginProportion) {
  const imageWidth = img.width;
  const imageHeight = img.height;
  const watermarkWidth = waterMark.width;
  const watermarkHeight = waterMark.height;
  let x = (imageWidth - watermarkWidth) / 2; // 水印横坐标
  let y = (imageHeight - watermarkHeight) / 2; // 水印纵坐标

  switch (pos) {
    case "上左":
      x = 10; // 水印横坐标
      y = 10; // 水印纵坐标
      break;
    case "上中":
      x = (imageWidth - watermarkWidth) / 2; // 水印横坐标
      y = 10; // 水印纵坐标
      break;
    case "上右":
      x = imageWidth - watermarkWidth - 20; // 水印横坐标
      y = 10; // 水印纵坐标
      break;
    case "中左":
      x = 10; // 水印横坐标
      y = (imageHeight - watermarkHeight) / 2; // 水印纵坐标
      break;
    case "正中":
      x = (imageWidth - watermarkWidth) / 2; // 水印横坐标
      y = (imageHeight - watermarkHeight) / 2; // 水印纵坐标
      break;
    case "中右":
      x = imageWidth - watermarkWidth - 20; // 水印横坐标
      y = (imageHeight - watermarkHeight) / 2; // 水印纵坐标
      break;
    case "下左":
      x = 10; // 水印横坐标
      y = imageHeight - watermarkHeight - 20; // 水印纵坐标
      break;
    case "下中":
      x = (imageWidth - watermarkWidth) / 2; // 水印横坐标
      y = imageHeight - watermarkHeight - 20; // 水印纵坐标
      break;
    case "下右":
      x = imageWidth - watermarkWidth - 20; // 水印横坐标
      y = imageHeight - watermarkHeight - 20; // 水印纵坐标
      break;
  }
  return {
    x,
    y,
  };
}
module.exports = waterMark;
