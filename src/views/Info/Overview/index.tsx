import BigNumber from 'bignumber.js'
import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from "react-redux";
import styled from 'styled-components'
import { Flex, Box, Text, Heading, Card, Skeleton, Input, Button, CakePrice } from '@pancakeswap/uikit'
import { fromUnixTime } from 'date-fns'
import { formatNumber, getBalanceAmount, getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import { useTranslation } from 'contexts/Localization'
import { usePriceCakeBusd } from 'state/farms/hooks'
import { useCake, useMorebnb } from 'hooks/useContract'
import useTokenBalance, { useTotalSupply } from 'hooks/useTokenBalance'
import useToast from 'hooks/useToast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import Page from 'components/Layout/Page'
import LineChart from 'views/Info/components/InfoCharts/LineChart'
import TokenTable from 'views/Info/components/InfoTables/TokensTable'
import PoolTable from 'views/Info/components/InfoTables/PoolsTable'
import { formatAmount } from 'views/Info/utils/formatInfoNumbers'
import { useUserinfo, useTotalReferralBonus } from 'hooks/useMorebnb'
import BarChart from 'views/Info/components/InfoCharts/BarChart'
import {
  useAllPoolData,
  useAllTokenData,
  useProtocolChartData,
  useProtocolData,
  useProtocolTransactions,
} from 'state/info/hooks'
import TransactionTable from 'views/Info/components/InfoTables/TransactionsTable'
import IconStatBox from 'views/Teams/components/IconStatBox'
import CopyAddress from 'components/Menu/UserMenu/CopyAddress'
import { BASE_URL } from 'config';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import Cookies from 'universal-cookie';
import { isAddress } from 'utils';
import { useCheckHeraApprovalStatus, useHeraApprove } from 'hooks/useApproveHera'
import { CurrencyAmount } from '@pancakeswap/sdk';
import { BIG_ZERO } from 'utils/bigNumber';
import DepositCard from '../depositCard'
import WithdrawCard from '../withdrawCard'
import { ROUTER_ADDRESS } from '../../../config/constants'
import rot13 from '../../../utils/endoce'


export const ChartCardsContainer = styled(Flex)`
justify-content: space-between;
flex-direction: column;
width: 100%;
  padding: 0;
  gap: 1em;
  margin-top: 30px;

  & > * {
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  } ;
`

const ButtonMore = styled(Button)`
  height: 40px !important;
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
  margin: 20px 0 10px;
`

const Tooltip = styled.div<{ isTooltipDisplayed: boolean }>`
  display: ${({ isTooltipDisplayed }) => (isTooltipDisplayed ? 'inline-block' : 'none')};
  position: absolute;
  padding: 8px;
  top: -38px;
  right: 0;
  text-align: center;
  background-color: ${({ theme }) => theme.colors.contrast};
  color: ${({ theme }) => theme.colors.invertedContrast};
  border-radius: 16px;
  opacity: 0.7;
  width: 100px;
`

const FlexReferral = styled(Flex)`
  justifyContent: space-between;

  @media only screen and (max-width: 600px) {
    display: block;
  }
`

const FlexInput = styled(Flex)`
  justifyContent: space-between;

  @media only screen and (max-width: 600px) {
    display: flex;
  }
`

const MaxButton = styled(Button)`
  align-items: center;
  border-radius: 10px;
  borderRadius: 10px;
  margin: 5px;
  height: 40px;
  width: 120px;
  @media (max-width: 742px) {
    display: block;
    margin-left: 60px;
  }
  @media (max-width: 523px) {
    display: block;
    margin-left: 60px;

  }
`

const Overview: React.FC = () => {
  const userInfo = useUserinfo()
  const cakeContract = useCake()
  const morebnbContract = useMorebnb()
  const cakePriceBusd = usePriceCakeBusd()
  const { account } = useActiveWeb3React()
  const { toastSuccess, toastError } = useToast()
  const { balance: cakeBalance } = useTokenBalance(cakeContract.address)
  const userCakeBalance = getBalanceAmount(cakeBalance)
  const dollarUserBalance = userCakeBalance.times(cakePriceBusd)

  const { isHeraApproved, setLastUpdated } = useCheckHeraApprovalStatus()
  const { handleApprove } = useHeraApprove(setLastUpdated)
  // const tReferrals = userInfo.fetchStatus === 'success' ? userInfo.info.toString() : '0'
  const userStakedBalance = parseFloat(userInfo.info)
  const userStakedHera = userStakedBalance ? new BigNumber(userStakedBalance) : BIG_ZERO
  const dollarUserStakedBalance = userStakedHera.times(cakePriceBusd)
  const cookies = new Cookies()

  const circulatingSupplyCake = useTotalSupply()
  const dollarTotalBalance = circulatingSupplyCake ? circulatingSupplyCake.times(cakePriceBusd) : BIG_ZERO

  let ref
  
  if(cookies.get('ref')) {
    if(isAddress( rot13(cookies.get('ref')) )) {
      ref = rot13(cookies.get('ref'))
    }
  } else {
    ref = "0x0000000000000000000000000000000000000000"
  }
  const referlink = account ? `${BASE_URL}/?ref=${rot13(account)}` : `${BASE_URL}/?ref=`

  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  
  // deposit
  const [DepositVal, setDepositVal] = useState('0')

  const maxBalance = useMemo(() => {
    return getFullDisplayBalance(cakeBalance)
  }, [cakeBalance])

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      if (e.currentTarget.validity.valid) {
        setDepositVal(e.currentTarget.value.replace(/,/g, '.'))
      }
    },
    [setDepositVal],
  )

  const handleSelectMax = useCallback(() => {
    setDepositVal(maxBalance)
  }, [maxBalance, setDepositVal])

  // withdraw
  const [WithdrawVal, setWithdrawVal] = useState('0')

  // const maxWithdrawBalance = getFullDisplayBalance(userStakedHera)
  const maxWithdrawBalance = getFullDisplayBalance(userStakedHera)

  const handleWithdrawChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      if (e.currentTarget.validity.valid) {
        setWithdrawVal(e.currentTarget.value.replace(/,/g, '.'))
      }
    },
    [setWithdrawVal],
  )

  const handleSelectWithdrawMax = useCallback(() => {
    setWithdrawVal(maxWithdrawBalance)
  }, [maxWithdrawBalance, setWithdrawVal])

  return (
    <Page>
      <ChartCardsContainer>
        <Card>
          <Box p={['16px', '16px', '24px']}>
            <Text bold >
              {t('APY')}
            </Text>
            <TextValue>
              {t('137,640%')}
            </TextValue>
            <Text bold>
              {t('Daily ROI 2%')}
            </Text>
          </Box>
        </Card>
        <Card>
          <Box p={['16px', '16px', '24px']}>
            {/* <Text bold color="secondary"> */}
            <Text bold>
              {t('Your Balance')}
            </Text>
            <TextValue>
              ${dollarUserBalance.toNumber().toFixed(4)}
            </TextValue>
            <Text bold>
              {formatNumber(userCakeBalance.toNumber())}
              {t(' HERA')}
            </Text>
          </Box>
        </Card>
      </ChartCardsContainer>
      <ChartCardsContainer>
        <Card>
          <Box p={['16px', '16px', '24px']}>
            <Text bold >
              {t('Your Staked Balance')}
            </Text>
            <TextValue>
              ${ getFullDisplayBalance(dollarUserStakedBalance, 18, 5) }
            </TextValue>
            <Text>
              {getFullDisplayBalance(userStakedHera, 18, 1)}
              {t(' HERA')}
            </Text>
          </Box>
        </Card>
        <Card>
          <Box p={['16px', '16px', '24px']}>
            <Text bold >
              {t('Your Earnings/Daily')}
            </Text>
            <TextValue>
              ${ Number(getFullDisplayBalance(dollarUserStakedBalance, 18, 2)) * 0.02 }
            </TextValue>
            <Text>
              {Number(getFullDisplayBalance(userStakedHera, 18, 2))  * 0.02}
              {t(' HERA')}
            </Text>
          </Box>
        </Card>
      </ChartCardsContainer>
      <ChartCardsContainer>
        <DepositCard/>
        <WithdrawCard />
      </ChartCardsContainer>
      <ChartCardsContainer>
        <Card>
          <Box p={['16px', '16px', '24px']}>
            <Flex style={{ justifyContent: 'space-between' }}>
              <Text>Marketcap</Text>
              <Text>${getFullDisplayBalance(dollarTotalBalance, 18, 1)}</Text>
            </Flex>
          </Box>
          <Box p={['16px', '16px', '24px']}>
            <Flex style={{ justifyContent: 'space-between' }}>
              <Text>Total Supply</Text>
              <Text>{getFullDisplayBalance(circulatingSupplyCake, 18, 1)}</Text>
            </Flex>
          </Box>
          <Box p={['16px', '16px', '24px']}>
            <Flex style={{ justifyContent: 'space-between' }}>
              <Text>Hera Price</Text>
              <Text>{cakePriceBusd.toNumber().toFixed(6)}</Text>
            </Flex>
          </Box>
        </Card>
      </ChartCardsContainer>
      <ChartCardsContainer>
        <Card>
          <Box p={['16px', '16px', '24px']}>
            <Text style={{ marginBottom: "20px" }}>Referral Link</Text>
            <FlexReferral>
              <Card style={{ width: "100%", marginRight: "30px" }}>
                <Box style={{ padding: "12px" }}>
                  {referlink}
                </Box>
              </Card>
              <CopyAddress account={referlink} />
            </FlexReferral>
          </Box>
        </Card>
      </ChartCardsContainer>
    </Page>
  )
}

export default Overview
