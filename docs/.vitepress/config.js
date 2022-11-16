const {sidebar, nav} = require("./sideBar")

export default {
  base: "/blog",
  title: "始于清风",
  description: "'帅小伙' 的知识世界 ",
  themeConfig: {
    siteTitle: "始于清风",
    logo: "/logo.png",
    socialLinks: [
      { icon: "github", link: "https://github.com/a572251465" }
    ],
    // 表示横向导航
    nav: [
      {
        text: "技术世界",
        items: nav
      }
    ],
    sidebar
  }
}