import * as React from "react";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import {Box, CardHeader, CardMedia, Grid} from "@material-ui/core";
import TelegramLoginButton from "./TelegramLogin";
import axios from 'axios';
import { useState, useEffect } from 'react';
import queryString from 'query-string';
import logo from "../assets/logo.png"

const apiPath = '/api';

function TwitterLogin() {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [name, setName] = useState();
    const [imageUrl, setImageUrl] = useState();
    const [status, setStatus] = useState();
    const [url, setUrl] = useState();

    const login = () => {
        (async () => {

            try {
                //OAuth Step 1
                const response = await axios({
                    url: `${apiPath}/twitter/oauth/request_token`,
                    method: 'POST'
                });

                const { oauth_token } = response.data;
                //Oauth Step 2
                window.location.href = `https://api.twitter.com/oauth/authenticate?oauth_token=${oauth_token}`;
            } catch (error) {
                console.error(error);
            }

        })();
    }

    const logout = () => {
        (async () => {
            try {
                await axios({
                    url: `${apiPath}/twitter/logout`,
                    method: 'POST'
                });
                setIsLoggedIn(false);
            } catch (error) {
                console.error(error);
            }
        })();
    }

    useEffect(() => {
        (async() => {

            const {oauth_token, oauth_verifier} = queryString.parse(window.location.search);

            if (oauth_token && oauth_verifier) {
                try {
                    //Oauth Step 3
                    await axios({
                        url: `${apiPath}/twitter/oauth/access_token`,
                        method: 'POST',
                        data: {oauth_token, oauth_verifier}
                    });
                } catch (error) {
                    console.error(error);
                }
            }

            try {
                //Authenticated Resource Access
                const {data: {name, profile_image_url_https, status, entities}} = await axios({
                    url: `${apiPath}/twitter/users/profile_banner`,
                    method: 'GET'
                });

                setIsLoggedIn(true);
                setName(name);
                setImageUrl(profile_image_url_https);
                setStatus(status.text);
                setUrl(entities.url.urls[0].expanded_url);
            } catch (error) {
                console.error(error);
            }


        })();
    }, []);

    return !isLoggedIn ? (
        <Button onClick={login} variant={"contained"}>Connect with Twitter</Button>
    ): (
        <div>
            <Button onClick={logout} variant={"contained"}>Disconnect {name}</Button>
        </div>
    );
}


const Sign = (props: any) => {
    const {address, chainId, queryParams, action} = props;

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
            <Box sx={{display:'flex', alignItems: 'center', justifyContent: 'center'}}>
                <img src={logo} style={{height: 140, width: 140}}/>
            </Box>
            <CardHeader title={"Navcoin Airdrop"} subheader={"Verify your accounts to participate!"}/>
            <CardContent>
                <Grid container spacing={2}>

                    <Grid item xs={6} sx={{wordBreak: 'break-word', mt: '40px',
                        display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                        <Typography variant="caption" align={'right'}>
                        Your address {address}
                        </Typography>
                    </Grid>
                    <Grid item xs={6} sx={{display: 'flex', mt: '40px', alignItems: 'center', justifyContent: 'flex-start'}}>

                        <Button variant={"contained"} onClick={() => {
                            action(message, queryParams.redirect)
                        }}>Verify</Button>
                    </Grid>

                    <Grid item xs={6} sx={{wordBreak: 'break-word', mt: '40px',
                        display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                        <Typography variant="caption" align={'right'}>
                        Your Telegram account
                        </Typography>
                    </Grid>
                    <Grid item xs={6}  sx={{display: 'flex', mt: '40px', alignItems: 'center', justifyContent: 'flex-start'}}>
                        <TelegramLoginButton dataOnauth={(response: any) => {
                            console.log(response);
                        }} botName={"NAV_Airdrop_Bot"} />
                    </Grid>

                    <Grid item xs={6} sx={{wordBreak: 'break-word', mt: '40px',
                        display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                        <Typography variant="caption" align={'right'}>
                        Your Twitter account
                        </Typography>
                    </Grid>
                    <Grid item xs={6}  sx={{display: 'flex', mt: '40px', alignItems: 'center', justifyContent: 'flex-start'}}>
                    <TwitterLogin/>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}

export default Sign;