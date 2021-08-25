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

const drawerWidth = 200;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
    open?: boolean;
}>(
    ({ theme, open }) => ({
        flexGrow: 1,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        ...(open && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
        }),
        height: '100vh',
        paddingBottom: '130px',
    }),
);

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<{
    open?: boolean;
}>(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    })
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

const Footer = styled('div', { shouldForwardProp: (prop) => prop !== 'open' })<{
    open?: boolean;
}>(({ theme , open}) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
    display: 'flex',
    position: 'fixed',
    top: 'auto',
    bottom: 0,
    width: '100%'}))

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
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Header killSession={props.killSession}
                                       connected={props.connected}
                                       address={props.address}
                                       chainId={props.chainId}/>
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                anchor="left"
                open={open}
            >
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    <ListItem button key={"Overview"} onClick={() => handleClick(1)}>
                        <ListItemIcon><AccountBalanceIcon /> </ListItemIcon>
                        <ListItemText primary={"Overview"} />
                    </ListItem>
                </List>
                <Divider />
                <List>
                    <ListItem button key={"Deposit"} onClick={() => handleClick(2)}>
                        <ListItemIcon><CallReceivedIcon /> </ListItemIcon>
                        <ListItemText primary={"Deposit"} />
                    </ListItem>
                    <ListItem button key={"Withdraw"} onClick={() => handleClick(3)}>
                        <ListItemIcon><CallMadeIcon /> </ListItemIcon>
                        <ListItemText primary={"Withdraw"} />
                    </ListItem>
                </List>
                { addedAsset ? '' : (
                    <>
                        <Divider />
                        <List>
                            <ListItem button key={"Add wNAV to Metamask"} onClick={() => handleClick(5)}>
                                <ListItemIcon><AddIcon /> </ListItemIcon>
                                <ListItemText primary={"Add wNAV to Metamask"} />
                            </ListItem>
                        </List>
                    </>
                )}
            </Drawer>
            <Main open={open}>
                <DrawerHeader />
                {children}
            </Main>
            <Footer>
                <FooterBar killSession={props.killSession}
                               connected={props.connected}
                               address={props.address}
                               chainId={props.chainId}/>
            </Footer>

        </>

    );
}