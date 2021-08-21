import * as React from "react";
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CardActionArea from '@material-ui/core/CardActionArea'
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import AssetRow from "./AssetRow";
import {IAssetData, IChainData} from "../helpers/types";
import {callBalanceOfToken} from "../helpers/web3";
import styled from "@emotion/styled";
import {themeOptions} from '../App'
import {getChainData} from "../helpers/utilities";
import ActionButton from "./ActionButton";

export function getNativeCurrency (chainId: number): IAssetData {
    return chainId === 56
        ? {
            contractAddress: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
            symbol: "BNB",
            name: "Binance Coin",
            decimals: "18",
            balance: "0",
        }
        : {
            contractAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
            name: "Ethereum",
            symbol: "ETH",
            decimals: "18",
            balance: "0",
        };
}

function AccountAssets (props: any) {
    const { assets, chainId, address, web3, onRemove, onAdd, onTrade } = props;
    const defaultNativeCurrency: IAssetData = getNativeCurrency(chainId)
    const chainData: IChainData = getChainData(chainId)

    let nativeCurrency: IAssetData = defaultNativeCurrency;
    let tokens: IAssetData[] = [];
    if (assets && assets.length) {
        const filteredNativeCurrency = assets.filter((asset: IAssetData) =>
            asset && asset.symbol
                ? asset.symbol.toLowerCase() === nativeCurrency.symbol.toLowerCase()
                : false
        );
        filteredNativeCurrency.balance = callBalanceOfToken(address, chainId, web3)
        nativeCurrency =
            filteredNativeCurrency && filteredNativeCurrency.length
                ? filteredNativeCurrency[0]
                : defaultNativeCurrency;
        tokens = assets.filter((asset: IAssetData) =>
            asset && asset.symbol
                ? asset.symbol.toLowerCase() !== nativeCurrency.symbol.toLowerCase()
                : false
        );
    }

    return (
        <Card>
            <CardHeader
                title={'Balances'}
                subheader={'Your tokens'}
            />

            <CardContent>
                <CardActionArea key={nativeCurrency.name} onClick={()=> window.open(chainData.explorer + '/address/' + address, "_blank")}>
                    <AssetRow key={nativeCurrency.name} asset={nativeCurrency} />
                </CardActionArea>

                {tokens.map((token) => {
                    return (
                        <CardActionArea key={token.symbol} onClick={()=> window.open(chainData.explorer + '/token/' + token.contractAddress + '?a=' + address, "_blank")}>
                            <AssetRow key={token.symbol} asset={token}/>
                        </CardActionArea>

                )
                })}
            </CardContent>

            <CardActions>
                <ActionButton onClick={onTrade} sx={{display:"none"}}>Trade</ActionButton>
                <ActionButton onClick={onAdd}>Add Liquidity</ActionButton>
                <ActionButton onClick={onRemove}>Remove Liquidity</ActionButton>
            </CardActions>
        </Card>
    );
};

export default AccountAssets;
