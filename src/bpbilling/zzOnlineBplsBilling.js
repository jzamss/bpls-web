import React, { useState } from "react";
import {
  Panel,
  Text,
  Button,
  FormPanel,
  ActionBar,
  Label,
  Spacer,
} from "rsi-react-web-components";
import { EmailVerification, EPayment } from "rsi-react-filipizen-components";

const InitialPage = (props) => {
  const [appno, setAppno] = useState();
  return (
    <Panel width={400}>
      <Label>Initial Information</Label>
      <Text
        name="appno"
        caption="BIN or Application No."
        value={appno}
        onChange={setAppno}
      />
      <ActionBar>
        <Button label="Next" onClick={() => props.onSubmit()} />
      </ActionBar>
    </Panel>
  );
};

const VerificationPage = (props) => {
  const [entity, setEntity] = useState({
    billno: "B0001",
    billperiod: "2020",
    amount: "1,000.00",
  });

  return (
    <Panel width={400}>
      <Label>Verify that billing information is correct</Label>
      <Spacer />
      <FormPanel context={entity} handler={setEntity} labelWidth={120}>
        <Text name="billno" caption="Bill No." readOnly />
        <Text name="billperiod" caption="Bill Period" readOnly />
        <Text name="amount" caption="Amount" readOnly />
      </FormPanel>
      <ActionBar>
        <Button caption="Submit" onClick={() => props.onSubmit()} />
      </ActionBar>
    </Panel>
  );
};

const pages = [
  {
    name: "initbill",
    caption: "Initial Billing Information",
    Component: InitialPage,
  },
  {
    name: "verifybill",
    caption: "Business Billing Verification",
    Component: VerificationPage,
  },
  { name: "epayment", caption: "EPayment Information", Component: EPayment },
];

const OnlineBplsBilling = (props) => {
  const [contact, setContact] = useState();
  const [pageIndex, setPageIndex] = useState(0);
  const { router } = props;

  const onSubmit = (params = {}) => {
    const newIndex = pageIndex + 1;
    if (!pages[newIndex].params) pages[newIndex].params = {};
    pages[newIndex].params = { ...pages[newIndex].params, ...params };
    setPageIndex(newIndex);
  };

  const onComplete = (params) => {
    pages[pageIndex].params = { ...pages[pageIndex].params, ...params };
    const { partner } = router.location.state;
    props.history.replace(`/partner/${partner.objid}/services`);
  };

  const onVerifyEmail = (contact) => {
    setContact(contact);
  };

  const cancelEmailVerification = () => {
    router.history.push(`/partner/${router.params.partnerId}/services`);
  };

  if (!contact) {
    return (
      <EmailVerification
        handler={onVerifyEmail}
        onCancel={cancelEmailVerification}
        router={router}
      />
    );
  }

  const { Component, params } = pages[pageIndex];
  return (
    <Component
      {...props}
      {...params}
      onSubmit={onSubmit}
      onComplete={onComplete}
      router={router}
    />
  );
};

export default OnlineBplsBilling;
