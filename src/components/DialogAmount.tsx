import * as React from 'react';
import {Alert, AlertTitle} from '@material-ui/core'
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close"
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import Slider from '@material-ui/core/Slider';
import {getNativeCurrency} from "./AccountAssets";
import {TOKEN_NAME} from "../constants";

export default function DialogAmount(props: any) {
    const {max, web3, chainId, title, text, open, result, button, decimals, error_max_0, bridge_info, balance, token_balance, native_balance} = props;

    const [value, setValue] = React.useState(
        100
    );

    const handleInputChange = (event: any, newValue: any) => {
        setValue(newValue);
    };

    return (open && new web3.utils.BN(balance).eq(new web3.utils.BN(0))) ? (
            <Alert severity="error" action={
                <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => { result(undefined) ; }}
                >
                    <CloseIcon fontSize="inherit" />
                </IconButton>
            }
                   sx={{ mb: 2 }}
            >
                {error_max_0}
            </Alert>
        ) :
        (
        <Dialog open={open} onClose={() => { result() ; }}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText sx={{
                    marginBottom: '20px'
                }}>
                    {text}
                </DialogContentText>
                <Slider defaultValue={value} onChange={handleInputChange} aria-label="Default" valueLabelDisplay="auto" />
                <DialogContentText sx={{
                    marginTop: '20px'
                }}>
                    Amount: {new web3.utils.BN(token_balance).div(new web3.utils.BN(10**8)).mul(new web3.utils.BN(value)).div(new web3.utils.BN(100)).toString()} {TOKEN_NAME} / {(native_balance/10**18)*value/100} {getNativeCurrency(chainId).symbol}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => { result() ; }}>Cancel</Button>
                <Button onClick={() => { result((new web3.utils.BN(balance).mul(new web3.utils.BN(value)).div(new web3.utils.BN(100)))); }}>{button}</Button>
            </DialogActions>
        </Dialog>
    );
}