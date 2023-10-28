const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

// With JSDoc @type annotations, IDEs can provide config autocompletion
/** @type {import('@docusaurus/types').DocusaurusConfig} */
(module.exports = {
  title: 'whoer ips',
  tagline: 'whoer ips',
  url: 'https://whoerips.com',
  baseUrl: '/',
  trailingSlash: false, // Needed for Gh pages - https://github.com/facebook/docusaurus/issues/5026
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'whoer ips', // Usually your GitHub org/user name.
  projectName: 'whoer ips', // Usually your repo name.
  plugins: [
    "./postcss-tailwind-loader"
  ],
  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/jy95/i18n-tools/edit/master/website/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/jy95/i18n-tools/edit/master/website/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      algolia: {
        appId: 'L8HFQGH6GF',
        apiKey: 'e8b62ed43826085b41fcf6056c7fe4dd',
        indexName: 'i18n-tool'
      },
      navbar: {
        title: 'whoer ips',
        logo: {
          alt: 'whoer ips',
          // src: 'img/logo.svg',
          src: 'img/logo003.png',
        },
        items: [
          // {
          //   type: 'doc',
          //   docId: 'installation',
          //   position: 'left',
          //   label: 'Tutorial',
          // },
          {to: '/blog', label: 'Blog', position: 'left'},
          // {
          //   href: 'https://github.com/jy95/i18n-tools',
          //   label: 'GitHub',
          //   position: 'right',
          // },
        ],
      },
      footer: {
        style: 'dark',
        copyright: `Copyright © ${new Date().getFullYear()} whoer ips.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['csv']
      },
    }),
});
