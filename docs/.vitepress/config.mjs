import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/docs/",
  title: "ZBC服务器",
  description: "笨蛋学渣什么都没有留下",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '主页', link: '/' },
      { text: '查看服规', link: '/Rules.md' }
    ],

    sidebar: [
      {
        text: '指南',
        items: [
          { text: '服规', link: '/Rules.md' },
          { text: '赞助', link: '/Sponsor.md' },
          { text: '封神榜', link: '/BanList.md' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/zhaQvQ/ZBC-Server' }
    ]
  }
})
