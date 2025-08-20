const figlet = require("figlet");

figlet.text("jyeontu", function (err, data) {
  if (err) {
    console.error(err);
  } else {
    console.log(data);
  }
});

console.log("Thank you for installing jyeontu");
