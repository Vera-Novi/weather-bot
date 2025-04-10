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




bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const city = msg.text;

  if (city.toLowerCase() === '/start') return;

  try {
    const url = `http://api.weatherapi.com/v1/forecast.json?key=${weatherToken}&q=${encodeURIComponent(
      city
    )}&days=3&lang=ru`;
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
    *${weather}*

Погода в городе *${data.location.name}*:
- ${weather}
- 🌡 Температура: ${temp}°C
- 🤗 Ощущается как: ${feelsLike}°C
💨 Ветер: *${wind} км/ч*
- 🌬 Направление ветра: *${windDirection}*
💧 Влажность: *${humidity}%*
Давление: *${pressure} мм рт. ст.*
`;

    const forecast = data.forecast.forecastday;
    let forecastMessage = '\n📆 Прогноз на 3 дня:\n';

    forecast.forEach(day => {
      const date = day.date;
      const condition = day.day.condition.text;
      const avgTemp = day.day.avgtemp_c;
      const minTemp = day.day.mintemp_c;
      const maxTemp = day.day.maxtemp_c;

      forecastMessage += `
📅 *${date}*:
- ${condition}
- 🌡 Мин: ${minTemp}°C / Макс: ${maxTemp}°C / Сред: ${avgTemp}°C
`;
    });

    const fullMessage = message + '\n' + forecastMessage;
    bot.sendMessage(chatId, fullMessage, { parse_mode: 'Markdown' });
  } catch (error) {
    console.error(error.response?.data || error.message);
    bot.sendMessage(
      chatId,
      '❌ Не удалось получить погоду. Убедитесь, что город указан правильно.'
    );
  }
});
