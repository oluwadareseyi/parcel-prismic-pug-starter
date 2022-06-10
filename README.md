### A boilerplate for building static sites in pug with [Netlify build plugins](https://www.netlify.com/blog/2019/10/16/creating-and-using-your-first-netlify-build-plugin/), bundled with parcel

### How it works:

#### An `onPreBuild` hook exists in plugins/build-pages, this is where we call our functions to fetch data from prismic, and then build the pages, which are then served with Parcel

#### For Development, I have provided a placeholder `data.json` file which is then passed to the `dev.pug` file via `.pugrc.js`, to update the contents of this, in the `main/js/index.js` file, fetch your own data from your Prismic repo and copy/paste from the console logs

### To kickstart the boilerplate, provide a `.env` file with your `PRISMIC_ACCESS_TOKEN` && `PRISMIC_ENDPOINT`, then run the following commands:

```bash
yarn

yarn dev
```

### If you do not have yarn installed, delete the `yarn.lock` file and install via npm,

```bash
npm install

npm run dev
```

### Or install yarn:

```bash
npm install --global yarn
```
