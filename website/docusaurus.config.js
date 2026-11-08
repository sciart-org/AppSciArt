import { themes as prismThemes } from 'prism-react-renderer'

const REPO_URL = 'https://github.com/sciart-org/AppSciArt'
const PUBLISHED_DOCS = ['project/**/*.md', 'diagrams/**/*.md']

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1)

const capitalizeCategories = (items) => items.map((item) =>
  item.type === 'category'
    ? { ...item, label: capitalize(item.label), items: capitalizeCategories(item.items) }
    : item
)

const config = {
  title: 'AppSciArt',
  tagline: 'Project documentation',
  favicon: 'img/favicon.ico',

  future: {
    v4: true
  },

  url: 'https://sciart-org.github.io',
  baseUrl: '/AppSciArt/',
  organizationName: 'sciart-org',
  projectName: 'AppSciArt',
  trailingSlash: true,

  onBrokenLinks: 'warn',

  markdown: {
    format: 'detect',
    hooks: {
      onBrokenMarkdownLinks: 'warn'
    }
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en']
  },

  presets: [
    [
      'classic',
      {
        docs: {
          path: '../docs',
          include: PUBLISHED_DOCS,
          routeBasePath: '/',
          sidebarPath: './sidebars.js',
          editUrl: ({ docPath }) => `${REPO_URL}/edit/develop/docs/${docPath}`,
          async sidebarItemsGenerator ({ defaultSidebarItemsGenerator, ...args }) {
            return capitalizeCategories(await defaultSidebarItemsGenerator(args))
          }
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css'
        }
      }
    ]
  ],

  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true
    },
    navbar: {
      title: 'AppSciArt',
      items: [
        { type: 'docSidebar', sidebarId: 'docs', position: 'left', label: 'Docs' },
        { href: REPO_URL, label: 'GitHub', position: 'right' }
      ]
    },
    footer: {
      style: 'dark',
      copyright: `Copyright © ${new Date().getFullYear()} AppSciArt. Built with Docusaurus.`
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula
    }
  }
}

export default config
