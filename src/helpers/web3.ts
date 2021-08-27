import { TOKEN_CONTRACT, FARM_CONTRACT, LP_CONTRACT, NATIVE_CONTRACT, ROUTER_CONTRACT } from '../constants'
import {getNativeCurrency} from "../components/AccountAssets";

export function isValidChain(chainId: number) {
    return !!(TOKEN_CONTRACT[chainId]);
}

export function getTokenContract(chainId: number, web3: any) {
    const token = new web3.eth.Contract(
        TOKEN_CONTRACT.abi,
        TOKEN_CONTRACT[chainId].address
    )
    return token
}

export function getNativeContract(chainId: number, web3: any) {
    const token = new web3.eth.Contract(
        NATIVE_CONTRACT.abi,
        NATIVE_CONTRACT[chainId].address
    )
    return token
}

export function getFarmContract(chainId: number, web3: any) {
    const token = new web3.eth.Contract(
        FARM_CONTRACT.abi,
        FARM_CONTRACT[chainId].address
    )
    return token
}

export function getDexRouterContract(chainId: number, web3: any) {
    const token = new web3.eth.Contract(
        ROUTER_CONTRACT.abi,
        ROUTER_CONTRACT[chainId].address
    )
    return token
}

export function getLpContract(chainId: number, web3: any) {
    const token = new web3.eth.Contract(
        LP_CONTRACT.abi,
        LP_CONTRACT[chainId].address
    )
    return token
}

export function callBalanceOfToken(address: string, chainId: number, web3: any) {
  return new Promise(async(resolve, reject) => {
    const token = getTokenContract(chainId, web3)

    await token.methods
      .balanceOf(address)
      .call(
        { from: address },
        (err: any, data: any) => {
          if (err) {
            reject(err)
          }

          resolve(data)
        }
      )
  })
}

export function callIsRegistered(address: string, chainId: number, web3: any) {
    return new Promise(async(resolve, reject) => {
        const token = getTokenContract(chainId, web3)

        await token.methods
            .isRegistered(address)
            .call(
                { from: address },
                (err: any, data: any) => {
                    if (err) {
                        reject(err)
                    }

                    resolve(data)
                }
            )
    })
}

export function callWithdrawRewards(address: string, chainId: number, web3: any) {
    return new Promise(async(resolve, reject) => {
        const token = getFarmContract(chainId, web3)

        await token.methods
            .withdraw(0, 0)
            .send(
                { from: address,
                  type: chainId == 1 ? "0x2" : "0x1" },
            ).on("receipt", (txHash: string) => resolve(txHash))
            .catch((err: any) => reject(err));
    })
}

export function callWithdrawLp(address: string, amount: number, chainId: number, web3: any) {
    return new Promise(async(resolve, reject) => {
        const token = getFarmContract(chainId, web3)

        await token.methods
            .withdraw(0, amount)
            .send(
                { from: address,
                    type: chainId == 1 ? "0x2" : "0x1" }
            ).on("receipt", (txHash: string) => resolve(txHash))
            .catch((err: any) => reject(err));
    })
}

export function callApproveRouterDeposit(address: string, chainId: number, web3: any) {
    return new Promise(async(resolve, reject) => {
        const token = getTokenContract(chainId, web3)

        const max = new web3.utils.BN("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")

        await token.methods
            .approve(ROUTER_CONTRACT[chainId].address, max)
            .send(
                { from: address,
                    type: chainId == 1 ? "0x2" : "0x1" }
            ).on("receipt", (txHash: string) => resolve(txHash))
            .catch((err: any) => reject(err));
    })
}

export function callApproveRouterDepositNative(address: string, chainId: number, web3: any) {
    return new Promise(async(resolve, reject) => {
        const token = getNativeContract(chainId, web3)

        const max = new web3.utils.BN("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")

        await token.methods
            .approve(ROUTER_CONTRACT[chainId].address, max)
            .send(
                { from: address,
                    type: chainId == 1 ? "0x2" : "0x1" }
            ).on("receipt", (txHash: string) => resolve(txHash))
            .catch((err: any) => reject(err));
    })
}

export function callApproveLpDeposit(address: string, chainId: number, web3: any, address2: string = FARM_CONTRACT[chainId].address) {
    return new Promise(async(resolve, reject) => {
        const token = getLpContract(chainId, web3)

        const max = new web3.utils.BN("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")

        await token.methods
            .approve(address2, max)
            .send(
                { from: address,
                    type: chainId == 1 ? "0x2" : "0x1" }
            ).on("receipt", (txHash: string) => resolve(txHash))
            .catch((err: any) => reject(err));
    })
}

export function callLpAllowance(address: string, chainId: number, web3: any, address2: string = FARM_CONTRACT[chainId].address) {
    return new Promise(async(resolve, reject) => {
        const token = getLpContract(chainId, web3)

        await token.methods
            .allowance(address, address2)
            .call(
                { from: address },
                (err: any, data: any) => {
                    if (err) {
                        reject(err)
                    }

                    resolve(data)
                }
            )
    })
}


