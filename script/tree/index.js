const inquirer = require("@jyeontu/j-inquirer");
const operateMap = {
  生成目录树: require("./getDirTree"),
};
const tree = async () => {
  const gft = new operateMap["生成目录树"]();
  gft.init();
};

module.exports = tree;
