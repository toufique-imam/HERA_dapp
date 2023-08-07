import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'DeFiSwap',
  description:
    'The most popular AMM on BSC by user count! Earn DEFI through yield farming or win it in the Lottery, then stake it in DeFiChip Pools to earn more tokens! Initial Farm Offerings, NFTs, and more, on a platform you can trust.',
  image: 'https://app.defiswap/images/hero.png',
}

export const getCustomMeta = (path: string, t: ContextApi['t']): PageMeta => {
  let basePath
  if (path.startsWith('/swap')) {
    basePath = '/swap'
  } else if (path.startsWith('/add')) {
    basePath = '/add'
  } else if (path.startsWith('/remove')) {
    basePath = '/remove'
  } else if (path.startsWith('/teams')) {
    basePath = '/teams'
  } else if (path.startsWith('/voting/proposal') && path !== '/voting/proposal/create') {
    basePath = '/voting/proposal'
  } else if (path.startsWith('/nfts/collections')) {
    basePath = '/nfts/collections'
  } else if (path.startsWith('/nfts/profile')) {
    basePath = '/nfts/profile'
  } else if (path.startsWith('/pancake-squad')) {
    basePath = '/pancake-squad'
  } else {
    basePath = path
  }

  switch (basePath) {
    case '/':
      return {
        title: `${t('Home')} | ${t('DefiSwap')}`,
      }
    case '/swap':
      return {
        title: `${t('Exchange')} | ${t('DefiSwap')}`,
      }
    case '/add':
      return {
        title: `${t('Add Liquidity')} | ${t('DefiSwap')}`,
      }
    case '/remove':
      return {
        title: `${t('Remove Liquidity')} | ${t('DefiSwap')}`,
      }
    case '/liquidity':
      return {
        title: `${t('Liquidity')} | ${t('DefiSwap')}`,
      }
    case '/find':
      return {
        title: `${t('Import Pool')} | ${t('DefiSwap')}`,
      }
    case '/competition':
      return {
        title: `${t('Trading Battle')} | ${t('DefiSwap')}`,
      }
    case '/prediction':
      return {
        title: `${t('Prediction')} | ${t('DefiSwap')}`,
      }
    case '/prediction/leaderboard':
      return {
        title: `${t('Leaderboard')} | ${t('DefiSwap')}`,
      }
    case '/farms':
      return {
        title: `${t('Farms')} | ${t('DefiSwap')}`,
      }
    case '/farms/auction':
      return {
        title: `${t('Farm Auctions')} | ${t('DefiSwap')}`,
      }
    case '/pools':
      return {
        title: `${t('Pools')} | ${t('DefiSwap')}`,
      }
    case '/lottery':
      return {
        title: `${t('Lottery')} | ${t('DefiSwap')}`,
      }
    case '/ifo':
      return {
        title: `${t('Initial Farm Offering')} | ${t('DefiSwap')}`,
      }
    case '/teams':
      return {
        title: `${t('Leaderboard')} | ${t('DefiSwap')}`,
      }
    case '/voting':
      return {
        title: `${t('Voting')} | ${t('DefiSwap')}`,
      }
    case '/voting/proposal':
      return {
        title: `${t('Proposals')} | ${t('DefiSwap')}`,
      }
    case '/voting/proposal/create':
      return {
        title: `${t('Make a Proposal')} | ${t('DefiSwap')}`,
      }
    case '/info':
      return {
        title: `${t('Overview')} | ${t('DefiSwap Info & Analytics')}`,
        description: 'View statistics for Defiswap exchanges.',
      }
    case '/info/pools':
      return {
        title: `${t('Pools')} | ${t('DefiSwap Info & Analytics')}`,
        description: 'View statistics for Defiswap exchanges.',
      }
    case '/info/tokens':
      return {
        title: `${t('Tokens')} | ${t('DefiSwap Info & Analytics')}`,
        description: 'View statistics for Defiswap exchanges.',
      }
    case '/nfts':
      return {
        title: `${t('Overview')} | ${t('DefiSwap')}`,
      }
    case '/nfts/collections':
      return {
        title: `${t('Collections')} | ${t('DefiSwap')}`,
      }
    case '/nfts/profile':
      return {
        title: `${t('Your Profile')} | ${t('DefiSwap')}`,
      }
    case '/pancake-squad':
      return {
        title: `${t('Pancake Squad')} | ${t('DefiSwap')}`,
      }
    default:
      return null
  }
}
