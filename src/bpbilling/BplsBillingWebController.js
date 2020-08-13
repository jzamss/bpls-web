import React from 'react'

import { EPayment } from 'rsi-react-filipizen-components'
import OnlineBplsBilling from './OnlineBplsBilling'

const BplsBillingWebController = (props) => {
  const module = { title: 'Business Online Billing', component: OnlineBplsBilling }
  return <EPayment module={module} {...props} />
}

export default BplsBillingWebController
