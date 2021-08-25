import * as React from "react";
import styled from '@emotion/styled'
import QRCode from "react-qr-code";
import ActionButton from './ActionButton'
import Box from "@material-ui/core/Box"
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader'
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import {themeOptions} from "../App";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import {AccessAlarm} from "@material-ui/icons";
import {TOKEN_NAME, WITHDRAWAL_FEE} from "../constants";


const Deposit = (props: any) => {
    const {onWithdraw, validateAddress, balance} = props;

    const [address, setAddress] = React.useState("")
    const [amount, setAmount] = React.useState(0)
    const [errorAddress, setErrorAddress] = React.useState(false)
    const [errorAmount, setErrorAmount] = React.useState(false)
    
    return (
        <Card variant="outlined" sx={{
            margin: '10px', padding: '20px', width: '90%', maxWidth: '600px', minHeight: '500px'
        }
        }>
            <CardHeader title={"Withdraw"}
                        subheader={"Swap your wNAV back to NAV"}/>
            <CardContent>
                <TextField
                    id="standard-full-width"
                    label="Address"
                    placeholder="NfLgDYL4C3KKXDS8tLRAFM7spvLykV8v9A"
                    helperText="The address where you want to receive NAV"
                    fullWidth
                    error={errorAddress}
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(e) => {
                        if (validateAddress(e.target.value))
                        {
                            setErrorAddress(false);
                            setAddress(e.target.value)
                        }
                        else
                        {
                            setErrorAddress(true);
                        }

                    }}
                />
                <TextField
                    id="standard-full-width"
                    label="Amount"
                    error={errorAmount}
                    style={{ marginTop: 20 }}
                    placeholder="100"
                    helperText={"The amount you want to send. A fee of "+WITHDRAWAL_FEE+" "+ TOKEN_NAME +" will be deducted from the amount. Available: " +balance/1e8 +" " +TOKEN_NAME}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(e) => {
                        let a = parseFloat(e.target.value)
                        if (a <= balance/1e8)
                        {
                            setAmount(a)
                            setErrorAmount(false)
                        }
                        else
                        {
                            setErrorAmount(true)
                        }

                    }}
                />
                <Box sx={{
                    display:'flex',
                    marginTop: '40px',
                    justifyContent: 'center',
                    width: '100%',
                }}>

                    <Box alignSelf="end">
                        <ActionButton onClick={() => {
                            if (!errorAmount && !errorAddress)
                            {
                                onWithdraw(address, amount*1e8)
                            }
                        }}>Withdraw</ActionButton>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    )
}

export default Deposit;