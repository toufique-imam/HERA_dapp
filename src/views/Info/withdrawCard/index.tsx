import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Text, Button, Input, InputProps, Flex, Card, Box } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useCake, useMorebnb } from 'hooks/useContract'
import { BigNumber } from 'bignumber.js'
import useToast from 'hooks/useToast'
import { usePriceCakeBusd } from 'state/farms/hooks'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useAppDispatch } from 'state'
import Cookies from 'universal-cookie';
import { useUserinfo, useTotalReferralBonus } from 'hooks/useMorebnb'
import { isAddress } from 'utils';
import { getBalanceAmount, getDecimalAmount, getFullDisplayBalance } from 'utils/formatBalance'
import { BIG_ZERO } from 'utils/bigNumber'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useTokenBalance, { FetchStatus, useGetBnbBalance } from 'hooks/useTokenBalance'
import { useCheckHeraApprovalStatus } from 'hooks/useApproveHera'
import { ToastDescriptionWithTx } from 'components/Toast'
import { fetchCakeVaultUserData } from 'state/pools'
import { DEFAULT_GAS_LIMIT } from 'config'

const getBoxShadow = ({ isWarning = false, theme }) => {
  if (isWarning) {
    return theme.shadows.warning
  }

  return theme.shadows.inset
}

const StyledTokenInput = styled.div<InputProps>`
  display: flex;
  flex-direction: column;
  // background-color: ${({ theme }) => theme.colors.input};
  border-radius: 16px;
  // box-shadow: ${getBoxShadow};
  color: ${({ theme }) => theme.colors.text};
  padding: 8px 16px 8px 0;
  width: 350px;
  
`

const InputLayout = styled(Input)`
  box-shadow: none;
  border-radius: 5px;
  border: 2px solid #3c3742;
  background: #FFFFFF;
`

const FlexInput = styled(Flex)`
  justifyContent: space-between;

  @media only screen and (max-width: 600px) {
    display: flex;
  }
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

const ButtonMore = styled(Button)`
  height: 40px !important;
  // margin-top: 20px;
  // padding: 20px;
`
// interface ModalInputProps {
//   max: string
//   symbol: string
//   onSelectMax?: () => void
//   onChange: (e: React.FormEvent<HTMLInputElement>) => void
//   placeholder?: string
//   value: string
//   addLiquidityUrl?: string
//   inputTitle?: string
//   decimals?: number
//   pid?: number
// }

const ModalInput: React.FC = () => {
  const dispatch = useAppDispatch()
  const userInfo = useUserinfo()
  const cakeContract = useCake()
  const morebnbContract = useMorebnb()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { account } = useActiveWeb3React()
  const { toastSuccess, toastError } = useToast()
  const { balance: cakeBalance } = useTokenBalance(cakeContract.address)
  const userCakeBalance = getBalanceAmount(cakeBalance)

  const userStakedBalance = parseFloat(userInfo.info)
  const userStakedHera = userStakedBalance ? new BigNumber(userStakedBalance) : BIG_ZERO
  
  // withdraw
  const [WithdrawVal, setWithdrawVal] = useState('0')
  const maxWithdrawBalance = getFullDisplayBalance(userStakedHera)
  // const maxWithdrawBalance = useMemo(() => {
  //   return getFullDisplayBalance(userStakedHera)
  // }, [userStakedHera])

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

  const [pendingTx, setPendingTx] = useState(false)
  const handleWithdraw = async (depositValue: string) => {
    console.log("views / DepositCard / depositAmount : ", WithdrawVal)
    setPendingTx(true)
    try {
      // .toString() being called to fix a BigNumber error in prod
      // as suggested here https://github.com/ChainSafe/web3.js/issues/2077
      const withdrawAmount = new BigNumber(WithdrawVal)
      console.log("views / DepositCard / morebnbContract : ", getDecimalAmount(withdrawAmount).toString())
      const tx = await callWithGasPrice(morebnbContract, 'withdraw', [getDecimalAmount(withdrawAmount).toString()], {gasLimit: DEFAULT_GAS_LIMIT})
      console.log("views / DepositCard / fetched")
      const receipt = await tx.wait()
      if (receipt.status) {
        toastSuccess(
          t('Staked!'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('Your funds have been staked in the pool')}
          </ToastDescriptionWithTx>,
        )
        setPendingTx(false)
        // onDismiss()
        dispatch(fetchCakeVaultUserData({ account }))
      }
    } catch (error) {
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
      setPendingTx(false)
    }
  }

  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()

  return (
    <Card>
      <Box p={['16px', '16px', '24px']}>
        <Text bold style={{ paddingBottom: '20px' }}>
          {t('Withdraw')}
        </Text>
        <FlexInput>
          <Input
            placeholder={t('Input %subject%', { subject: t('Value').toLowerCase() })}
            value={WithdrawVal}
            onChange={handleWithdrawChange}
            style={{ position: 'relative', zIndex: 16 }}
          />
          <Button scale="sm" onClick={handleSelectWithdrawMax} style={{color:'#fff', height: "40px", background: "none", borderRadius: "5px", border: "0.5px solid #16172e", marginLeft: "5px" }}>
            {t('Max')}
          </Button>
        </FlexInput>
        <StyledCard>
          <ButtonMore onClick={handleWithdraw}>
            <Text style={{fontSize: "16px", color: "white"}}>Withdraw</Text>
          </ButtonMore>
        </StyledCard>
      </Box>
    </Card>
  )
}

export default ModalInput
