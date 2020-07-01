module.exports = {
  publicPath:
    process.env.NODE_ENV === "production" ? "/vue-gl-transition" : "/",
  configureWebpack: {
    output: {
      libraryExport: "default",
    },
  },
};
