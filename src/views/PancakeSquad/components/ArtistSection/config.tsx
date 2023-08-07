import React from 'react'
import { InstagramIcon, TwitterIcon } from '@pancakeswap/uikit'
import { ContextApi } from 'contexts/Localization/types'

type ArtistConfigType = {
  t: ContextApi['t']
  isDark: boolean
}

const artistConfigBuilder = ({ t, isDark }: ArtistConfigType) => ({
  headingText: t('Meet the Artist'),
  bodyText: [
    t('With great ideas come great changes Bitcoins that.'),
    t('Do what you love and the money will follow'),
    t('The most powerful weapon on earth is the human soul on fire'),
    t('Greed is not a financial issue. Its a heart issue'),
    t('Never confuse the size of your paycheck with the size of your talent'),
    t('Never spend your money before you have earned it'),
    t('We love this stuff - bitcoin, ethereum, blockchain technology - and what the future holds'),
    t('Mobile was Internet 2 It changed everything. Crypto is Internet 3.0'),
    t('As consumers adopt crypto, we hope that theyll also be interested in trading equities and options'),
    t('Friendship is like money, easier made than kept'),
  ],
  buttons: [
    {
      to: 'https://twitter.com/',
      text: t('Follow on Twitter'),
      external: true,
      icon: <TwitterIcon fillColor="white" />,
    },
    {
      to: 'https://www.instagram.com/',
      text: t('Follow on Instagram'),
      external: true,
      icon: <InstagramIcon color="white" />,
    },
  ],
  image: { src: `/images/pancakeSquad/artist${isDark ? '-dark' : ''}.png`, alt: 'Chef Cecy bio' },
})

export default artistConfigBuilder
