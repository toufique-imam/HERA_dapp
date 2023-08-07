import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Text, Button, Input, InputProps, Flex, Card, Box } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useCake, useMorebnb } from 'hooks/useContract'
import { BigNumber } from 'bignumber.js'
import useToast from 'hooks/useToast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useAppDispatch } from 'state'
import Cookies from 'universal-cookie';
import { isAddress } from 'utils';
import { useCheckHeraApprovalStatus, useHeraApprove } from 'hooks/useApproveHera'
import useTokenBalance, { FetchStatus, useGetBnbBalance } from 'hooks/useTokenBalance'
import { getBalanceAmount, getDecimalAmount, getFullDisplayBalance } from 'utils/formatBalance'
import { BASE_URL, DEFAULT_GAS_LIMIT } from 'config';
import { useUserinfo } from 'hooks/useMorebnb'
import { usePriceCakeBusd } from 'state/farms/hooks'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { BIG_ZERO } from 'utils/bigNumber'
import { fetchCakeVaultUserData } from 'state/pools'
import { ToastDescriptionWithTx } from 'components/Toast'
import rot13 from '../../../utils/endoce';

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

const ModalInput: React.FC = () => {
  const dispatch = useAppDispatch()
  const userInfo = useUserinfo()
  const cakeContract = useCake()
  const morebnbContract = useMorebnb()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { account } = useActiveWeb3React()
  const { toastSuccess, toastError } = useToast()
  const { balance: cakeBalance } = useTokenBalance(cakeContract.address)

  const { isHeraApproved, setLastUpdated } = useCheckHeraApprovalStatus()
  const { handleApprove } = useHeraApprove(setLastUpdated)
  
  const cookies = new Cookies()
  let ref
  if(cookies.get('ref')) {
    if(isAddress( rot13(cookies.get('ref')) )) {
      ref = rot13(cookies.get('ref'))
    }
  } else {
    ref = "0x0000000000000000000000000000000000000000"
  }
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
  
  const [pendingTx, setPendingTx] = useState(false)
  const handleDeposit = async (depositValue: string) => {
    // console.log("views / DepositCard / depositAmount : ", DepositVal)
    setPendingTx(true)
    try {
      // .toString() being called to fix a BigNumber error in prod
      // as suggested here https://github.com/ChainSafe/web3.js/issues/2077
      const depositAmount = new BigNumber(DepositVal)
      // console.log("views / DepositCard / morebnbContract : ", getDecimalAmount(depositAmount).toString())
      const tx = await callWithGasPrice(morebnbContract, 'deposit', [getDecimalAmount(depositAmount).toString(), ref], {gasLimit: DEFAULT_GAS_LIMIT})
      // console.log("views / DepositCard / fetched")
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

  return (
      <Card>
        <Box p={['16px', '16px', '24px']}>
          <Text bold style={{ paddingBottom: '20px' }}>
            {t('Deposit')}
          </Text>
          <FlexInput>
            <Input
              placeholder={t('Input %subject%', { subject: t('Value').toLowerCase() })}
              value={DepositVal}
              onChange={handleChange}
              style={{ position: 'relative', zIndex: 16 }}
            />
            <Button scale="sm" onClick={handleSelectMax} style={{color:'#fff', height: "40px", background: "none", borderRadius: "5px", border: "0.5px solid #16172e", marginLeft: "5px" }}>
              {t('Max')}
            </Button>
          </FlexInput>
          <StyledCard>
            {!isHeraApproved ? (
              <ButtonMore onClick={handleApprove}>
                <Text style={{fontSize: "16px", color: "white"}}>Approve</Text>
              </ButtonMore>
              // <Button width="100%" disabled={requestedApproval} onClick={handleApprove} variant="secondary">
              //   {t('Enable')}
              // </Button>
            ) : (
              <ButtonMore onClick={handleDeposit}>
                <Text style={{fontSize: "16px", color: "white"}}>Deposit</Text>
              </ButtonMore>
            )}
          </StyledCard>
        </Box>
      </Card>
  )
}

export default ModalInput
