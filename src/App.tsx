import * as React from "react";
import Web3 from "web3";
import * as localforage from "localforage";

import Web3Modal from "@aguycalled/web3modal";
import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress';

import {withRouter} from "react-router-dom";

import {getNativeCurrency} from "./components/AccountAssets";
import * as PouchDB from 'pouchdb';
import Alert from '@material-ui/core/Alert';
import Drawer from "./components/Drawer";
import Button from "@material-ui/core/Button"
import Modal from './components/Modal';
import ModalResult from "./components/ModalResult";
import {Link} from "@material-ui/core";


import { IAssetData } from "./helpers/types";
import {getChainData, getBaseCurrency, hashPersonalMessage, recoverPublicKey} from "./helpers/utilities";

import {
  callBalanceOfToken, callBalanceOf, callBalanceOfLp,
  callTotalSupplyOfToken, isValidChain, callIsRegistered, callRegistered,
  getTokenContract, getLpContract, getNativeContract, getFarmContract,
  callWithdrawRewards, callWithdrawLp, callLpAllowance, callApproveLpDeposit,
  callLpDeposit, callRemoveLiquidity, callBurn, callAddLiquidity,
  callRouterAllowance, callApproveRouterDeposit, callRouterAllowanceNative,
  callApproveRouterDepositNative
} from "./helpers/web3";
import {
  TOKEN_NAME,
  TOKEN_FULL_NAME,
  ELECTRUM_CONFIG,
  BRIDGE_CONFIG,
  TOKEN_CONTRACT,
  GAS_SIZE,
  LP_CONTRACT, FARM_CONTRACT, ROUTER_CONTRACT
} from "./constants";

import styled from '@emotion/styled';

import { ThemeProvider, createTheme, responsiveFontSizes } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import DialogAmount from "./components/DialogAmount";
import {BscConnector} from "@binance-chain/bsc-connector";
import Sign from "./components/Sign";

const queryString = require('query-string');

export let themeOptions = createTheme({
  palette: {
    primary: {
      main: '#5e35b1',
    },
    secondary: {
      main: '#5e35b1',
      contrastText: '#ede7f6',
    },
    text: {
      primary: '#303030',
    },
    background: {
      default: '#eeeeee',
      paper: '#fafafa',
    },
    divider: '#d1c4e9',
  },
  components: {
    // Name of the component
    MuiCard: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
          border: '1px solid #d1c4e9',
          display: 'flex',
          flexDirection: 'column',
          fontSize: '1rem',
          width: '350px',
          height: '500px',
          margin: '10px'
        },
      }
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          flexGrow: 1
        }
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '20px'
        }
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          width: '90%'
        }
      },
    },
    MuiCardActions: {
      styleOverrides: {
        // Name of the slot
        root: {
          display: "flex",
          flexDirection:"column",
          borderTop: '1px solid #d1c4e9',
          padding: '20px',
          alignSelf: 'flex-end',
          marginBottom: '0px auto',
          width: '100%',
          bottom: '0px'
        }
      },
    },
  },
});

themeOptions.spacing(10);
themeOptions= responsiveFontSizes(themeOptions);

const ElectrumClient = require("electrum-client-js");
const Bitcore = require("bitcore-lib")
const Binance = require('node-binance-api');


const SContent = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
  text-align: center;
  min-height: 100%;
  align-items: center;
  padding-top: 20px;
  padding-bottom: 20px;
  padding-left: 20px;
  padding-right: 20px;
`;

const SModalContainer = styled.div`
  width: 100%;
  position: relative;
  word-wrap: break-word;
`;

const SModalTitle = styled.div`
  margin: 1em 0;
  font-size: 20px;
  font-weight: 700;
`;

const SModalParagraph = styled.p`
  margin-top: 30px;
`;

const SContainer = styled.div`
  height: 100%;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  word-break: break-word;
  width: 100%;

