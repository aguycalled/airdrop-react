import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from "@material-ui/core/Box"
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { flexbox } from '@material-ui/system';

import {themeOptions} from "../App";
import styled from '@emotion/styled';
import CardHeader from "@material-ui/core/CardHeader";
import ActionButton from "./ActionButton";
import {CircularProgress} from "@material-ui/core";

export default function Farming(props:any) {
    let {farmingData, onWithdrawRewards, fetchingFarming} = props;

    return (
        <Card>
            <CardHeader
                title={'Rewards'}
            />
            <CardContent>

            {fetchingFarming ? (
                <CircularProgress/>
            ) : (
                <>
                    <Typography variant={"subtitle1"}>
                        Expected per day
                    </Typography>
                    <Typography variant="subtitle2" color="textSecondary"  marginBottom={"20px"}>
                        {farmingData.expectedNavPerYear > 0 ? String(farmingData.expectedNavPerYear * farmingData.share / (365 * 100)).toLocaleString() : '-'} wNAV
                    </Typography>
                    <Typography variant={"subtitle1"} marginTop={"20px"}>
                        APY
                    </Typography>
                    <Typography variant="subtitle2" color="textSecondary" >
                        {(String(farmingData.apy)).toLocaleString()}%
                    </Typography>
                    <Typography variant={"subtitle1"} marginTop={"20px"}>
                        Pending distribution
                    </Typography>
                    <Typography variant="subtitle2" color="textSecondary" >
                        {String(farmingData.pendingDistribute / 1e8).toLocaleString()} wNAV
                    </Typography>

                    <Typography variant={"subtitle1"} marginTop={"20px"}>
                        Already distributed
                    </Typography>
                    <Typography variant="subtitle2" color="textSecondary" >
                        {String(farmingData.userRewards / 1e8).toLocaleString()} wNAV
                    </Typography>
                </>
                )}
            </CardContent>

            <CardActions>
                <ActionButton onClick={onWithdrawRewards}>Withdraw rewards</ActionButton>
            </CardActions>
        </Card>
    );
}