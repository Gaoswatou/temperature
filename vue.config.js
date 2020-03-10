const path = require("path"); //引入path模块
const autoprefixer = require("autoprefixer");
const pxtorem = require("postcss-pxtorem");
function resolve(dir) {
  return path.join(__dirname, dir); //path.join(__dirname)设置绝对路径
}
module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "./" : "./",
  chainWebpack: config => {
    config.resolve.alias
      .set("@", resolve("./src"))
      .set("components", resolve("./src/components"));
    //set第一个参数：设置的别名，第二个参数：设置的路径
  },
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
