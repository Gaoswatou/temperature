const autoprefixer = require("autoprefixer");
const pxtorem = require("postcss-pxtorem");
module.exports = {
  publicPath: process.env.NODE_ENV === "./" ? "/mobile/" : "./",
  css: {
    css: {
      loaderOptions: {
        postcss: {
          plugins: [
            autoprefixer(),
            pxtorem({
              rootValue: 75,
              propList: ["*"]
            })
          ]
        }
      }
    }
  }
};
