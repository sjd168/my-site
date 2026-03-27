export default defineAppConfig({
  pages: ["pages/index/index", "pages/about/index", "pages/post/index"],
  window: {
    navigationBarTitleText: "我的博客",
    navigationBarBackgroundColor: "#ffffff",
    navigationBarTextStyle: "black",
    backgroundTextStyle: "light",
  },
  tabBar: {
    color: "#6b7280",
    selectedColor: "#111827",
    backgroundColor: "#ffffff",
    borderStyle: "black",
    list: [
      {
        pagePath: "pages/index/index",
        text: "首页",
      },
      {
        pagePath: "pages/about/index",
        text: "关于我",
      },
    ],
  },
  style: "v2",
  sitemapLocation: "sitemap.json",
});
