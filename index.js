const CONFIG = require('./config');
const OpenAIAPI = require('./src/openai/');
const Notion = require('./src/notion/');
const Reader = require('./src/reader/');
const Telegram = require('./src/telegram/');

function init() {
    const telegram = new Telegram(CONFIG.TELEGRAM.API, CONFIG.NOTION.AUTH_URL, {
        Reader, Notion, OpenAIAPI,
    });
}

init();