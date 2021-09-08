import * as React from 'react';
import { styled, useTheme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';

import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import MuiAppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CallReceivedIcon from '@material-ui/icons/CallReceived';
import CallMadeIcon from '@material-ui/icons/CallMade';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import AddIcon from '@material-ui/icons/Add';

import Header from "./Header";
import FooterBar from "./FooterBar"

const Main = styled('main')(({ theme }) => ({
        height: '100vh',
        paddingBottom: '130px',
    })
);


const Footer = styled('div')(({ theme }) => ({
    display: 'flex',
    position: 'fixed',
    top: '0',
    bottom: 'auto',
    width: '100%'}));

export default function PersistentDrawerLeft(props: any) {
    const { window, theme, children, addedAsset } = props;
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleClick = (clicked: number) => {
        props.sectionSelected(clicked);
        setOpen(false);
    };

    return (
        <>
            <CssBaseline />
            <Footer>
                <FooterBar killSession={props.killSession}
                           connected={props.connected}
                           address={props.address}
                           chainId={props.chainId}/>
            </Footer>
            <Main>
                {children}
            </Main>


        </>

    );
}