const inquirer = require("@jyeontu/j-inquirer");
const fs = require("fs");
const path = require("path");
const ExifImage = require("exif").ExifImage;
const { dateFormat } = require("../../utils/dateTool.js");

function getPictureTakingTime(imagePath) {
  return new Promise((resolve) => {
    try {
      new ExifImage({ image: imagePath }, function (error, exifData) {
        if (error) {
          resolve(null);
        } else {
          if (exifData && exifData.exif) {
            const takingTime = exifData.exif.DateTimeOriginal;
            resolve(takingTime);
          } else {
            resolve(null);
          }
        }
      });
    } catch (error) {
      resolve(null);
    }
  });
}

const fileGrouping = async () => {
  const baseDir = process.cwd();
  const options = [
    {
      type: "folder",
      message: "请选择需要分组的目录：",
      name: "directory",
      default: "",
      dirname: baseDir,
    },
  ];
  const answers = await new inquirer(options).prompt();
  const dirPath = answers.directory;

  const files = fs.readdirSync(dirPath);
  const map = {};
  let sum = 0;
  console.log(`正在获取图片信息，请稍等……`);
  for (const file of files) {
    const newPath = path.join(dirPath, file);
    const info = fs.statSync(newPath);
    if (!info.isFile()) {
      continue;
    }
    sum++;
    const m = (await getPictureTakingTime(newPath)) || dateFormat(info.mtime);
    const mArr = m.split(" ");
    mArr[0] = mArr[0].split(":").join("-");
    const mtime = dateFormat(mArr.join(" "));
    if (!map[mtime]) {
      map[mtime] = [];
    }
    map[mtime].push(file);
  }
  console.log(`按日期分组中，共${sum}张图片……`);
  for (const key in map) {
    const keyPath = path.join(dirPath, key);
    if (!fs.existsSync(keyPath)) {
      fs.mkdirSync(keyPath);
    }
    for (const p of map[key]) {
      const np = path.join(keyPath, p);
      if (fs.existsSync(np)) {
        continue;
      }
      fs.copyFileSync(path.join(dirPath, p), path.join(keyPath, p));
    }
  }
  console.log("已完成图片分组");
};

module.exports = fileGrouping;
