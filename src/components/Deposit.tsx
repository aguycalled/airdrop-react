import * as React from "react";
import styled from '@emotion/styled'
import QRCode from "react-qr-code";
import Box from "@material-ui/core/Box"
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import {themeOptions} from "../App";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const Deposit = (props: any) => {
    const {address, gas_cost, is_registered, onRegister} = props;

    return (
        <Card variant="outlined" sx={{
            margin: '10px', padding: '20px', width: '90%', maxWidth: '600px', minHeight: '600px', height: '90%'
        }
        }> {is_registered ? (
            <CardContent>

                <QRCode value={address}/>

                <Typography variant={"subtitle1"} sx={{
                    paddingTop: '20px',
                    paddingBottom: '20px',
                    wordBreak: 'break-all'
                }}>
                    <b>{address}</b>
                </Typography>

                <Typography variant={"subtitle1"} sx={{
                    paddingTop: '20px'
                }}>
                    Coins sent to this address will be swapped automatically to wNAV.
                </Typography>

                <Typography variant={"subtitle1"} sx={{
                    paddingTop: '20px'
                }}>
                    <i>A fee will be deducted to cover the gas costs for minting.</i>
                </Typography>

                <Typography variant={"subtitle1"} sx={{
                    paddingTop: '20px'
                }}>
                    Estimated gas cost: <b>{parseFloat(gas_cost).toFixed(2)} NAV</b>.
                </Typography>

                <Typography variant={"subtitle1"}sx={{
                    paddingTop: '20px'
                }}>
                    Deposits smaller than this amount will be considered lost and won't be credited.
                </Typography>
            </CardContent>
        ) : (
            <CardContent>
                <Typography variant={"subtitle1"}>
                    Register your wallet in the bridge to swap NAV to wNAV.
                </Typography>
                <Typography variant={"subtitle1"}>
                    <Button onClick={onRegister} variant="contained">Register</Button>
                </Typography>
            </CardContent>
        )}
        </Card>
    )
}

export default Deposit;