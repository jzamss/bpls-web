import React, { useState, useEffect } from "react";
import {
  Panel,
  Text,
  Button,
  ActionBar,
  Label,
  Spacer,
  Table,
  TableColumn,
  Title,
  Loading,
  Service,
  Error,
  currencyFormat

} from "rsi-react-web-components";

import PayOption from "./PayOption";

const TXNTYPE = "bpls";
const ORIGIN = 'filipizen'

const OnlineBplsBilling = (props) => {
  const [mode, setMode] = useState('initial');
  const [error, setError] = useState(props.error);
  const [loading, setLoading] = useState(false);
  const [refno, setRefno] = useState();
  const [showPayOption, setShowPayOption] = useState(false);
  const [bill, setBill] = useState({});
  const [payorderdetails, setPayorderdetails] = useState();
  const [barcode, setBarcode] = useState();
  const [qtr, setQtr] = useState(4);
  
  const { partner, page, contact={}, onCancel, onSubmit } = props
  

  const getBilling = async () => {
    const params = {txntype: TXNTYPE, refno, qtr, showdetails:true};
    const svc = await Service.lookupAsync(`${partner.id}:OnlineBusinessBillingService`);
    return await svc.getBilling(params)
  }

  const loadBill = () => {
    setLoading(true);
    setError(null);
    getBilling().then(o => {
      const bill = o.info;
      bill.amount = o.amount;
      bill.qtr = qtr;
      if (bill.amount == 0) {
        bill.items = [];
      }
      setBill(bill);
      setBarcode(`51001:${bill.billno}`); 					
      setPayorderdetails(o);
      setMode('viewbill');
      setLoading(false)
    }).catch(err => {
      console.log("ERR", err)
      setError(err.toString());
      setLoading(false)
    })
  }

  useEffect(() => {
    if (refno) {
      loadBill();
    }
  }, [qtr])

  const payOptionHandler = (billOption) => {
    setShowPayOption(false)
    setQtr(billOption.billtoqtr);
  }

  const confirmPayment = () => {
    onSubmit({
      refno,
      txntype: TXNTYPE,
      origin: ORIGIN,
      orgcode: partner.id,
      qtr,
      info: { qtr },
      paidby: bill.paidby,
      paidbyaddress: bill.paidbyaddress,
      amount: bill.amount,
      particulars: `Business Tax for Application No. ${bill.appno}`,
    })
  }

  const blur = contact.email !== bill.email;

  return (
    <React.Fragment>
      <Title>{"Online Business Billing"}</Title>
      <Panel visibleWhen={mode === 'initial'}>
        <Label labelStyle={styles.subtitle}>Initial Information</Label>
        <Spacer />
        <Error msg={error} />
        <Text name="appno" caption="BIN or Application No." value={refno} onChange={setRefno} autoFocus={true} />
        <ActionBar>
          <Button caption='Back' variant="text" action={onCancel} />
          <Button caption='Next' action={loadBill} loading={loading} disabled={loading} />
        </ActionBar>
      </Panel>

      <Panel visibleWhen={mode === 'viewbill'} >
        <Label labelStyle={styles.subtitle}>Billing Information</Label>
        <Spacer />
        <Error msg={error} />
        <Loading visibleWhen={loading} />
        <Panel type={{minWidth: 800}}>
          <Label context={bill} caption="Application No." expr="appno" />
          <Label context={bill} caption="Application Type" expr="apptype" />
          <Label context={bill} caption="Date Filed" expr="appdate" />
          <Label context={bill} caption="BIN" expr="bin" />
          <Label context={bill} caption="Trade Name" expr="tradename" blur={blur} />
          <Label context={bill} caption="Owner Name" expr="ownername" blur={blur} />
          <Label context={bill} caption="Business Address" expr="address" blur={blur} />
          <Spacer />
          <Panel style={{display: "flex", justifyContent: "flex-start"}}>
            <Button variant="outlined" caption='Pay Option' action={() => setShowPayOption(true)} />
          </Panel>
          <Table items={bill ? bill.items : []} size="small" showPagination={false} >
            <TableColumn caption="Particulars" expr={item => (item.lobname ? item.lobname : "") +  ` -${item.account}`} />
            <TableColumn caption="Amount" expr="amount" align="right" format="currency" />
            <TableColumn caption="Surcharge" expr="surcharge" align="right" format="currency" />
            <TableColumn caption="Interest" expr="interest" align="right" format="currency" />
            <TableColumn caption="Total" expr="total" align="right" format="currency" />
          </Table>
          <Panel style={{display: "flex", flexDirection: "row", justifyContent: "flex-end", paddingRight: 15}}>
            <Label context={bill} caption="Bill Amount:" expr={item => currencyFormat(item.amount)} />
          </Panel>
        </Panel>
        <ActionBar disabled={loading}>
          <Button caption='Back' variant="text" action={() => setMode("initial")} />
          <Button caption='Confirm Payment' action={confirmPayment} />
        </ActionBar>
      </Panel>

      <PayOption
          initialValue={bill && { qtr }}
          open={showPayOption}
          onAccept={payOptionHandler}
          onCancel={() => setShowPayOption(false)}
        />
    </React.Fragment>
  );
};

const styles = {
  subtitle: {
    fontSize: 16,
    fontWeight: 400,
    opacity: 0.8,
    color: 'green'
  }
}

export default OnlineBplsBilling;
