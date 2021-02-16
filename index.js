require("dotenv").config()
const Discord = require("discord.js")


const replaceString = require('replace-string');
const https = require('follow-redirects').https;
const redis = require("redis");
let redisClient = null;

var fs = require('fs');

const clientSdt = new Discord.Client();
clientSdt.login(process.env.BOT_TOKEN_SDT);

const clientEth = new Discord.Client();
clientEth.login(process.env.BOT_TOKEN_ETH);

const clientSdtCS = new Discord.Client();
clientSdtCS.login(process.env.BOT_TOKEN_SDTCS);

const clientSdtTVL = new Discord.Client();
clientSdtTVL.login(process.env.BOT_TOKEN_SDTTVL);

let sdtPrice = 13.43;
let sdtMarketcap = 34828682;

let ethPrice = 1790.90;
let ethMarketcap = 205349957;

let sdtCircSupply = 2586691;
let sdtTVL = 167707909;

let btcPrice = 47900;
let eurPrice = 1.2;

setInterval(function () {

    clientEth.guilds.cache.forEach(function (value, key) {
        try {
            value.members.cache.get("811005343714902037").setNickname("$" + ethPrice);
            value.members.cache.get("811005343714902037").user.setActivity("marketcap=$" + getNumberLabel(ethMarketcap), {type: 'PLAYING'});
        } catch (e) {
            console.log(e);
        }
    });

    clientSdt.guilds.cache.forEach(function (value, key) {
        try {
            value.members.cache.get("811005372064071680").setNickname("$" + sdtPrice);
            value.members.cache.get("811005372064071680").user.setActivity("marketcap=$" + getNumberLabel(sdtMarketcap), {type: 'PLAYING'});
        } catch (e) {
            console.log(e);
        }
    });

    clientSdtCS.guilds.cache.forEach(function (value, key) {
        try {
            value.members.cache.get("811005436618473553").setNickname("circulating supply");
            value.members.cache.get("811005436618473553").user.setActivity(numberWithCommas(sdtCircSupply), {type: 'PLAYING'});
        } catch (e) {
            console.log(e);
        }
    });

    clientSdtCS.guilds.cache.forEach(function (value, key) {
        try {
            value.members.cache.get("811005436618473553").setNickname("AUM");
            value.members.cache.get("811005436618473553").user.setActivity(numberWithCommas(sdtTVL), {type: 'PLAYING'});
        } catch (e) {
            console.log(e);
        }
    });

}, 30 * 1000);


function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}


function getNumberLabel(labelValue) {

    // Nine Zeroes for Billions
    return Math.abs(Number(labelValue)) >= 1.0e+9

        ? Math.round(Math.abs(Number(labelValue)) / 1.0e+9) + "B"
        // Six Zeroes for Millions
        : Math.abs(Number(labelValue)) >= 1.0e+6

            ? Math.round(Math.abs(Number(labelValue)) / 1.0e+6) + "M"
            // Three Zeroes for Thousands
            : Math.abs(Number(labelValue)) >= 1.0e+3

                ? Math.round(Math.abs(Number(labelValue)) / 1.0e+3) + "K"

                : Math.abs(Number(labelValue));

}

setInterval(function () {
    https.get('https://api.coingecko.com/api/v3/coins/stake-dao', (resp) => {
        let data = '';

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            try {
                let result = JSON.parse(data);
                sdtPrice = result.market_data.current_price.usd;
                sdtPrice = Math.round(((sdtPrice * 1.0) + Number.EPSILON) * 1000) / 1000;
                sdtMarketcap = result.market_data.market_cap.usd;
                sdtCircSupply = result.market_data.circulating_supply;
                sdtCircSupply = Math.round(((sdtCircSupply * 1.0) + Number.EPSILON) * 1000) / 1000;
            } catch (e) {
                console.log(e);
            }

        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });

}, 60 * 1000 * 1);


setInterval(function () {
    https.get('https://api.coingecko.com/api/v3/coins/ethereum', (resp) => {
        let data = '';

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            try {
                let result = JSON.parse(data);
                ethPrice = result.market_data.current_price.usd;
                ethPrice = Math.round(((ethPrice * 1.0) + Number.EPSILON) * 1000) / 1000;
                ethMarketcap = result.market_data.market_cap.usd;
            } catch (e) {
                console.log(e);
            }

        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });

}, 60 * 1000 * 1);

