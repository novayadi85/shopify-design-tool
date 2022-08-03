const path = require("path");

const resolve = dir => path.resolve(__dirname, dir);

module.exports = function (config, env) {
  config.resolve.alias = Object.assign(config.resolve.alias, {
    "@components": resolve("src/components"),
    "@helper": resolve("src/helper"),
    '@store': resolve("src/store"),
    '@routes': resolve("src/routes"),
    '@sidebar': resolve("src/components/sidebar"),
    '@styles': resolve("src/styles"),
    '@icons': resolve("src/components/icons"),
  });

  return config;
};