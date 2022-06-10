/* eslint-disable import/no-extraneous-dependencies */
const fs = require("fs");
const pug = require("pug");
const prismicH = require("@prismicio/helpers");
const Prismic = require("@prismicio/client");
const fetch = require("node-fetch");

const {
  env: {
    // Your Account SID from www.twilio.com/console
    PRISMIC_ACCESS_TOKEN,
    // Your Auth Token from www.twilio.com/console
    PRISMIC_CLIENT_ID,
    // Text this number
    PRISMIC_CLIENT_SECRET,
    // From a valid Twilio number
    PRISMIC_ENDPOINT,
  },
} = require("process");

const initApi = () => {
  const client = Prismic.createClient(PRISMIC_ENDPOINT, {
    accessToken: PRISMIC_ACCESS_TOKEN,
    fetch,
  });

  return client;
};

const handleRequest = async (api) => {
  const globals = await api.getSingle("globals");
  const preloader = await api.getSingle("works");
  const home = await api.getSingle("homepage");
  const about = await api.getSingle("about");
  const meta = await api.getSingle("metadata");

  const projects = await api.getAllByType("work");

  return {
    about,
    projects,
    home,
    globals,
    meta,
    preloader,
  };
};

// Page Builders
const buildPages = async ({ isLocal }) => {
  try {
    const api = await initApi();
    const results = await handleRequest(api);

    // Create HTML pages from pug template
    const output = await pug.renderFile(`${__dirname}/../../src/index.pug`, {
      data: results,
      prismicH: prismicH,
    });
    const dir = `${__dirname}/../../src`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    const file = isLocal ? `${dir}/index_auto.html` : `${dir}/index.html`;
    fs.writeFileSync(file, output);
  } catch (error) {
    console.log(error);
    throw new Error("An error has occured!", error);
  }
};

module.exports = {
  // eslint-disable-next-line consistent-return
  onPreBuild: async ({ utils, constants }) => {
    try {
      await buildPages({
        isLocal: constants.IS_LOCAL,
      });
      console.log("You've successfully built the playlist catalogue page");
    } catch (error) {
      return utils.build.failBuild("Failure message", error);
    }
  },
};
