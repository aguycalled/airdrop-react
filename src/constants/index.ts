export * from './actions'
export * from './contracts'
export * from './functions'
export const TOKEN_NAME = 'WNAV'
export const TOKEN_FULL_NAME = 'Navcoin'
export const ELECTRUM_CONFIG = {host: 'electrum4.nav.community', port: 40004, proto: 'wss'}
export const GAS_SIZE = 107552;
export const WITHDRAWAL_FEE = 0.004;
export const BRIDGE_CONFIG =
    {

        "stakingPoolAddress":"NatusHWq4RUEAcVFMeC2jYoztFAqP3Mcq9",
        "publicKeyNav":"xpub661MyMwAqRbcGU4zstehr61rwbDzTBkZpKaWhXXEiZcNY9HYaEutrSqB4c8m2eh7Z77ggyVxdeSPXNYeN3Ns16BUh3cBwHJPAjASCfVusFK",
        "feeMint":1.25,
        "coldStorage": {
            "keys": [
                "xpub661MyMwAqRbcGU4zstehr61rwbDzTBkZpKaWhXXEiZcNY9HYaEutrSqB4c8m2eh7Z77ggyVxdeSPXNYeN3Ns16BUh3cBwHJPAjASCfVusFK",
                "xpub661MyMwAqRbcFhr6161UfjbRCwiBoohJe19QjythTuB4LbptEUx1tUcjN9E3uiEC68PoRvTZc7MVEF4NFikmHfSGguUd3Fq3fmZYBNsywgp",
                "xpub661MyMwAqRbcGDHnsAU1FZqnXvPAn8biWfGnnFPts18h8r7DWUqDdx2LMs2mhtAPR7mtcVyr7QpaFdjKZmJd97nJJagG3Z1bEBAaD3fnW9P",
                "xpub661MyMwAqRbcFMUqdhtUnkFG7fKdzkUXMCX5oypMUHTJsUskMNcEWs5tkJaFRz4VcGdpJu63BneYsczLSe4KGFWAc8SAPbKGBBYg7tstRv2"
            ],
            "requiredSigs":3,
            "master":"xpub661MyMwAqRbcGU4zstehr61rwbDzTBkZpKaWhXXEiZcNY9HYaEutrSqB4c8m2eh7Z77ggyVxdeSPXNYeN3Ns16BUh3cBwHJPAjASCfVusFK"
        },
        "navConfirmations":1,
        "ethConfirmations":1,
        "defaultNavFee":100000,
        "signers":[
            "xpub661MyMwAqRbcGU4zstehr61rwbDzTBkZpKaWhXXEiZcNY9HYaEutrSqB4c8m2eh7Z77ggyVxdeSPXNYeN3Ns16BUh3cBwHJPAjASCfVusFK",
            "xpub661MyMwAqRbcFhr6161UfjbRCwiBoohJe19QjythTuB4LbptEUx1tUcjN9E3uiEC68PoRvTZc7MVEF4NFikmHfSGguUd3Fq3fmZYBNsywgp",
            "xpub661MyMwAqRbcGDHnsAU1FZqnXvPAn8biWfGnnFPts18h8r7DWUqDdx2LMs2mhtAPR7mtcVyr7QpaFdjKZmJd97nJJagG3Z1bEBAaD3fnW9P",
            "xpub661MyMwAqRbcFMUqdhtUnkFG7fKdzkUXMCX5oypMUHTJsUskMNcEWs5tkJaFRz4VcGdpJu63BneYsczLSe4KGFWAc8SAPbKGBBYg7tstRv2"
        ]
    }

