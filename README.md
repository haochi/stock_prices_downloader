Stock Prices Downloader
=======================

This script will download the historical stock prices from [Yahoo Finance](https://finance.yahoo.com) and save it in a SQLite database for querying afterward.

It can probably be parallelized but don't want to risk getting throttled by Yahoo.

Run It
------

* `git clone https://github.com/haochi/stock_prices_downloader.git` to clone this repo
* `npm install` to install the dependencies.
* Create a `tickers.js` file with a list of stock tickers that you want to download. See `tickers.example.js` for an example.
* `node index.js` to start running. This might take a while depending on how many tickers you are fetching.