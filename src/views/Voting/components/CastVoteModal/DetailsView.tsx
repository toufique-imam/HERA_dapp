import React from 'react'
import { Text, Flex } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { formatNumber } from 'utils/formatBalance'
import { VotingBox, ModalInner } from './styles'

interface DetailsViewProps {
  total: number
  cakeBalance: number
  cakeVaultBalance: number
  cakePoolBalance: number
  poolsBalance: number
  cakeBnbLpBalance: number
}

const DetailsView: React.FC<DetailsViewProps> = ({
  total,
  cakeBalance,
  cakeVaultBalance,
  cakePoolBalance,
  poolsBalance,
  cakeBnbLpBalance,
}) => {
  const { t } = useTranslation()

  return (
    <ModalInner mb="0">
      <Text as="p" mb="24px" fontSize="14px" color="textSubtle">
        {t(
          'Your voting power is determined by the amount of DEFI you held at the block detailed below. DEFI held in other places does not contribute to your voting power.',
        )}
      </Text>
      <Text color="secondary" textTransform="uppercase" mb="4px" bold fontSize="14px">
        {t('Overview')}
      </Text>
      <VotingBox>
        <Text color="secondary">{t('Your Voting Power')}</Text>
        <Text bold fontSize="20px">
          {formatNumber(total, 0, 3)}
        </Text>
      </VotingBox>
      <Text color="secondary" textTransform="uppercase" mb="4px" bold fontSize="14px">
        {t('Your DEFI Held Now')}
      </Text>
      <Flex alignItems="center" justifyContent="space-between" mb="4px">
        <Text color="textSubtle" fontSize="16px">
          {t('Wallet')}
        </Text>
        <Text textAlign="right">{formatNumber(cakeBalance, 0, 3)}</Text>
      </Flex>
      <Flex alignItems="center" justifyContent="space-between" mb="4px">
        <Text color="textSubtle" fontSize="16px">
          {t('Manual DEFI Pool')}
        </Text>
        <Text textAlign="right">{formatNumber(cakePoolBalance, 0, 3)}</Text>
      </Flex>
      <Flex alignItems="center" justifyContent="space-between" mb="4px">
        <Text color="textSubtle" fontSize="16px">
          {t('Auto DEFI Pool')}
        </Text>
        <Text textAlign="right">{formatNumber(cakeVaultBalance, 0, 3)}</Text>
      </Flex>
      <Flex alignItems="center" justifyContent="space-between" mb="4px">
        <Text color="textSubtle" fontSize="16px">
          {t('Other DeFiChip Pools')}
        </Text>
        <Text textAlign="right">{formatNumber(poolsBalance, 0, 3)}</Text>
      </Flex>
      <Flex alignItems="center" justifyContent="space-between" mb="4px">
        <Text color="textSubtle" fontSize="16px">
          {t('DEFI BNB LP')}
        </Text>
        <Text textAlign="right">{formatNumber(cakeBnbLpBalance, 0, 3)}</Text>
      </Flex>
    </ModalInner>
  )
}

export default DetailsView
