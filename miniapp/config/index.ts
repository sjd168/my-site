import { defineConfig } from "@tarojs/cli";

export default defineConfig({
  projectName: "my-site-miniapp",
  date: "2026-03-27",
  designWidth: 750,
  sourceRoot: "src",
  outputRoot: "dist",
  framework: "react",
  plugins: ["@tarojs/plugin-framework-react"],
  compiler: "webpack5",
  cache: {
    enable: false,
  },
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
      },
      url: {
        enable: true,
        config: {
          limit: 1024,
        },
      },
      cssModules: {
        enable: false,
      },
    },
  },
});
