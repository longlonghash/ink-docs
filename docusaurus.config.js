// const BASE_URL = process.env.NODE_ENV === 'development' ? '/' : '/ink-docs/';
// https://docusaurus.io/docs/docusaurus.config.js/#baseurl
const BASE_URL = '/';
module.exports = {
  title: 'LongLongHash',
  tagline: 'My Tagline',
  url: 'https://github.com/longlonghash/ink',
  baseUrl: BASE_URL,
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.ico',
  organizationName: 'longlonghash',
  onBrokenLinks: 'warn',
  projectName: 'ink-docs',
  stylesheets: [
    'fonts/fonts.css'
  ],
  themeConfig: {
    prism: {
      theme: require('prism-react-renderer/themes/duotoneDark'),
      additionalLanguages: ['rust', 'json']
    },
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false
    },
    navbar: {
      title: '',
      logo: {
        alt: 'ink!',
        src: 'img/cell.jpg',
        srcDark: '/img/cell.jpg',
      },
      items: [
        {
          href: 'https://github.com/longlonghash',
          label: 'LongLongHash GitHub',
          position: 'right',
        },
        {
          href: 'https://github.com/longlonghash/ink-docs',
          label: 'Documents GitHub',
          position: 'right',
        },
      ],
    },
  },
  presets: [
    ['@docusaurus/preset-classic', {
      docs: {
        sidebarPath: require.resolve('./sidebars.js'),
        editUrl: 'https://github.com/longlonghash/ink-docs/edit/master/',
        routeBasePath: '/'
      },
      blog: {
        showReadingTime: true,
        editUrl: 'https://github.com/longlonghash/ink-docs/edit/master/',
      },
      theme: {
        customCss: [require.resolve('./src/css/custom.css')],
      },
    }],
  ],
  plugins: [require.resolve('docusaurus-lunr-search')],
};
