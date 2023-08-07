import { MenuItemsType, DropdownMenuItemType, menuStatus } from '@pancakeswap/uikit'
import { ContextApi } from 'contexts/Localization/types'
// import { nftsBaseUrl } from 'views/Nft/market/constants'

export type ConfigMenuItemsType = MenuItemsType & { hideSubNav?: boolean }

const config: (t: ContextApi['t']) => ConfigMenuItemsType[] = (t) => [
  {
    label: t('Home'),
    href: '/home',
    icon: 'Trophy',
    showItemsOnMobile: false,
    // items: [
    //   {
    //     label: t('Lottery'),
    //     href: '/lottery',
    //   },
    // ],
  },
  // {
  //   label: t('Trade'),
  //   icon: 'Swap',
  //   href: '/swap?outputCurrency=0x55d398326f99059ff775485246999027b3197955',
  //   showItemsOnMobile: false,
  //   items: [
  //     {
  //       label: t('Exchange'),
  //       href: '/swap?outputCurrency=0x55d398326f99059ff775485246999027b3197955',
  //     },
  //     {
  //       label: t('Liquidity'),
  //       href: '/liquidity',
  //     },
  //   ],
  // },
  {
    label: t('Staking'),
    href: '/staking',
    icon: 'Earn',
    showItemsOnMobile: false,
    // items: [
    //   {
    //     label: t('Farms'),
    //     href: '/farms',
    //   },
    //   {
    //     label: t('Pools'),
    //     href: '/pools',
    //   },
    // ],
  },
  // {
  //  label: t('NFT'),
  //   href: `${nftsBaseUrl}`,
  //   icon: 'Nft',
  //   items: [
  //     {
    //     label: t('Overview'),
    //     href: `${nftsBaseUrl}`,
  //     },
    //   {
    //     label: t('Collections'),
    //     href: `${nftsBaseUrl}/collections`,
    //   },
  //   ],
//   },
  {
    label: '',
    href: '/home',
    icon: 'More',
    // hideSubNav: true,
    items: [
      {
        label: t('Chart'),
        href: 'https://dexscreener.com/bsc/0x072856bc98e65ecaf8ca6412567e894617cc62c2',
        type: DropdownMenuItemType.EXTERNAL_LINK,
      },
      {
        label: t('Docs'),
        href: 'https://docs.hera',
        type: DropdownMenuItemType.EXTERNAL_LINK,
      },
      {
        label: t('Swap'),
        href: 'https://app.bogged.finance/bsc/swap?tokenIn=BNB&tokenOut=0x6E0Eea417AcA04241a86Ef13c5A60A6C14b70711',
        type: DropdownMenuItemType.EXTERNAL_LINK,
      },
    //  {
      //     label: t('IFO'),
      //     href: '/ifo',
    //     },
      // {
      //   label: t('Voting'),
      //   href: 'https://snapshot.org/#/defiswap-app.eth',
      //   type: DropdownMenuItemType.EXTERNAL_LINK,
      // },
    //  {
      //  type: DropdownMenuItemType.DIVIDER,
    //    },
      //   {
      //     label: t('Leaderboard'),
      //     href: '/teams',
      //   },
      // {
      //   type: DropdownMenuItemType.DIVIDER,
      // },
      // {
      //   label: t('Blog'),
      //   href: 'https://medium.com/@defiswap_exchange',
      //   type: DropdownMenuItemType.EXTERNAL_LINK,
      // },
    ],
  },
]

export default config
