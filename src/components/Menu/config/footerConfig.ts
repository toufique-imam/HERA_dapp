import { FooterLinkType } from '@pancakeswap/uikit'
import { ContextApi } from 'contexts/Localization/types'

export const footerLinks: (t: ContextApi['t']) => FooterLinkType[] = (t) => [
  {
    label: t('About'),
    items: [
      {
        label: t('Contact'),
        href: 'https://docs.app.defiswap/contact-us',
      },
      // {
      //   label: t('Brand'),
      //   href: 'https://docs.app.defiswap/brand-and-logos',
      // },
      // {
      //   label: t('Blog'),
      //   href: 'https://medium.com/@defiswap_exchange',
      // },
      {
        label: t('Community'),
        href: 'https://docs.app.defiswap/contact-us/communities',
      },
      {
        label: t('DEFI Token'),
        href: 'https://docs.titano.finance/titano-token',
      },
      // {
      //   label: '—',
      // },
      // {
      //   label: t('Online Store'),
      //   href: 'https://shop.app.defiswap/',
      //   isHighlighted: true,
      // },
    ],
  },
  {
    label: t('Help'),
    items: [
      {
        label: t('Documentation'),
        href: 'https://docs.app.defiswap/contact-us/customer-support',
      },
      {
        label: t('FAQ'),
        href: 'https://docs.app.defiswap/click-here-for-help/troubleshooting-errors',
      },
      // {
      //   label: t('Guides'),
      //   href: 'https://docs.app.defiswap/',
      // },
    ],
  },
  // {
  //   label: t('Developers'),
  //   items: [
  //     {
  //       label: 'Github',
  //       href: 'https://github.com/',
  //     },
  //     {
  //       label: t('Documentation'),
  //       href: 'https://docs.app.defiswap',
  //     },
  //     {
  //       label: t('Bug Bounty'),
  //       href: 'https://docs.app.defiswap/developers/bug-bounty',
  //     },
  //     {
  //       label: t('Careers'),
  //       href: 'https://docs.app.defiswap/careers/hiring',
  //     },
  //   ],
  // },
]
