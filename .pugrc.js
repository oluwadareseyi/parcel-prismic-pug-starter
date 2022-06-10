const dataFile = require("./data.json");
const prismicH = require("@prismicio/helpers");

module.exports = {
  locals: {
    devData: dataFile,
    prismicH: prismicH,
  },
};
