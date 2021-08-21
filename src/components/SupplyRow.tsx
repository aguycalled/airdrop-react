import * as React from "react";
import styled from "@emotion/styled";
import Grid from "@material-ui/core/Grid";

import {
    handleSignificantDecimals,
    convertAmountFromRawNumber,
} from "../helpers/bignumber";
import {themeOptions} from "../App";

const SSupplyRow = styled.div`
  width: 100%;
  padding: 20px;
  display: flex;
  justify-content: space-between;
`;
const SSupplyRowLeft = styled.div`
  display: flex;
`;
const SSupplyRowRight = styled.div`
  display: flex;
`;

const SupplyRow = (props: any) => {
    const { value, decimals, symbol, label } = props;

    return (
        <SSupplyRow>
            <SSupplyRowLeft>
                {label}
            </SSupplyRowLeft>

            <SSupplyRowRight>
                    {`${handleSignificantDecimals(
                        convertAmountFromRawNumber(value, decimals||8),
                        8
                    )} ${symbol}`}
            </SSupplyRowRight>
        </SSupplyRow>
    );
};

export default SupplyRow;
