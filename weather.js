// This is a simple Telegram bot that provides weather information
require('dotenv').config(); // Load .env

const TelegramBot = require('node-telegram-bot-api');
const token = process.env.BOT_TOKEN; // Replace with your bot token
const bot = new TelegramBot(token, { polling: true });
console.log('Запускаем бота...');

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    'Welcome to the weather bot! Please send your location to get the weather forecast'
  );
});

bot.on('message', (msg) => {
  const chatID = msg.chat.id;
  const text = msg.text;
  if (text.toLowerCase() != '/start') {
    bot.sendMessage(
      chatID,
      'Please send your location to get the weather forecast'
    );
  }
});
