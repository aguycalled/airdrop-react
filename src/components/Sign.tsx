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
import TelegramLoginButton from "./TelegramLogin";
import TwitterLogin from "react-twitter-auth";
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
                    (<Typography variant={"overline"} sx={{display: 'block'}}>
                        {line}
                    </Typography>)
                )}

                <Button variant={"contained"} sx={{mt: '40px'}} onClick={() => {
                    action(message, queryParams.redirect)
                }}>Sign</Button>

                <TelegramLoginButton dataOnauth={(response: any) => {
                    console.log(response);
                }} botName={"NAV_Airdrop_Bot"} />

                <TwitterLogin
                    loginUrl="https://airdrop-api.nav.community/api/v1/auth/twitter"
                    onFailure={(error: any) => {
                        alert(error);
                    }}
                    onSuccess={(response: any) => {
                        response.json().then((body: any) => {
                            alert(JSON.stringify(body));
                        });
                    }}
                    requestTokenUrl="https://airdrop-api.nav.community/api/v1/auth/twitter/reverse"
                />

            </CardContent>
        </Card>
    )
}

export default Sign;