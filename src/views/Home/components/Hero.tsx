import React, { useState, useMemo, useCallback } from 'react'
import styled, { keyframes } from 'styled-components'
import { Link } from 'react-router-dom'
import { Flex, Box, Text, Heading, Button, Card, Skeleton } from '@pancakeswap/uikit'
import { useGetBnbBalance, useTotalSupply, useCakeLPBalance, useCakeTreasuryBalance } from 'hooks/useTokenBalance'
import { useWeb3React } from '@web3-react/core'
import { usePriceCakeBusd } from 'state/farms/hooks'
import { useTranslation } from 'contexts/Localization'
import { BIG_ZERO } from 'utils/bigNumber'
import BigNumber from 'bignumber.js'
import { useCake, useMorebnb, useHeraBnbLp } from 'hooks/useContract'
import ConnectWalletButton from 'components/ConnectWalletButton'
import useTheme from 'hooks/useTheme'
import { formatNumber, getBalanceAmount, getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import { SlideSvgDark, SlideSvgLight } from './SlideSvg'
import CompositeImage, { getSrcSet, CompositeImageProps } from './CompositeImage'

const flyingAnim = () => keyframes`
  from {
    transform: translate(0,  0px);
  }
  50% {
    transform: translate(-5px, -5px);
  }
  to {
    transform: translate(0, 0px);
  }
`

const fading = () => keyframes`
  from {
    opacity: 0.9;
  }
  50% {
    opacity: 0.1;
  }
  to {
    opacity: 0.9;
  }
`

const BgWrapper = styled.div`
  z-index: -1;
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  bottom: 0px;
  left: 0px;
`

const FlexDetail = styled(Flex)`
  min-width: 1000px;
  margin: auto;
  padding-top: 50px;

  @media only screen and (max-width: 768px) {
    max-width: 768px;
  }
`

const BunnyWrapper = styled.div`
  width: 100%;
  animation: ${flyingAnim} 3.5s ease-in-out infinite;
`

const StarsWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;

  & :nth-child(2) {
    animation: ${fading} 2s ease-in-out infinite;
    animation-delay: 1s;
  }

  & :nth-child(3) {
    animation: ${fading} 5s ease-in-out infinite;
    animation-delay: 0.66s;
  }

  & :nth-child(4) {
    animation: ${fading} 2.5s ease-in-out infinite;
    animation-delay: 0.33s;
  }
`

const CardDetail = styled(Card)`
  width: 100%;
  margin: 20px;

  @media only screen and (max-width: 600px) {
    margin: 0 0 20px;
  }
`

const CardBeauty = styled(Card)`
  width: 100%;
  margin: 20px;
  background: linear-gradient(to right, rgb(0, 255, 209), rgb(0, 240, 255), rgb(255, 0, 249));
  
  @media only screen and (max-width: 600px) {
    margin: 0 0 20px;
  }
`

const ButtonMore = styled(Button)`
  // width: 100%;
  // margin-top: 20px;
  // padding: 20px;
`

const StyledCard = styled.div`
  display: flex;
  flex-flow: row;
  justify-content: center;
  padding: 1.3rem;
  margin-top: 1rem;
  a {
    margin: 0 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover {
      transform: scale(1.1);
    }
    img {
      height: 50px;
      width: 50px;
    }
  
  }
  @media (max-width: 742px) {
    a {
      margin: 0 3px;
      display: flex;
      justify-content: center;
      align-items: center;
      &:hover {
        transform: scale(1.1);
      }
    }
  }
  @media (max-width: 523px) {
    a {
      margin: 0 3px;
      display: flex;
      justify-content: center;
      align-items: center;
      &:hover {
        transform: scale(1.1);
      }
    }
  }
`

const TextValue = styled.div`
  font-size: 36px;
  font-weight: bold;
  margin-top: 15px;
`

const FlexMarket = styled(Flex)`
  justify-content: space-around;
  @media (max-width: 523px) {
    display: block;
  }
`

const imagePath = '/images/home/lunar-bunny/'
const imageSrc = 'bunny'

const starsImage: CompositeImageProps = {
  path: '/images/home/lunar-bunny/',
  attributes: [
    { src: 'star-l', alt: '3D Star' },
    { src: 'star-r', alt: '3D Star' },
    { src: 'star-top-r', alt: '3D Star' },
  ],
}

const Hero = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()

  const cakePriceBusd = usePriceCakeBusd()
  const cakeContract = useCake()
  const morebnbContract = useMorebnb()
  const useHeraBnbLpContract = useHeraBnbLp()
  const circulatingSupplyCake = useTotalSupply()
  const dollarTotalBalance = circulatingSupplyCake ? circulatingSupplyCake.times(cakePriceBusd) : BIG_ZERO

  const heraLPBalance = getBalanceNumber(useCakeLPBalance(cakeContract.address)) * 2
  const heraTreasuryBalance = getBalanceNumber(useCakeTreasuryBalance('0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56'))

  const dollarHeraLiquidity = heraLPBalance ? new BigNumber(heraLPBalance).times(cakePriceBusd) : BIG_ZERO
  const dollarHeraTreasury = heraTreasuryBalance ? new BigNumber(heraTreasuryBalance) : BIG_ZERO

  // const [val, setVal] = useState('')
  const [pendingTx, setPendingTx] = useState(false)
  const { balance : bnbbalance } = useGetBnbBalance()

  return (
    <>
      <Flex
        position="relative"
        flexDirection={['column-reverse', null, null, 'row']}
        alignItems={['flex-end', null, null, 'center']}
        justifyContent="space-around"
        mt={[account ? '30px' : '50px', null, 0]}
        id="homepage-hero"
      >
        <CardDetail>
          <FlexMarket>
            <Box p={['16px', '16px', '24px']}>
              <Text>Marketcap</Text>
              <TextValue>${getFullDisplayBalance(dollarTotalBalance, 18, 1)}</TextValue>
            </Box>
            <Box p={['16px', '16px', '24px']}>
              <Text>Total Supply</Text>
              <TextValue>{getFullDisplayBalance(circulatingSupplyCake, 18, 1)}</TextValue>
            </Box>
            {/* <Box p={['16px', '16px', '24px']}>
              <Text>Holders</Text>
              <TextValue>$66.66M</TextValue>
            </Box> */}
            <Box p={['16px', '16px', '24px']}>
              <Text>Hera Price</Text>
              <TextValue>{cakePriceBusd.toNumber().toFixed(6)}</TextValue>
            </Box>
          </FlexMarket>
        </CardDetail>
      </Flex>
      <Flex
        position="relative"
        flexDirection={['column-reverse', null, null, 'row']}
        alignItems={['flex-end', null, null, 'center']}
        justifyContent="space-around"
        mt={[account ? '30px' : '50px', null, 0]}
        id="homepage-hero"
      >
        <CardBeauty>
          <Box p={['16px', '16px', '24px']}>
            <Text>Liquidity</Text>
            <TextValue> ${ dollarHeraLiquidity.toNumber().toFixed(2) }</TextValue>
          </Box>
        </CardBeauty>
        <CardBeauty>
          <Box p={['16px', '16px', '24px']}>
            <Text>Treasury</Text>
            <TextValue>${ dollarHeraTreasury.toNumber().toFixed(3) }</TextValue>
          </Box>
        </CardBeauty>
      </Flex>
      <Flex
        position="relative"
        flexDirection={['column-reverse', null, null, 'row']}
        alignItems={['flex-end', null, null, 'center']}
        justifyContent="space-around"
        mt={[account ? '30px' : '50px', null, 0]}
        id="homepage-hero"
      >
        <CardDetail>
          <Box p={['16px', '16px', '24px']}>
            <Text bold color="secondary">
              {t('Earn with our auto-compounding vault every 3 seconds!')}
            </Text>
            
            <Text style={{ paddingTop: '15px' }}>Stake your $HERA in our auto-compounding vault and get rewarded every 3 seconds with our 137,640% APY (0.5% daily reward + 1.5% daily from price increase)</Text>
            {/* <Text>Try your luck</Text> */}
            {/* <a href="https://discord.com/app.hera" target="_blank" rel="noreferrer">
              <Flex>
                <Text bold >
                  {t('0x6E0Eea417AcA04241a86Ef13c5A60A6C14b70711')}
                </Text>
              </Flex>
            </a> */}
          </Box>
        </CardDetail>
        {/* <CardBeauty>
          <Box p={['16px', '16px', '24px']}>
            <Text bold color="secondary">
              {t('Game')}
            </Text>
            <Text>Try your luck</Text>
            <Text style={{ paddingTop: '15px' }}>Playing the Titano Hera gives you a chance to win huge prizes. It&apos;s easy, fair.</Text>
          </Box>
        </CardBeauty> */}
      </Flex>
      <Flex
        position="relative"
        flexDirection={['column-reverse', null, null, 'row']}
        alignItems={['flex-end', null, null, 'center']}
        justifyContent="space-around"
        mt={[account ? '20px' : '30px', null, 0]}
        id="homepage-hero"
        maxWidth="100%"
      >
        <CardDetail >
          <Box p={['15px', '16px', '5px']}>
            <Text style={{ fontSize: '36px', textAlign: 'center' }}>Still got question?</Text>
            <StyledCard>
              <ButtonMore>
                <a href="https://gitbook.hera.com"  target="_blank" rel="noreferrer">
                  <Text style={{fontSize: "20px", color: "white"}}>More Details<span style={{ paddingLeft: '8px' }}> &gt;</span></Text>
                </a>
              </ButtonMore>
            </StyledCard>
          </Box>
        </CardDetail>
        <CardDetail >
          <Box p={['15px', '16px', '5px']}>
            <Text style={{ fontSize: '36px', textAlign: 'center' }}>Connect with us</Text>
            <StyledCard>
              <a href="https://twitter.com/app.hera" target="_blank" rel="noreferrer">
                <img src="/images/twitter.png" alt='twitter'/>
              </a>
              <a href="https://t.me/app.hera" target="_blank" rel="noreferrer">
              <img src="/images/telegram.png" alt='telegram'/>
              </a>
              <a href="https://discord.com/app.hera" target="_blank" rel="noreferrer">
                <img src="/images/discord.png" alt='discord'/>
              </a>
              <a href="https://medium.com/app.hera" target="_blank" rel="noreferrer">
                <img src="/images/medium.png" alt='medium'/>
              </a>
            </StyledCard>
          </Box>
        </CardDetail>
      </Flex>
    </>
  )
}

export default Hero
