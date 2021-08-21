import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Box from '@material-ui/core/Box';
import CssBaseline from '@material-ui/core/CssBaseline';

import * as React from "react";
import styled from "@emotion/styled"
import * as PropTypes from "prop-types";
import Banner from "./Banner";
import { ellipseAddress, getChainData } from "../helpers/utilities";
import { isValidChain} from "../helpers/web3";
import { transitions } from "../styles";
import clsx from "clsx";
import {makeStyles, useTheme} from "@material-ui/core/styles";

const SHeader = styled.div`
  margin-top: -1px;
  margin-bottom: 1px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
`;

const SActiveAccount = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  font-weight: 500;
`;

const SActiveChain = styled(SActiveAccount)`
  flex-direction: column;
  text-align: left;
  align-items: flex-start;
  & p {
    font-size: 0.8em;
    margin: 0;
    padding: 0;
  }
  & p:nth-child(2) {
    font-weight: bold;
  }
`;

interface IHeaderStyle {
    connected: boolean;
}

const SAddress = styled.p<IHeaderStyle>`
  transition: ${transitions.base};
  font-weight: bold;
  margin: ${({ connected }) => (connected ? "-2px auto 0.7em" : "0")};
`;

const SDisconnect = styled.div<IHeaderStyle>`
  transition: ${transitions.button};
  font-size: 12px;
  font-family: monospace;
  position: absolute;
  right: 0;
  top: 20px;
  opacity: 0.7;
  cursor: pointer;

  opacity: ${({ connected }) => (connected ? 1 : 0)};
  visibility: ${({ connected }) => (connected ? "visible" : "hidden")};
  pointer-events: ${({ connected }) => (connected ? "auto" : "none")};

  &:hover {
    transform: translateY(-1px);
    opacity: 0.5;
  }
`;

interface IHeaderProps {
    killSession: () => void;
    connected: boolean;
    address: string;
    chainId: number;
}

const FooterBar = (props: IHeaderProps) => {
    const { connected, address, chainId, killSession } = props;
    const chainData = chainId && isValidChain(chainId) ? getChainData(chainId) : null;

    return (
        <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
            <Toolbar>
                <SHeader {...props}>
                    {connected && chainData ? (
                        <SActiveChain>
                            <p>{`Connected to`}</p>
                            <p>{chainData.name}</p>
                        </SActiveChain>
                    ) : ''}

                    {address && (
                        <SActiveAccount>
                            <SAddress connected={connected}>{ellipseAddress(address)}</SAddress>
                            <SDisconnect connected={connected} onClick={killSession}>
                                {"Disconnect"}
                            </SDisconnect>
                        </SActiveAccount>
                    )}
                </SHeader>
            </Toolbar>
        </AppBar>
    );
};

FooterBar.propTypes = {
    killSession: PropTypes.func.isRequired,
    address: PropTypes.string,
};

export default FooterBar;