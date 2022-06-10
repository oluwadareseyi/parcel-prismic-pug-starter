/* eslint-disable import/no-extraneous-dependencies */
const fs = require("fs");
const pug = require("pug");
const prismicH = require("@prismicio/helpers");
const Prismic = require("@prismicio/client");
const fetch = require("node-fetch");

const {
  env: { PRISMIC_ACCESS_TOKEN, PRISMIC_ENDPOINT },
} = require("process");

const initApi = () => {
  // remove the accessToken if your repo isn't public
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
    // Fetch data from prismic
    const api = await initApi();
    const results = await handleRequest(api);

    // Create HTML pages from pug template and pass data fetched from the CMS into it, you can also pass any other data you feel is neccesarry, I'm using `prismicH` here to tap into prismic's helper functions
    const output = await pug.renderFile(`${__dirname}/../../src/index.pug`, {
      data: results,
      prismicH: prismicH,
    });

    // write the HTML output to the file system for Netlify to serve with parcel - See build script
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
  onPreBuild: async ({ utils, constants }) => {
    try {
      await buildPages({
        isLocal: constants.IS_LOCAL,
      });
      console.log("You've successfully built your page");
    } catch (error) {
      return utils.build.failBuild("Failure message", error);
    }
  },
};
