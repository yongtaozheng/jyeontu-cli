const inquirer = require("@jyeontu/j-inquirer");
const getAllWifiInfo = require("./getAllWifiInfo");

const wifi = async () => {
  const options = [
    {
      type: "list",
      message: "请选择要进行的操作：",
      name: "action",
      choices: ["获取连接过的WiFi信息"],
    },
  ];
  const answers = await new inquirer(options).prompt();
  switch (answers.action) {
    case "获取连接过的WiFi信息":
      getAllWifiInfo();
      break;
  }
};

module.exports = wifi;
