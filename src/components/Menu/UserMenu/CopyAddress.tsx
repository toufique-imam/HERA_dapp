import React, { useState } from 'react'
import { Box, CopyIcon, Card, Button, Flex, Text, FlexProps, IconButton } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'

interface CopyAddressProps extends FlexProps {
  account: string
}

const Wrapper = styled(Flex)`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.dropdown};
  border-radius: 16px;
  position: relative;
`

const Address = styled.div`
  flex: 1;
  // position: relative;
  // padding-left: 16px;

  & > input {
    background: transparent;
    border: 0;
    color: ${({ theme }) => theme.colors.text};
    display: block;
    font-weight: 600;
    font-size: 16px;
    padding: 0;
    width: 100%;

    &:focus {
      outline: 0;
    }
  }

  &:after {
    background: linear-gradient(
      to right,
      ${({ theme }) => theme.colors.background}00,
      ${({ theme }) => theme.colors.background}E6
    );
    content: '';
    height: 100%;
    pointer-events: none;
    position: absolute;
    right: 0;
    top: 0;
    width: 40px;
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

const ButtonMore = styled(Button)`
  height: 40px !important;
  // margin-top: 20px;
  // padding: 20px;
  @media (max-width: 742px) {
    margin-top: 20px;
  }
`
const StyledCard = styled.div`
  display: flex;
  flex-flow: row;
  justify-content: center;
  // padding: 1.3rem;
  // margin-top: 1rem;
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
      <StyledCard>
        <ButtonMore onClick={copyAddress}>
          <Text style={{fontSize: "14px", color: "white", textAlign: "center" }}>Copy</Text>
        </ButtonMore>
      </StyledCard>
      <Tooltip isTooltipDisplayed={isTooltipDisplayed}>{t('Copied')}</Tooltip>
    </Box>
  )
}

export default CopyAddress
