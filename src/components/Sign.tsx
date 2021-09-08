import * as React from "react";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import {CardHeader} from "@material-ui/core";
import TelegramLoginButton from "./TelegramLogin";
import axios from 'axios';
import { useState, useEffect } from 'react';
import queryString from 'query-string';

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
        <Button onClick={login}>Connect with Twitter</Button>
    ): (
        <div>
            <div><img alt='User profile' src={imageUrl}/></div>
            <div>Name: {name}</div>
            <div>URL: {url}</div>
            <div>Status: {status}</div>
            <Button onClick={logout}>Disconnect from Twitter</Button>
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
            <CardHeader title={"Sign message "} subheader={"Authenticate your address"}/>
            <CardContent>
                <Button variant={"contained"} sx={{mt: '40px'}} onClick={() => {
                    action(message, queryParams.redirect)
                }}>Sign</Button>

                <TelegramLoginButton dataOnauth={(response: any) => {
                    console.log(response);
                }} botName={"NAV_Airdrop_Bot"} />

                <TwitterLogin/>

            </CardContent>
        </Card>
    )
}

export default Sign;