import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import App from "./App";

// @ts-ignore
declare global {
    // tslint:disable-next-line
    interface Window {
        web3: any;
        ethereum: any;
        Web3Modal: any;
        Box: any;
        box: any;
        space: any;
        [name: string]: any;
    }
}

ReactDOM.render(
    <BrowserRouter>
        <App/>
    </BrowserRouter>,
    document.getElementById("root")
);
