import React, { useState } from 'react'
import { Box, CopyIcon, Flex, FlexProps, IconButton, Button } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'

interface CopyAddressProps extends FlexProps {
  account: string
}

const Wrapper = styled(Flex)`
  align-items: center;
  background-color: none;
  border-radius: 16px;
  position: relative;
  @media (max-width: 742px) {
    display: block;
  }
  @media (max-width: 523px) {
    display: block;
  }
`
const TextLavel = styled.div`
  font-family: inter !important;
  text-align: center;
  margin-left: 30px;
  font-size: 20px;
  color: #fff;
  padding: 5px;
  weight: 400, regular;
 `

const Address = styled.div`
  display: flex;
  width: 650px;
  margin-right: 20px;
  & > input {
    background: #fff;
    border: 1px solid #fff;
    color: ${({ theme }) => theme.colors.textSubtle};
    display: block;
    font-weight: 620;
    font-size: 16px;
    padding: 5px;
    width: 100%;

    &:focus {
      outline: 0;
    }
  }

  &:after {
    content: '';
    right: 0;
    top: 0;
  }
  @media (max-width: 742px) {
    margin-right: 0px;
    width: 250px;
  }
  @media (max-width: 523px) {
    margin-right: 0px;
    width: 250px;
  }
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

const CopyButton = styled(Button)`
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

const CopyAddress: React.FC<CopyAddressProps> = ({ account, ...props }) => {
  const [isTooltipDisplayed, setIsTooltipDisplayed] = useState(false)
  const { t } = useTranslation()

  const copyAddress = () => {
    if (navigator.clipboard && navigator.permissions) {
      navigator.clipboard.writeText(account).then(() => displayTooltip())
    } else if (document.queryCommandSupported('copy')) {
      const ele = document.createElement('textarea')
      ele.value = account
      document.body.appendChild(ele)
      ele.select()
      document.execCommand('copy')
      document.body.removeChild(ele)
      displayTooltip()
    }
  }

  function displayTooltip() {
    setIsTooltipDisplayed(true)
    setTimeout(() => {
      setIsTooltipDisplayed(false)
    }, 1000)
  }

  return (
    <Box position="relative" {...props}>
      <Wrapper>
        <TextLavel style={{ color: "#fff", marginTop: "8px" }}>{t('Your Referral Link:')}</TextLavel>
        <Address title={account}>
          <input type="text" readOnly value={account} color="#848e9c" />
        </Address>
        <CopyButton
            onClick={copyAddress}
          >
            {t('Copy')}
        </CopyButton>
      </Wrapper>
      <Tooltip isTooltipDisplayed={isTooltipDisplayed}>{t('Copied')}</Tooltip>
    </Box>
  )
}

export default CopyAddress
