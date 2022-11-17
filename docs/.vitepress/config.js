const { sidebar, nav } = require("./sideBar");
const works = require("./works");

export default {
  base: "/blog",
  title: "始于清风",
  description: "'帅小伙' 的知识世界 ",
  plugins: [
    "@vuepress/active-header-links",
    "@vuepress/back-to-top",
    "@vuepress/medium-zoom",
    "@vuepress/nprogress",
  ],
  themeConfig: {
    siteTitle: "始于清风",
    logo: "/logo.png",
    // 启动页面丝滑滚动
    smoothScroll: true,
    socialLinks: [{ icon: "github", link: "https://github.com/a572251465" }],
    // 表示横向导航
    nav: [
      {
        text: "技术世界",
        items: nav,
      },
      {
        text: "产品世界",
        items: works,
      },
    ],
    sidebar,
  },
};
