import React from 'react'
import { Box, Button, Text, Heading, ProposalIcon, Flex } from '@pancakeswap/uikit'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import Container from 'components/Layout/Container'
import DesktopImage from './DesktopImage'

const StyledFooter = styled(Box)`
  background: ${({ theme }) => theme.colors.gradients.bubblegum};
  padding-bottom: 32px;
  padding-top: 32px;
`

const Footer = () => {
  const { t } = useTranslation()

  return (
    <StyledFooter>
      <Container>
        <Flex alignItems="center" justifyContent="space-between">
          <Box pr="32px">
            <Heading as="h2" scale="lg" mb="16px">
              {t('Got a suggestion?')}
            </Heading>
            <Text as="p">
              {t('The DeFiSwap protocol is governed and upgraded by DEFI token holders,')}
            </Text>

            <Text as="p" mb="16px">
              {t(
                "We have always believed that together, with the combined power of our community, we can make DeFi truly accessible. With your help managing key adjustments and major changes to the protocol, through our progressively decentralised governance module we can catapulte DeFiSwap to the next level. Each vote in our community has the power to shape our future.",
              )}
            </Text>

              <Button
              startIcon={<ProposalIcon color="currentColor" width="24px" />}
              as={Link}
              to="/voting/proposal/create"
            >
              {t('Make a Proposal')}
            </Button>
          </Box>
          <DesktopImage src="/images/voting/voting-bunny.png" width={173} height={234} />
        </Flex>
      </Container>
    </StyledFooter>
  )
}

export default Footer
