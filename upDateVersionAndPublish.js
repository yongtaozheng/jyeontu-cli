const child_process = require("child_process");
const fs = require("fs");
const path = require("path");

function getVersion(filePath) {
  let json = fs.readFileSync(filePath, "utf-8");
  const version = json.match(/['"]*version['"]*: ['"](\d*\.\d*\.\d*)['"],/) || [
    "",
    "获取不到版本号",
  ];
  return version[1];
}
function getVersionPlusNum(version) {
  try {
    version = version.split(".");
    let num = 1,
      ind = version.length - 1;
    while (num > 0 && ind >= 0) {
      let tmp = Number(version[ind]) + num;
      version[ind] = tmp % 10;
      num = Math.floor(tmp / 10);
      ind--;
    }
    return version.join(".");
  } catch (err) {
    return version;
  }
}
function updateVersion(filePath, version, newVersion) {
  const content = fs.readFileSync(filePath, "utf-8");
  const regStr = `['"]*version['"]*: ['"](${version})['"],`;
  const reg = new RegExp(regStr);
  const matchContent = content.match(reg);
  fs.writeFileSync(
    filePath,
    content.replace(
      matchContent[0],
      matchContent[0].replace(version, newVersion)
    )
  );
  console.log(
    `${path.join(__dirname, filePath)}版本号已从${version}修改为${newVersion}`
  );
}

const filePath = "./package.json";
const version = getVersion(filePath);
const newVersion = getVersionPlusNum(version);
updateVersion(filePath, version, newVersion);
const command = `npm publish`;
child_process.execSync(command);