export function callRouterAllowance(address: string, chainId: number, web3: any) {
    return new Promise(async(resolve, reject) => {
        const token = getTokenContract(chainId, web3)

        await token.methods
            .allowance(address, ROUTER_CONTRACT[chainId].address)
            .call(
                { from: address },
                (err: any, data: any) => {
                    if (err) {
                        reject(err)
                    }

                    resolve(data)
                }
            )
    })
}

export function callRouterAllowanceNative(address: string, chainId: number, web3: any) {
    return new Promise(async(resolve, reject) => {
        const token = getNativeContract(chainId, web3)

        await token.methods
            .allowance(address, ROUTER_CONTRACT[chainId].address)
            .call(
                { from: address },
                (err: any, data: any) => {
                    if (err) {
                        reject(err)
                    }

                    resolve(data)
                }
            )
    })
}

export function callRemoveLiquidity(address: string, amount: number, chainId: number, web3: any) {
    return new Promise(async(resolve, reject) => {
        const token = getDexRouterContract(chainId, web3)

        const timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;

        await token.methods
            .removeLiquidityETH(TOKEN_CONTRACT[chainId].address,
                amount,
                0,
                0,
                address,
                timestamp+10000)
            .send(
                { from: address,
                    type: chainId == 1 ? "0x2" : "0x1" }
            ).on("receipt", (txHash: string) => resolve(txHash))
            .catch((err: any) => reject(err));
    })
}

export function callAddLiquidity(address: string, tokamount: any, amount: any, chainId: number, web3: any) {
    return new Promise(async(resolve, reject) => {
        const token = getDexRouterContract(chainId, web3)

        const timestamp = (await web3.eth.getBlock(await web3.eth.getBlockNumber())).timestamp;

        await token.methods
            .addLiquidityETH(TOKEN_CONTRACT[chainId].address,
                tokamount,
                tokamount.mul(new web3.utils.BN(90)).div(new web3.utils.BN(100)),
                amount.mul(new web3.utils.BN(90)).div(new web3.utils.BN(100)),
                address,
                timestamp+10000)
            .send(
                { from: address, value: amount,
                    type: chainId == 1 ? "0x2" : "0x1" }
            ).on("receipt", (txHash: string) => resolve(txHash))
            .catch((err: any) => reject(err));
    })
}

export function callLpDeposit(address: string, amount: number, chainId: number, web3: any) {
    return new Promise(async(resolve, reject) => {
        const token = getFarmContract(chainId, web3)

        await token.methods
            .deposit(0, amount)
            .send(
                { from: address,
                    type: chainId == 1 ? "0x2" : "0x1" }
            ).on("receipt", (txHash: string) => resolve(txHash))
            .catch((err: any) => reject(err));
    })
}

export function callRegistered(address:string, chainId: number, web3: any) {
    return new Promise(async(resolve, reject) => {
        const token = getTokenContract(chainId, web3)

        await token.methods
            .register()
            .send(
                { from: address,
                    type: chainId == 1 ? "0x2" : "0x1" }
            ).on("receipt", (txHash: string) => resolve(txHash))
            .catch((err: any) => reject(err));
    })
}

export function callBurn(address:string, dest:string, amount:number, chainId: number, web3: any) {
    return new Promise(async(resolve, reject) => {
        const token = getTokenContract(chainId, web3)

        await token.methods
            .burnWithNote(amount, dest)
            .send(
                { from: address,
                    type: chainId == 1 ? "0x2" : "0x1" }
            ).on("receipt", (txHash: string) => resolve(txHash))
            .catch((err: any) => reject(err));
    })
}

export function callTotalSupplyOfToken(address: string, chainId: number, web3: any) {
    return new Promise(async(resolve, reject) => {
        const token = getTokenContract(chainId, web3)

        await token.methods
            .totalSupply()
            .call(
                { from: address },
                (err: any, data: any) => {
                    if (err) {
                        reject(err)
                    }

                    resolve(data)
                }
            )
    })
}

export function callBalanceOf(address: string, web3: any) {
    return new Promise(async(resolve, reject) => {
        await web3.eth.getBalance(address,
            (err: any, data: any) => {
                if (err) {
                    reject(err)
                }

                resolve(data)
            }
        )
    })
}

export function callBalanceOfLp(address: string, chainId: number, web3: any) {
    return new Promise(async(resolve, reject) => {
        const token = getLpContract(chainId, web3)

        await token.methods
            .balanceOf(address)
            .call(
                { from: address },
                (err: any, data: any) => {
                    if (err) {
                        reject(err)
                    }

                    resolve(data)
                }
            )
    })
}

export function callTransfer(address: string, chainId: number, web3: any) {
  return new Promise(async(resolve, reject) => {
    const token = getTokenContract(chainId, web3)

    await token.methods
      .transfer(address, '1')
      .send({ from: address,
          type: chainId == 1 ? "0x2" : "0x1" }, (err: any, data: any) => {
        if (err) {
          reject(err)
        }

        resolve(data)
      })
  })
}
