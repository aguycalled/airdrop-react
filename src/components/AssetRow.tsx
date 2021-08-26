import * as React from "react";
import styled from '@emotion/styled';
import Grid from "@material-ui/core/Grid";
import Icon from "./Icon";
import ERC20Icon from "./ERC20Icon";
import token from "../assets/token.svg";
import bnb from "../assets/bnb.png";
import eth from "../assets/eth.svg"
import pancakelp from "../assets/pancake.png"
import sushiswaplp from "../assets/sushi.svg"

import {
  handleSignificantDecimals,
  convertAmountFromRawNumber,
} from "../helpers/bignumber";
import {TOKEN_NAME} from "../constants";

const SAssetRow = styled.div`
  width: 100%;
  padding: 20px;
  display: flex;
  justify-content: space-between;
`;
const SAssetRowLeft = styled.div`
  display: flex;
`;
const SAssetName = styled.div`
  display: flex;
  margin-left: 10px;
`;
const SAssetRowRight = styled.div`
  display: flex;
`;
const SAssetBalance = styled.div`
  display: flex;
`;

const AssetRow = (props: any) => {
  const { asset } = props;
  let icons: { [key: string]: any } = {'BNB': bnb, 'ETH': eth, 'LP': pancakelp, 'SLP': sushiswaplp};
  icons[TOKEN_NAME] = token;

  const nativeCurrencyIcon = icons[asset.symbol.toUpperCase()] ? icons[asset.symbol.toUpperCase()] : undefined;
  return (
      <SAssetRow {...props}>
          <SAssetRowLeft>
              {nativeCurrencyIcon ? (
                  <Icon src={nativeCurrencyIcon} />
              ) : (
                  <ERC20Icon contractAddress={asset.contractAddress.toLowerCase()} />
              )}
              <SAssetName>{asset.name}</SAssetName>
          </SAssetRowLeft>
          <SAssetRowRight>
              <SAssetBalance>
                  {`${handleSignificantDecimals(
                      convertAmountFromRawNumber(asset.balance, asset.decimals||18), 
                      18
                  )} ${asset.symbol}`}
              </SAssetBalance>
          </SAssetRowRight>
      </SAssetRow>
  );
};

export default AssetRow;
