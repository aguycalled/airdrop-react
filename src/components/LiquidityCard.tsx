import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import React from "react";
import styled from "@emotion/styled";
import Button from "@material-ui/core/Button";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from '@material-ui/core/Divider';
import {CardActions} from "@material-ui/core";
import {themeOptions} from "../App";
import ActionButton from "./ActionButton";
import {getNativeCurrency} from "./AccountAssets";

export function LiquidityPoolCard(props:any) {
    let {farmingData, onAdd, onRemove, chainId} = props;

    return (
        <Card>
            <CardHeader
                title={'Liquidity Pool'}
                subheader={farmingData.exchangeName}
            />

            <CardContent>
                <Typography variant={"subtitle1"} sx={{paddingTop: '10px'}}>
                    You are farming:
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                    {String(farmingData.depositedNavLp / 1e8).toLocaleString()} wNAV
                </Typography>
                <Typography variant="subtitle2" color="textSecondary" >
                    {String(farmingData.depositedBnbLp / 1e18).toLocaleString()} {getNativeCurrency(chainId).symbol}
                </Typography>
                <Typography variant={"subtitle1"} sx={{paddingTop: '20px'}}>
                    Your share:
                </Typography>
                <Typography variant="subtitle2" color="textSecondary" >
                    {String(farmingData.share)}%
                </Typography>
            </CardContent>
            <CardActions>
                <ActionButton onClick={onAdd}>Add to farming</ActionButton>
                <ActionButton onClick={onRemove}>Remove from farming</ActionButton>
            </CardActions>
        </Card>
    )
}