`;

interface IBridgeData {
  coldScriptHash: string;
  stakingScriptHash: string;
  blockNumber: number;
}

interface IStakingData {
  stakesCount: number;
  stakingBalance: number;
}

interface IFarmingData {
  navInLp: number;
  lpUserBalance: number;
  lpDepositedBalance: number;
  lpTotalBalance: number;
  lpTotalSupply: number;
  userLpShare: number;
  depositedNavLp: number;
  depositedBnbLp: number;
  pendingTotalRewards: number;
  userRewards: number;
  needApproval: number;
  expectedNavPerYear: number;
  share: number;
  pendingDistribute: number;
  apy: number;
  exchangeName: string;
  reserves: any;
}

export interface IDialogAmount {
  open: boolean;
  text: string;
  title: string;
  button: string;
  result: any;
  balance: string;
  token_balance: number;
  native_balance: number;
  decimals: number;
  error_max_0: string;
  max: number;
  type: string;
}

interface IAppState {
  fetching: boolean;
  fetching_farming: boolean;
  address: string;
  web3: any;
  provider: any;
  connected: boolean;
  chainId: number;
  networkId: number;
  assets: IAssetData[];
  showModal: boolean;
  pendingRequest: boolean;
  result: any | null;
  supply_cold: number;
  supply_bridge: number;
  validChain: boolean;
  bridgeData: IBridgeData;
  stakingData: IStakingData;
  farmingData: IFarmingData;
  section: number;
  deposit_address: string;
  deposit_scripthash: string;
  nav_price: number;
  gas_cost: number;
  is_registered: boolean;
  added_asset: boolean;
  add_wnav_already_asked: boolean;
  dialog_amount: IDialogAmount;
  token_balance: any;
  native_balance: number;
  lp_balance: any;
  location: any;
}

const INITIAL_STATE: IAppState = {
  fetching: false,
  fetching_farming: false,
  address: "",
  web3: null,
  provider: null,
  connected: false,
  chainId: 56,
  networkId: 1,
  assets: [],
  showModal: false,
  pendingRequest: false,
  result: null,
  supply_bridge: 0,
  supply_cold: 0,
  validChain: true,
  bridgeData: {stakingScriptHash: '', coldScriptHash: '', blockNumber: -1},
  stakingData: {stakesCount: 0, stakingBalance: 0},
  farmingData: {
    navInLp: 0,
    lpUserBalance: 0,
    lpDepositedBalance: 0,
    lpTotalBalance: 0,
    lpTotalSupply: 0,
    userLpShare: 0,
    depositedNavLp: 0,
    depositedBnbLp: 0,
    pendingTotalRewards: 0,
    userRewards: 0,
    needApproval: 0,
    expectedNavPerYear: 0,
    share: 0,
    pendingDistribute: 0,
    apy: 0,
    exchangeName: '',
    reserves: {}
  },
  section: 1,
  deposit_address: '',
  deposit_scripthash: '',
  nav_price: 0,
  gas_cost: 0,
  is_registered: false,
  added_asset: false,
  add_wnav_already_asked: false,
  dialog_amount: {
    open: false,
    text: '',
    title: '',
    button: '',
    result: undefined,
    balance: '',
    token_balance: 0,
    native_balance: 0,
    decimals: 0,
    error_max_0: '',
    max: 0,
    type: ''
  },
  token_balance: 0,
  native_balance: 0,
  lp_balance: 0,
  location: 0
};

function initWeb3(provider: any) {
  const web3: any = new Web3(provider);

  web3.eth.extend({
    methods: [
      {
        name: "chainId",
        call: "eth_chainId",
        outputFormatter: web3.utils.hexToNumber
      }
    ]
  });

  return web3;
}

function getBridgeData(chainId: number) {
  if (!isValidChain(chainId)) return {coldScriptHash: '', stakingScriptHash: '', blockNumber: -1};

  let coldAddresses = [];
  let conf = BRIDGE_CONFIG

  for (var i in conf["coldStorage"]["keys"]) {
    let obj = conf["coldStorage"]["keys"][i];

    const childPath = "0x" + chainId + (String(chainId).length % 2 ? '0' : '') + TOKEN_CONTRACT[chainId].address.substr(2) + "c01d";
    let navObj = Bitcore.HDPublicKey(obj).deriveChild(childPath).publicKey

    coldAddresses.push(navObj);
  }

  let multisigScript = Bitcore.Script.buildMultisigOut(coldAddresses, conf["coldStorage"]["requiredSigs"])
  let coldStorageScript = new Bitcore.Script.fromAddresses(conf["stakingPoolAddress"], multisigScript)
  let coldStorageScriptHash =  Buffer.from(Bitcore.crypto.Hash.sha256(coldStorageScript.toBuffer()).reverse()).toString("hex")

  let stakingNavAddressObj = Bitcore.HDPublicKey(conf.publicKeyNav).deriveChild("0x" + String(chainId) + (String(chainId).length % 2 ? '0' : '') + TOKEN_CONTRACT[chainId].address.substr(2) + "5743").publicKey.toAddress('mainnet')
  let stakingNavAddressStr = stakingNavAddressObj.toString()
  let stakingScriptHash =  Buffer.from(Bitcore.crypto.Hash.sha256(Bitcore.Script.buildPublicKeyHashOut(stakingNavAddressObj).toBuffer()).reverse()).toString("hex")

  return {coldScriptHash: coldStorageScriptHash, stakingScriptHash: stakingScriptHash, blockNumber: -1}
}

class App extends React.Component<any, any> {
  // @ts-ignore
  public web3Modal: Web3Modal;
  public state: IAppState;
  public electrumClient: any;
  public binance: any;

  constructor(props: any) {
    super(props);
    this.state = {
      ...INITIAL_STATE,
      ...props
    };

    this.web3Modal = new Web3Modal({
      network: this.getNetwork(),
      cacheProvider: true,
      providerOptions: this.getProviderOptions()
    });

    this.binance = new Binance()

    this.electrumClient = new ElectrumClient(ELECTRUM_CONFIG.host, ELECTRUM_CONFIG.port, ELECTRUM_CONFIG.proto)
  }

  public componentDidMount() {
    if (this.web3Modal && this.web3Modal.cachedProvider) {
      this.onConnect();
    }
  }

  public onConnect = async () => {
    if (!(window.web3 || window.ethereum || window.BinanceChain)) return;

    const provider = await this.web3Modal.connect();

    await this.electrumClient.connect();

    await this.subscribeProvider(provider);

    const web3: any = initWeb3(provider);

    const accounts = await web3.eth.getAccounts();

    const address = accounts[0];

    const networkId = await web3.eth.net.getId();

    const chainId = await web3.eth.chainId();

    const validChain = isValidChain(chainId)

    //const bridgeData : IBridgeData = getBridgeData(chainId);
    //bridgeData.blockNumber = (await this.electrumClient.blockchain_headers_subscribe()).height;

    let is_registered = validChain ? await callIsRegistered(address, chainId, web3) : false

    let added_assets: any = (await localforage.getItem('addedAssets'));

    let add_wnav_already_asked: any = (await localforage.getItem('alreadyAskedToAdd'));

    let added_asset = added_assets && added_assets[chainId] && added_assets[chainId][address];

    await this.setState({
      web3,
      provider,
      connected: true,
      address,
      chainId,
      networkId,
      validChain,
      is_registered,
      added_asset,
      add_wnav_already_asked
    });

    if (validChain)
    {
      await this.subscribeTokens();
      /*await this.getAccountAssets();
      await this.getBridgeSupply();
      await this.getFarmingInfo();
      await this.getStakingInfo();
      await this.getRewardsInfo();*/
    }
  };

  public subscribeTokens = async () => {
    const { web3, address, chainId } = this.state;

    let token = getTokenContract(chainId, web3);

    let self = this;

    token.events.allEvents({}, async function(error: any, event: any){
      if (event.returnValues["from"] == address || event.returnValues["from"] == address) {
        console.log('update token')
        await self.getAccountAssets();
      }
    })

    let lpToken = getLpContract(chainId, web3)

    lpToken.events.allEvents({}, async function(error: any, event: any){
      if (event.returnValues["from"] == address || event.returnValues["from"] == address) {
        console.log('update lp')
        await self.getAccountAssets();
      }
    })

    let nativeToken = getNativeContract(chainId, web3)

    nativeToken.events.allEvents({}, async function(error: any, event: any){
      if (event.returnValues["from"] == address || event.returnValues["from"] == address) {
        console.log('update native')
        await self.getAccountAssets();
      }
    })
  }

  public onAddToken = async () => {
    const { provider, chainId, address } = this.state;

    if (!provider) {
      return;
    }

    try {
      // toggle pending request indicator
      this.setState({pendingRequest: true});

      // open modal
      this.toggleModal();

      let self = this;

      const addToken = (tokAddress: string) => {
        return new Promise((resolve, reject) => {
          provider.request({
            method: 'wallet_watchAsset',
            params: {
              type: 'ERC20', // Initially only supports ERC20, but eventually more!
              options: {
                address: tokAddress, // The address that the token is at.
                symbol: "wNAV", // A ticker symbol or shorthand, up to 5 chars.
                decimals: 8, // The number of decimals in the token
                image: "https://raw.githubusercontent.com/navcoin/navcoin-core/master/src/qt/res/icons/mininav.svg", // A string url of the token logo
              },
            }
          }).then(async (response: any) => {
            if (response) {
              let added_assets: any = (await localforage.getItem('addedAssets'));

              if (!added_assets)
                added_assets = {};

              if (!added_assets[chainId])
                added_assets[chainId] = {}

              added_assets[chainId][address] = true;
              await localforage.setItem('addedAssets', added_assets);

              this.setState({ added_asset: true});

              resolve({"Result": "Token added"})
            } else {
              reject()
            }
          }).catch((err: any) => {
            reject(err)
          });
        })
      }

      const result = await addToken(TOKEN_CONTRACT[chainId].address);

      this.setState({
        pendingRequest: false,
        result: result || null,
      });

    } catch (error) {
      console.error(error); // tslint:disable-line
      this.setState({ pendingRequest: false, result: null, added_asset: false});
    }
  }

  public onWithdraw = async (dest: string, amount: number) => {
    const { web3, address, chainId } = this.state;

    if (!web3) {
      return;
    }

    try {
      // toggle pending request indicator
      this.setState({pendingRequest: true});

      // open modal
      this.toggleModal();

      let self = this;

      const withdraw = (address: string, dest: string, amount: number, chainId: number, web3: any) => {
        return new Promise((resolve, reject) => {
          callBurn(address, dest, amount, chainId, web3).then((response) => {
            resolve({"Result":"Withdrawn"})
          }).catch((err: any) => reject(err));
        })
      }

      const result = await withdraw(address, dest, amount, chainId, web3);


      this.setState({
        web3,
        pendingRequest: false,
        result: result || null,
      });

    } catch (error) {
      console.error(error); // tslint:disable-line
      this.setState({ web3, pendingRequest: false, result: null});
    }
  }

  public onRegister = async () => {
    const { web3, address, chainId } = this.state;

    if (!web3) {
      return;
    }

    try {
      // toggle pending request indicator
      this.setState({pendingRequest: true});

      // open modal
      this.toggleModal();

      let self = this;

      const registerAddress = (address: string, chainId: number, web3: any) => {
        return new Promise((resolve, reject) => {
          callRegistered(address, chainId, web3).then((response) => {
            resolve({"Result":"Registered"})
          }).catch((err: any) => reject(err));
        })
      }

      const result = await registerAddress(address, chainId, web3);

      let is_registered = await callIsRegistered(address, chainId, web3)

      this.setState({
        web3,
        is_registered,
        pendingRequest: false,
        result: result || null,
      });

    } catch (error) {
      console.error(error); // tslint:disable-line
      this.setState({ web3, pendingRequest: false, result: null});
    }
  }

  public onFarmLpTokens = async (amount: number) => {
    const { web3, address, chainId, dialog_amount, farmingData, lp_balance} = this.state;

    dialog_amount.open = false;

    this.setState({dialog_amount});

    if (!web3 || !amount) {
      return;
    }

    try {
      // toggle pending request indicator
      this.setState({pendingRequest: true});

      // open modal
      this.toggleModal();

      let self = this;

      var needApproval = new web3.utils.BN(await callLpAllowance(address, chainId, web3)).lt(new web3.utils.BN(lp_balance))

      if (needApproval)
      {
        const requestAllowance = (address: string, chainId: number, web3: any) => {
          return new Promise((resolve, reject) => {
            callApproveLpDeposit(address, chainId, web3).then((response) => {
              resolve(true)
            }).catch((err: any) => reject(err));
          })
        }

        await requestAllowance(address, chainId, web3);
      }


      const farmTokens = (address: string, amount: number, chainId: number, web3: any) => {
        return new Promise((resolve, reject) => {
          callLpDeposit(address, amount, chainId, web3).then((response) => {
            resolve({"Result":"Deposited"})
          }).catch((err: any) => reject(err));
        })
      }

      const result = await farmTokens(address, amount, chainId, web3);

      await this.getAccountAssets();
      /*await this.getFarmingInfo();
      await this.getRewardsInfo();*/

      this.setState({
        web3,
        pendingRequest: false,
        result: result || null,
      });

    } catch (error) {
      console.error(error); // tslint:disable-line
      this.setState({ web3, pendingRequest: false, result: null});
    }
  }

  public onAddLiquidity = async (tok_amount: any, nat_amount: any) => {
    const { web3, address, chainId, dialog_amount, native_balance, token_balance } = this.state;

    dialog_amount.open = false;

    this.setState({dialog_amount});

    if (!web3 || !tok_amount || !nat_amount) {
      return;
    }

    try {
      // toggle pending request indicator
      this.setState({pendingRequest: true});

      // open modal
      this.toggleModal();

      let self = this;

      var needApproval = new web3.utils.BN(await callRouterAllowance(address, chainId, web3)).lt(new web3.utils.BN(token_balance))

      if (needApproval)
      {
        const requestAllowance = (address: string, chainId: number, web3: any) => {
          return new Promise((resolve, reject) => {
            callApproveRouterDeposit(address, chainId, web3).then((response) => {
              resolve(true)
            }).catch((err: any) => reject(err));
          })
        }

        await requestAllowance(address, chainId, web3);
      }

      var needApprovalNative = new web3.utils.BN(await callRouterAllowanceNative(address, chainId, web3)).lt(new web3.utils.BN(native_balance))

      if (needApprovalNative)
      {
        const requestAllowance = (address: string, chainId: number, web3: any) => {
          return new Promise((resolve, reject) => {
            callApproveRouterDepositNative(address, chainId, web3).then((response) => {
              resolve(true)
            }).catch((err: any) => reject(err));
          })
        }

        await requestAllowance(address, chainId, web3);
      }


      const addLiquidity = (address: string, amount: any, amount_2:any, chainId: number, web3: any) => {
        return new Promise((resolve, reject) => {
          callAddLiquidity(address, amount, amount_2, chainId, web3).then((response) => {
            resolve({"Result":"Added"})
          }).catch((err: any) => reject(err));
        })
      }

      const result = await addLiquidity(address, tok_amount, nat_amount, chainId, web3);

      await this.getAccountAssets();
      /*await this.getFarmingInfo();
      await this.getRewardsInfo();*/

      this.setState({
        web3,
        pendingRequest: false,
        result: result || null,
      });

    } catch (error) {
      console.error(error); // tslint:disable-line
      this.setState({ web3, pendingRequest: false, result: null});
    }
  }

  public onWithdrawRewards = async () => {
    const { web3, address, chainId } = this.state;

    if (!web3) {
      return;
    }

    try {
      // toggle pending request indicator
      this.setState({pendingRequest: true});

      // open modal
      this.toggleModal();

      let self = this;

      const withdrawRewards = (address: string, chainId: number, web3: any) => {
        return new Promise((resolve, reject) => {
          callWithdrawRewards(address, chainId, web3).then((response) => {
            resolve({"Result":"Withdrawn"})
          }).catch((err: any) => reject(err));
        })
      }

      const result = await withdrawRewards(address, chainId, web3);

      await this.getAccountAssets();
      /*await this.getRewardsInfo();*/

      this.setState({
        web3,
        pendingRequest: false,
        result: result || null,
      });

    } catch (error) {
      console.error(error); // tslint:disable-line
      this.setState({ web3, pendingRequest: false, result: null});
    }
  }

  public onWithdrawLpTokens = async (amount: number) => {
    const { web3, address, chainId, dialog_amount } = this.state;

    dialog_amount.open = false;

    this.setState({dialog_amount});

    if (!web3 || !amount) {
      return;
    }

    try {
      // toggle pending request indicator
      this.setState({pendingRequest: true});

      // open modal
      this.toggleModal();

      let self = this;

      const withdrawLp = (address: string, amount: number, chainId: number, web3: any) => {
        return new Promise((resolve, reject) => {
          callWithdrawLp(address, amount, chainId, web3).then((response) => {
            resolve({"Result":"Withdrawn"})
          }).catch((err: any) => reject(err));
        })
      }

      const result = await withdrawLp(address, amount, chainId, web3);

      /*await this.getFarmingInfo();
      await this.getRewardsInfo();*/

      this.setState({
        web3,
        pendingRequest: false,
        result: result || null,
      });

    } catch (error) {
      console.error(error); // tslint:disable-line
      this.setState({ web3, pendingRequest: false, result: null});
    }
  }

  public onRemoveLiquidity = async (amount: number) => {
    const { web3, address, chainId, dialog_amount, lp_balance } = this.state;

    dialog_amount.open = false;

    this.setState({dialog_amount});

    if (!web3 || !amount) {
      return;
    }

    try {
      // toggle pending request indicator
      this.setState({pendingRequest: true});

      // open modal
      this.toggleModal();

      let self = this;

      var needApproval = new web3.utils.BN(await callLpAllowance(address, chainId, web3, ROUTER_CONTRACT[chainId].address)).lt(new web3.utils.BN(lp_balance))

      if (needApproval)
      {
        const requestAllowance = (address: string, chainId: number, web3: any) => {
          return new Promise((resolve, reject) => {
            callApproveLpDeposit(address, chainId, web3, ROUTER_CONTRACT[chainId].address).then((response) => {
              resolve(true)
            }).catch((err: any) => reject(err));
          })
        }

        await requestAllowance(address, chainId, web3);
      }

      const removeLiquidity = (address: string, amount: number, chainId: number, web3: any) => {
        return new Promise((resolve, reject) => {
          callRemoveLiquidity(address, amount, chainId, web3).then((response) => {
            resolve({"Result":"Removed"})
          }).catch((err: any) => reject(err));
        })
      }

      const result = await removeLiquidity(address, amount, chainId, web3);

      /*await this.getFarmingInfo();
      await this.getRewardsInfo();*/
      await this.getAccountAssets()

      this.setState({
        web3,
        pendingRequest: false,
        result: result || null,
      });

    } catch (error) {
      console.error(error); // tslint:disable-line
      this.setState({ web3, pendingRequest: false, result: null});
    }
  }

  public signMessage = async (message: string, redirect: string) => {
    const { web3, address } = this.state;

    if (!web3) {
      return;
    }

    // hash message
    const hash = hashPersonalMessage(message);

    try {
      // open modal
      this.toggleModal();

      // toggle pending request indicator
      this.setState({ pendingRequest: true });

      // send message
      const result = await web3.eth.sign(hash, address);

      // verify signature
      const signer = recoverPublicKey(result, hash);
      const verified = signer.toLowerCase() === address.toLowerCase();

      // format displayed result
      const formattedResult = {
        address,
        signer,
        verified,
        result
      };

      // display result
      this.setState({
        web3,
        pendingRequest: false,
        result: formattedResult || null
      });

      if (formattedResult && formattedResult.verified == true) {
        window.location.href = redirect + address + ';' + result;
      }
    } catch (error) {
      console.error(error); // tslint:disable-line
      this.setState({ web3, pendingRequest: false, result: null });
    }
  };

  public validateAddress = (address: string) => {
    return Bitcore.Address.isValid(address)
  }

  public subscribeProvider = async (provider: any) => {
    if (!provider.on) {
      return;
    }
    provider.on("close", () => this.resetApp());
    provider.on("accountsChanged", async (accounts: string[]) => {
      const {web3, chainId} = this.state;
      /*let is_registered = await callIsRegistered(accounts[0], chainId, web3)*/
      let added_assets: any = (await localforage.getItem('addedAssets'));
      let added_asset = added_assets && added_assets[chainId] && added_assets[chainId][accounts[0]];
      await this.setState({address: accounts[0]});
      /*await this.getAccountAssets();
      await this.getBridgeSupply();
      await this.subscribeTokens();
      await this.getFarmingInfo();
      await this.getRewardsInfo();*/
    });

    provider.on("networkChanged", async (networkId: number) => {
      const {web3, address} = this.state;
      const chainId = await web3.eth.chainId();
      const validChain = isValidChain(chainId);
      //const bridgeData : IBridgeData = getBridgeData(chainId);
      //let is_registered = validChain ? await callIsRegistered(address, chainId, web3) : false
      //bridgeData.blockNumber = (await this.electrumClient.blockchain_headers_subscribe()).height;
      let added_assets: any = (await localforage.getItem('addedAssets'));
      let added_asset = added_assets && added_assets[chainId] && added_assets[chainId][address];
      await this.setState({chainId, networkId, validChain });
      if (validChain)
      {
        /*await this.getAccountAssets();
        await this.getBridgeSupply();
        await this.subscribeTokens();
        await this.getFarmingInfo();
        await this.getStakingInfo();
        await this.getRewardsInfo();*/
      }
    });
  };

  public getNetwork = () => getChainData(this.state.chainId).network;

  public getProviderOptions = () => {
    const providerOptions = {

      bsc: {
        package: BscConnector
      }
    };
    return providerOptions;
  };

  public getAccountAssets = async () => {
    const {address, chainId, web3, validChain, bridgeData} = this.state;
    if (validChain) {
      this.setState({fetching: true, validChain: true});
      try {
        // get account balances
        let token_balance = await callBalanceOfToken(address, chainId, web3);
        let native_balance = await callBalanceOf(address, web3);
        let lp_balance = await callBalanceOfLp(address, chainId, web3)
        let symbols = [{symbol: TOKEN_NAME, name: TOKEN_FULL_NAME, balance: token_balance, decimals: 8, contractAddress: TOKEN_CONTRACT[chainId].address}]
        symbols.push(chainId == 56 ?
            {symbol: 'BNB', name: 'Binance Coin', balance: native_balance, decimals: 18, contractAddress: ''} :
            {symbol: 'ETH', name: 'Ethereum', balance: native_balance, decimals: 18, contractAddress: ''})
        symbols.push(chainId == 56 ?
            {symbol: 'LP', name: 'Pancake LP', balance: lp_balance, decimals: 18, contractAddress: LP_CONTRACT[chainId].address} :
            {symbol: 'SLP', name: 'SushiSwap LP', balance: lp_balance, decimals: 18, contractAddress: LP_CONTRACT[chainId].address})

        await this.setState({fetching: false, assets: symbols, token_balance, native_balance, lp_balance});
      } catch (error) {
        console.error(error); // tslint:disable-line
        await this.setState({fetching: false});
      }
    }
    else
    {
      await this.setState({validChain: false})
    }
  };

  public toggleModal = () =>
      this.setState({showModal: !this.state.showModal});

  public resetApp = async () => {
    const { web3 } = this.state;
    if (web3 && web3.currentProvider && web3.currentProvider.close) {
      await web3.currentProvider.close();
    }
    await this.web3Modal.clearCachedProvider();
    this.setState({ ...INITIAL_STATE });
  };

  public menuSelected = async (index: number) => {
    if (index == 5)
      await this.onAddToken()
    else
      this.setState({section: index});
  }

  public onAmountSlider = () => {

  }

  public render = () => {
    const {
      assets,
      address,
      connected,
      chainId,
      fetching,
      fetching_farming,
      showModal,
      pendingRequest,
      result,
      web3,
      supply_bridge,
      supply_cold,
      validChain,
      section,
      deposit_address,
      gas_cost,
      is_registered,
      farmingData,
      added_asset,
      add_wnav_already_asked,
      dialog_amount,
      token_balance,
      native_balance,
      location
    } = this.state;

    let queryParams = queryString.parse(location.search);

    return (
        <ThemeProvider theme={themeOptions}>
          <Drawer
              theme={themeOptions}
              connected={connected}
              address={address}
              chainId={chainId}
              killSession={this.resetApp}
              sectionSelected={this.menuSelected}
              addedAsset={added_asset}>
            {web3 ? (
                <DialogAmount open={dialog_amount.open}
                              text={dialog_amount.text}
                              title={dialog_amount.title}
                              button={dialog_amount.button}
                              result={dialog_amount.result}
                              decimals={dialog_amount.decimals}
                              error_max_0={dialog_amount.error_max_0}
                              balance={dialog_amount.balance}
                              max={dialog_amount.max}
                              token_balance={dialog_amount.token_balance}
                              native_balance={dialog_amount.native_balance}
                              type={dialog_amount.type}
                              bridge_info={farmingData}
                              chainId={chainId}
                              web3={web3}
                />) : ''}
            <SContent>
              {!validChain ? (
                  <Alert severity="error">The selected network is currently not supported.</Alert>
              ) : fetching ? (
                  <CircularProgress />
              ) : connected ? (
                  <Sign queryParams={queryParams} chainId={chainId} address={address} action={this.signMessage}/>
              ) : (
                <>
                <Grid container spacing={themeOptions.spacing(3)}>
                <Grid item xs={12}>
                <span>{(window.web3 || window.ethereum || window.BinanceChain) ? "Connect to your wallet to start using the bridge." : "Install Metamask to start using the bridge."}</span>
                </Grid>
                <Grid item xs={12}>
              {(window.web3 || window.ethereum || window.BinanceChain) ? (
                <Button onClick={this.onConnect} variant="contained">Connect</Button>
                ) : (
                <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                alignContent: 'center',
                justifyContent: 'center',
                justifyItems: 'center'
              }}>
                <Link href={"https://metamask.io"}>

                <Button>Install Metamask</Button>
                </Link>
                </Box>
                )
              }
                </Grid>
                </Grid>
                </>
                )}
              <Modal show={showModal} toggleModal={this.toggleModal}>
                {pendingRequest ? (
                    <SModalContainer>
                      <SModalTitle>{"Pending Request"}</SModalTitle>
                      <SContainer>
                        <CircularProgress />
                        <SModalParagraph>
                          Approve or reject request using your wallet.
                        </SModalParagraph>
                        <SModalParagraph>
                          If you already approved, this dialog will stay open until the transaction is confirmed.
                        </SModalParagraph>
                      </SContainer>
                    </SModalContainer>
                ) : result ? (
                    <SModalContainer>
                      <SModalTitle>{"Request Approved"}</SModalTitle>
                      <ModalResult>{result}</ModalResult>
                    </SModalContainer>
                ) : (
                    <SModalContainer>
                      <SModalTitle>{"Request Rejected"}</SModalTitle>
                    </SModalContainer>
                )}
              </Modal>
            </SContent>
          </Drawer>
        </ThemeProvider>
    );
  };
}

export default withRouter(App);
