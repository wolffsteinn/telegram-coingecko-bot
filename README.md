# Telegram Bot - Crypto Rates

A simple Telegram bot that provides cryptocurrency rates using the CoinGecko API.

## Features

- Get the current value of popular cryptocurrencies (Bitcoin, Ethereum, Solana).
- Compare the value of any two cryptocurrencies.
- List of supported currencies.

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd telegram-bot-coingecko
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your Telegram Bot API key:
   ```plaintext
   TELEGRAM_BOT_API_KEY=your_api_key_here
   ```

## Usage

To start the bot, run:
   ```bash
   npm start
   ```


### Commands

- `/start`: Start the bot and get initial options.
- `/help`: List available commands.
- `/currencies`: Get a list of supported currencies.
- `/crypto_price <currency_code> <crypto_name>`: Get the value of a specific cryptocurrency in the specified currency.

### Example

To get the value of Bitcoin in SGD: `/crypto_price sgd bitcoin`


## Dependencies

- **axios**: For making HTTP requests.
- **dotenv**: For loading environment variables.
- **telegraf**: For building the Telegram bot.

## License

This project is licensed under the ISC License.