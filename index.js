const { Telegraf, Markup } = require('telegraf');
const axios = require('axios');

require('dotenv').config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_API_KEY);
const CURRENCY_LIST_URL = 'https://api.coingecko.com/api/v3/simple/supported_vs_currencies';
const CRYPTO_PRICE_URL = 'https://api.coingecko.com/api/v3/simple/price?';

// helper function

function sendNextMessage(ctx) {
  bot.telegram.sendMessage(
    ctx.chat.id,
    'Would you like to know the value of another cryptocurrency?',
    Markup.inlineKeyboard([
      [
        Markup.button.callback('Bitcoin <> SGD', 'bitcoin'),
        Markup.button.callback('Ethereum <> SGD', 'ethereum'),
      ],
      [
        Markup.button.callback('Solana <> SGD', 'solana'),
        Markup.button.callback('Others', 'others'),
      ],
    ]),
    {
      parse_mode: 'HTML',
    }
  );
}

// starting the bot
bot.command('start', async (ctx) => {
  await ctx.telegram.sendMessage(
    ctx.chat.id,
    "Hi! I'm crypto rates. What rates would you like to know?",
    Markup.inlineKeyboard([
      [
        Markup.button.callback('Bitcoin <> SGD', 'bitcoin'),
        Markup.button.callback('Ethereum <> SGD', 'ethereum'),
      ],
      [
        Markup.button.callback('Solana <> SGD', 'solana'),
        Markup.button.callback('Others', 'others'),
      ],
    ]),
    {
      parse_mode: 'HTML',
    }
  );
});

bot.action('bitcoin', async (ctx) => {
  axios.get(`${CRYPTO_PRICE_URL}ids=bitcoin&vs_currencies=sgd`).then((response) => {
    const currencyValue = response.data.bitcoin.sgd;

    bot.telegram
      .sendMessage(ctx.chat.id, `The value of <b>bitcoin</b> is <b>SGD${currencyValue}</b>`, {
        parse_mode: 'HTML',
      })
      .then(() => {
        bot.telegram.sendMessage(
          ctx.chat.id,
          'Would you like to know the value of another cryptocurrency?',
          Markup.inlineKeyboard([
            [
              Markup.button.callback('Bitcoin <> SGD', 'bitcoin'),
              Markup.button.callback('Ethereum <> SGD', 'ethereum'),
            ],
            [
              Markup.button.callback('Solana <> SGD', 'solana'),
              Markup.button.callback('Others', 'others'),
            ],
          ]),
          {
            parse_mode: 'HTML',
          }
        );
      });
  });
});

bot.action('ethereum', async (ctx) => {
  axios.get(`${CRYPTO_PRICE_URL}ids=ethereum&vs_currencies=sgd`).then((response) => {
    const currencyValue = response.data.ethereum.sgd;

    bot.telegram
      .sendMessage(ctx.chat.id, `The value of <b>ethereum</b> is <b>SGD${currencyValue}</b>`, {
        parse_mode: 'HTML',
      })
      .then(() => {
        sendNextMessage(ctx);
      });
  });
});

bot.action('solana', async (ctx) => {
  axios.get(`${CRYPTO_PRICE_URL}ids=solana&vs_currencies=sgd`).then((response) => {
    const currencyValue = response.data.solana.sgd;

    bot.telegram.sendMessage(
      ctx.chat.id,
      `The value of <b>solana</b> is <b>SGD${currencyValue}</b>`,
      { parse_mode: 'HTML' }
    );

    sendNextMessage(ctx);
  });
});

bot.action('others', async (ctx) => {
  await bot.telegram.sendMessage(
    ctx.chat.id,
    'Please provide us with two currency codes that you want to compare. Example: `/crypto_price usd bitcoin`',
    { parse_mode: 'Markdown' }
  );
});

bot.command('help', async (ctx) => {
  await bot.telegram.sendMessage(
    ctx.chat.id,
    '<b>Here are a list of commands to help you navigate me:</b>\n\n' +
      '<b><i>/start</i></b> - Start the bot\n\n' +
      '<b><i>/help</i></b> - Get help\n\n' +
      '<b><i>/currencies</i></b> - Get a list of supported currencies\n\n' +
      '<b><i>/crypto_price</i></b> - Get the value of the cryptocurrency either in USD or SGD. To use it: /crypto_price usd bitcoin\n\n' +
      '',
    { parse_mode: 'HTML' }
  );
});

bot.command('currencies', async (ctx) => {
  axios.get(CURRENCY_LIST_URL).then((response) => {
    const currenciesList = response.data;

    let formattedCurrenciesList = currenciesList.map((currency) => {
      return `*${currency}*`;
    });

    bot.telegram.sendMessage(
      ctx.chat.id,
      'Supported Currencies' + '\n\n' + formattedCurrenciesList.join('\n'),
      { parse_mode: 'Markdown' }
    );
  });
});

bot.command('crypto_price', async (ctx) => {
  // do some adjustments to the strings in case people have put a lot of spaces in between or something
  const textMessage = ctx.message.text.replace(/\s+/g, ' ');
  const firstCurrency = textMessage.split(' ')[1];
  const secondCurrency = textMessage.split(' ')[2];

  if (textMessage.split(' ').length > 3) {
    bot.telegram.sendMessage(
      ctx.chat.id,
      'Please provide us with two currency codes that you want to compare. Example: `/crypto_price usd bitcoin`',
      { parse_mode: 'Markdown' }
    );
    return;
  }

  if (firstCurrency === undefined || secondCurrency === undefined) {
    bot.telegram.sendMessage(
      ctx.chat.id,
      'Please provide us with two currency codes that you want to compare. Example: `/crypto_price usd bitcoin`',
      { parse_mode: 'Markdown' }
    );
    return;
  }

  axios
    .get(`${CRYPTO_PRICE_URL}ids=${secondCurrency}&vs_currencies=${firstCurrency}`)
    .then((response) => {
      const currencyValue = response.data[secondCurrency][firstCurrency];

      bot.telegram.sendMessage(
        ctx.chat.id,
        `The value of <b>${secondCurrency}</b> is <b>${firstCurrency.toUpperCase()}${currencyValue}</b>`,
        { parse_mode: 'HTML' }
      );
    })
    .catch((error) => {
      console.log(error);
      bot.telegram.sendMessage(
        ctx.chat.id,
        'Sorry, I did not quite get that. Remember, I need the full name of the cryptocurrency ie: `bitcoin` instead of `btc`',
        { parse_mode: 'Markdown' }
      );
    });
});

bot.launch();
