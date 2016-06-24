const https = require('https');
const parse = require('csv-parse');
const transform = require('stream-transform');
const tickers = require('./tickers');
const sqlite3 = require('sqlite3').verbose();

const stockPricesTableDefinition = `
CREATE TABLE IF NOT EXISTS stock_prices (
    id INTEGER PRIMARY KEY,
    ticker TEXT,
    date DATE,
    open REAL,
    high REAL,
    low REAL,
    close REAL,
    volume REAL,
    adjustClose REAL
);
CREATE INDEX ticker_idx ON stock_prices (ticker);
`;

const db = new sqlite3.Database('stock_prices.sqlite3', () => {
    db.run(stockPricesTableDefinition, () => {
        getStocks(tickers);
    });
});

const getStocks = (tickers) => {
    const parser = parse();
    const stmt = db.prepare("INSERT INTO `stock_prices` (`ticker`, `date`, `open`, `high`, `low`, `close`, `volume`, `adjustClose`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");

    if (tickers.length > 0) {
        let ticker = tickers.shift();
        console.log(`Getting ${ticker}, ${tickers.length} left`);

        const transformer = transform((raw, callback) => {
            const [date, open, high, low, close, volume, adjClose] = raw;
            stmt.run(ticker, date, open, high, low, close, volume, adjClose);
            callback(null, '');
        });

        https.get(`https://ichart.finance.yahoo.com/table.csv?s=${ticker}&a=01&b=01&c=1900&d=12&e=31&f=2100&g=d&ignore=.csv`, (response) => {
            if (response.statusCode === 200) {
                response
                    .pipe(parser)
                    .pipe(transformer)
                    .pipe(process.stdout);
            }
            getStocks(tickers);
        });
    } else {
        console.log('done');
    }
};



