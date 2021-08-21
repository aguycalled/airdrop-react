import * as React from "react";
import styled from '@emotion/styled';
import Icon from "./Icon";

import {
    handleSignificantDecimals,
    convertAmountFromRawNumber,
} from "../helpers/bignumber";

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

const CardRow = (props: any) => {
    const { left, right } = props;


    return (
        <SAssetRow {...props}>
            <SAssetRowLeft>
                <SAssetName>{left}</SAssetName>
            </SAssetRowLeft>
            <SAssetRowRight>
                {right}
            </SAssetRowRight>
        </SAssetRow>
    );
};

export default CardRow;
