export {default as BplsBillingWebController} from "./bpbilling/BplsBillingWebController";

import OnlineBplsBilling from "./bpbilling/OnlineBplsBilling";
import logo from "./assets/images/logo.png";

const plugin = {
  name: "bpls",
  title: "Business",
  logo: logo,
  Component: OnlineBplsBilling
}

export default plugin;
