import React, { useCallback, useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { ethers, Contract } from 'ethers'
import { useAppDispatch } from 'state'
import { updateUserAllowance } from 'state/actions'
import { useTranslation } from 'contexts/Localization'
import { useCake, useSousChef, useMorebnb } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import useLastUpdated from 'hooks/useLastUpdated'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'

// Approve DEFI auto pool
export const useHeraApprove = (setLastUpdated: () => void) => {
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { t } = useTranslation()
  const { toastSuccess, toastError } = useToast()
  const morebnbContract = useMorebnb()
  const { callWithGasPrice } = useCallWithGasPrice()
  const cakeContract = useCake()

  const handleApprove = async () => {
    const tx = await callWithGasPrice(cakeContract, 'approve', [morebnbContract.address, ethers.constants.MaxUint256])
    setRequestedApproval(true)
    const receipt = await tx.wait()
    if (receipt.status) {
      toastSuccess(
        t('Contract Enabled'),
        // <ToastDescriptionWithTx txHash={receipt.transactionHash}>
        //   {t('You can now stake in the %symbol% vault!', { symbol: 'DEFI' })}
        // </ToastDescriptionWithTx>,
      )
      setLastUpdated()
      setRequestedApproval(false)
    } else {
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
      setRequestedApproval(false)
    }
  }

  return { handleApprove, requestedApproval }
}

export const useCheckHeraApprovalStatus = () => {
  const [isHeraApproved, setIsHeraApproved] = useState(false)
  const { account } = useWeb3React()
  const cakeContract = useCake()
  // const cakeHeraContract = useCakeHeraContract()
  const morebnbContract = useMorebnb()
  const { lastUpdated, setLastUpdated } = useLastUpdated()
  useEffect(() => {
    const checkApprovalStatus = async () => {
      try {
        const currentAllowance = await cakeContract.allowance(account, morebnbContract.address)
        setIsHeraApproved(currentAllowance.gt(0))
      } catch (error) {
        setIsHeraApproved(false)
      }
    }

    checkApprovalStatus()
  }, [account, cakeContract, morebnbContract, lastUpdated])

  return { isHeraApproved, setLastUpdated }
}
