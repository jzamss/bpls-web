import React, { useState } from 'react'
import {
  Box,
  Text,
  Spacer,
  Button,
  Panel,
  EmailVerification,
  EPayment,
  ActionBar,
  Label
} from 'rsi-react-web';

const InitialPage = (props) => {
  const [appno, setAppno] = useState()
  return (
    <Box width={300}>
      <Label>Initial Information</Label>
      <Spacer />
      <Text name='appno' caption='BIN or Application No.' value={appno} onChange={setAppno} />
      <Spacer />
      <ActionBar>
        <Button label="Next" onClick={() => props.onSubmit()}/>
      </ActionBar>
    </Box>
  )
}

const VerificationPage = (props) => {
  const [entity, setEntity] = useState({
    billno: 'B0001',
    billperiod: '2020',
    amount: '1,000.00'
  })

  return (
    <Box width={400}>
      <Label>Verify that billing information is correct</Label>
      <Spacer />
      <Panel context={entity} handler={setEntity} labelWidth={120}>
        <Text name='billno' caption='Bill No.' readOnly />
        <Text name='billperiod' caption='Bill Period' readOnly />
        <Text name='amount' caption='Amount' readOnly />
      </Panel>
      <Spacer />
      <ActionBar>
        <Button caption="Submit" onClick={() => props.onSubmit()} />
      </ActionBar>
    </Box>
  )
}

const pages = [
  {name: 'initbill', caption: 'Initial Billing Information', Component: InitialPage },
  {name: 'verifybill', caption: 'Business Billing Verification', Component: VerificationPage },
  {name: 'epayment', caption: 'EPayment Information', Component: EPayment }
]

const OnlineBillingWebController = (props) => {
  const [contact, setContact] = useState();
  const [pageIndex, setPageIndex] = useState(0);
  const {router} = props;

  const onSubmit = (params = {}) => {
    const newIndex = pageIndex + 1;
    if (!pages[newIndex].params) pages[newIndex].params ={};
    pages[newIndex].params = { ...pages[newIndex].params, ...params };
    setPageIndex(newIndex);
  }

  const onComplete = (params) => {
    pages[pageIndex].params = { ...pages[pageIndex].params, ...params };
    const { partner } = router.location.state;
    props.history.replace(`/partner/${partner.objid}/services`);
  }

  const onVerifyEmail = (contact) => {
    setContact(contact);
  }

  const cancelEmailVerification = () => {
    router.history.push(`/partner/${router.params.partnerId}/services`);
  }

  if (!contact) {
    return <EmailVerification 
      handler={onVerifyEmail} 
      onCancel={cancelEmailVerification} 
      router={router} />

  }
  
  const { Component, params } = pages[pageIndex];
  return (
    <Component {...props} {...params} onSubmit={onSubmit} onComplete={onComplete} router={router}/>
  )
}

export default OnlineBillingWebController