setInterval(function () {
    https.get('https://api.coingecko.com/api/v3/coins/seur', (resp) => {
        let data = '';

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            try {
                let result = JSON.parse(data);
                eurPrice = result.market_data.current_price.usd;
                eurPrice = Math.round(((eurPrice * 1.0) + Number.EPSILON) * 1000) / 1000;
            } catch (e) {
                console.log(e);
            }

        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });

}, 60 * 1000 * 1);

setInterval(function () {
    https.get('https://api.coingecko.com/api/v3/coins/bitcoin', (resp) => {
        let data = '';

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            try {
                let result = JSON.parse(data);
                btcPrice = result.market_data.current_price.usd;
                btcPrice = Math.round(((btcPrice * 1.0) + Number.EPSILON) * 1000) / 1000;
            } catch (e) {
                console.log(e);
            }

        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });

}, 60 * 1000 * 1);


let masterChefTvl = 3000000;
setInterval(function () {
    try {
        https.get('https://api.ethplorer.io/getAddressInfo/0xfEA5E213bbD81A8a94D0E1eDB09dBD7CEab61e1c?apiKey=freekey', (resp) => {
            let data = '';

            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                try {
                    let result = JSON.parse(data);

                    let ethBalance = result.ETH.balance * result.ETH.price.rate;

                    let otherTokens = 0;
                    result.tokens.forEach(t => {
                        let price = 0;
                        if (t.tokenInfo.symbol.includes("BTC")) {
                            price = btcPrice;
                        } else {
                            if (t.tokenInfo.symbol.toLowerCase().includes("eur")) {
                                price = eurPrice;
                            } else {
                                if (t.tokenInfo.symbol.toLowerCase().includes("sd3")) {
                                    price = 1;
                                }
                            }
                        }
                        if (price > 0) {
                            let curValue = price * t.balance / Math.pow(10, t.tokenInfo.decimals);
                            otherTokens += curValue;
                        }
                    });

                    masterChefTvl = ethBalance + otherTokens;
                    masterChefTvl = Math.round(((masterChefTvl * 1.0) + Number.EPSILON) * 10) / 10;
                    sdtTVL = masterChefTvl;
                } catch (e) {
                    console.log(e);
                }
            });

        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    } catch (e) {
        console.log(e);
    }
}, 10 * 1000 * 120);


function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// move the gas bot here
const clientgasPrice = new Discord.Client();
clientgasPrice.login(process.env.BOT_TOKEN_GAS);

setInterval(function () {
    clientgasPrice.guilds.cache.forEach(function (value, key) {
        try {
            value.members.cache.get("811005290483941436").setNickname(gasPrice + " gwei");
            value.members.cache.get("811005290483941436").user.setActivity("fast=" + fastGasPrice + " slow=" + lowGasPrice, {type: 'PLAYING'});
        } catch (e) {
            console.log(e);
        }
    })
}, 60 * 1000);

let gasPrice = 20;
let fastGasPrice = 20;
let lowGasPrice = 20;
let instantGasPrice = 20;
setInterval(function () {
    https.get('https://www.gasnow.org/api/v3/gas/price', (resp) => {
        let data = '';

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            try {
                let result = JSON.parse(data);
                gasPrice = result.data.standard / 1000000000;
                fastGasPrice = result.data.fast / 1000000000;
                lowGasPrice = result.data.slow / 1000000000;
                instantGasPrice = result.data.rapid / 1000000000;
                gasPrice = Math.round(((gasPrice * 1.0) + Number.EPSILON) * 10) / 10;
                fastGasPrice = Math.round(((fastGasPrice * 1.0) + Number.EPSILON) * 10) / 10;
                lowGasPrice = Math.round(((lowGasPrice * 1.0) + Number.EPSILON) * 10) / 10;
                instantGasPrice = Math.round(((instantGasPrice * 1.0) + Number.EPSILON) * 10) / 10;
            } catch (e) {
                console.log(e);
            }
        });
    });

}, 30 * 1000);