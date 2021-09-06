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
import {CardHeader} from "@material-ui/core";

const Sign = (props: any) => {
    const {address, chainId, queryParams, action} = props;

    window.history.replaceState(null, "Navcoin Bridge", "/")

    let message = `Hi!

This message will be signed to verify the ownership of your address ${address} in the network ${chainId}.

Your user identifier is ${queryParams.uid}.

Signing this message has no cost.

Best,

Your Navcoin Bridge Team.`;

    return (
        <Card variant="outlined" sx={{
            margin: '10px', padding: '20px', width: '90%', maxWidth: '600px', height: '90%'
        }
        }>
            <CardHeader title={"Sign message "} subheader={"Authenticate your address"}/>
            <CardContent>
                <Typography variant={"subtitle1"} sx={{
                    paddingTop: '20px',
                    paddingBottom: '40px',
                    wordBreak: 'break-all'
                }}>
                    The following message will be signed by<br/><b>{address}</b>:
                </Typography>


                    {message.split('\n').map ((line) =>
                        (<Typography variant={"subtitle2"} sx={{mb:'20px'}}>
                            {line}
                        </Typography>)
                    )}

                <Button variant={"contained"} sx={{mt: '40px'}} onClick={() => {
                    action(message, queryParams.redirect)
                }}>Sign</Button>
            </CardContent>
        </Card>
    )
}

export default Sign;