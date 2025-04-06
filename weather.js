// This is a simple Telegram bot that provides weather information
require('dotenv').config(); // Load .env

const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;



const weatherToken = process.env.WEATHER_TOKEN; // Replace with your OpenWeatherMap API key
const token = process.env.BOT_TOKEN; // Replace with your bot token


app.get('/', (req, res) => {
  res.send('Бот работает!');
});

app.listen(PORT, () => {
  console.log(`🚀 Express server is running on port ${PORT}`);
});
// Create a new Telegram bot instance

const bot = new TelegramBot(token, { polling: true });
console.log('Запускаем бота...');

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    'Привет! Напишите название города, и я пришлю прогноз  погоды'
  );
});


function getWeatherEmoji(condition) {
  const lower = condition.toLowerCase();
  if (lower.includes('rain')) return '🌧️';
  if (lower.includes('clear')) return '☀️';
  if (lower.includes('sun')) return '☀️';
  if (lower.includes('cloud')) return '☁️';
  if (lower.includes('snow')) return '❄️';
  if (lower.includes('thunderstorm')) return '⛈️';
  if (lower.includes('fog')) return '🌫️';
  if (lower.includes('wind')) return '💨';
  if (lower.includes('mist')) return '🌫️';
  if (lower.includes('haze')) return '🌫️'
  if (lower.includes('dust')) return '🌪️';
  if (lower.includes('smoke')) return '🌫️';
  if (lower.includes('sand')) return '🌪️';
  if (lower.includes('tornado')) return '🌪️';
  if (lower.includes('squall')) return '🌪️';
  if (lower.includes('ash')) return '🌋';
  if (lower.includes('sleet')) return '🌧️';
  if (lower.includes('hail')) return '🌨️';
  if (lower.includes('hot')) return '🔥';
  if (lower.includes('cold')) return '❄️';
  if (lower.includes('storm')) return '⛈️';
  if (lower.includes('partly cloudy')) return '🌤️';
  if (lower.includes('overcast')) return '☁️';
  if (lower.includes('mostly cloudy')) return '☁️';
  if (lower.includes('mostly sunny')) return '🌤️';
  if (lower.includes('partly sunny')) return '🌤️';
  if (lower.includes('light rain')) return '🌦️';
  if (lower.includes('light snow')) return '🌨️';


}

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const city = msg.text;

  if (city.toLowerCase() === '/start') return;

  try {
    const url = `http://api.weatherapi.com/v1/current.json?key=${weatherToken}&q=${encodeURIComponent(
      city
    )}&lang=ru`;
    const response = await axios.get(url);
    const data = response.data;

    const weather = data.current.condition.text;
    const temp = data.current.temp_c;
    const feelsLike = data.current.feelslike_c;
    const wind = data.current.wind_kph;
    const humidity = data.current.humidity;
    const pressure = data.current.pressure_mb;
    const icon = data.current.condition.icon;
    const iconUrl = `http:${icon}`;
    const windDirection = data.current.wind_dir;

    const message = `
    🌍 *${data.location.name}, ${data.location.country}*
${emoji} *${condition}*
    Погода в городе *${data.location.name}*:
- ${weather}
- 🌡 Температура: ${temp}°C
- 🤗 Ощущается как: ${feelsLike}°C
💨 Ветер: *${wind} км/ч*
- 🌬 Направление ветра: *${windDirection}*
💧 Влажность: *${humidity}%*
`;

    bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  } catch (error) {
    console.error(error.response?.data || error.message);
    bot.sendMessage(
      chatId,
      '❌ Не удалось получить погоду. Убедитесь, что город указан правильно.'
    );
  }
});
