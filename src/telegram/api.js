const TelegramBot = require('node-telegram-bot-api');
const CONFIG = require('../../config');
const {getAccessToken} = require('../notion/util');

const readers = new Map();

function Telegram(token, authUrl, { Reader, Notion, OpenAIAPI, }) {
    this.client = new TelegramBot(token, { polling: true });
    this.openai = new OpenAIAPI(CONFIG.OPENAI.API);

    function start(client, msg) {
        console.log('telegram:', 'start', msg.text);
        client.sendMessage(msg.chat.id, `Start by integrating Notion please: ${authUrl}`);
    }

    this.client.onText(/\/start/, (msg) => {
        start(this.client, msg);
    });

    this.client.onText(/mark as read/, async (msg) => {
        console.log('telegram:', 'done', msg.text);
        const state = readers.get(msg.from.id);
        if (!state) {
            start(this.client, msg);
            return;
        }
        await state.reader.markAsRead(state.temp_id);
        this.client.sendMessage(msg.chat.id, `done!`);
    });

    this.client.onText(/^[a-z\*A-Z\s+]+$/, async (msg) => {
        console.log('telegram:', 'get', msg.text);
        const tag = msg.text.split('+')[0].toLowerCase().trim();
        const state = readers.get(msg.from.id);
        if (!state) {
            start(this.client, msg);
            return;
        }
        const data = await state.reader.popByTag(tag, msg.text.split('+').length-1);
        if (!data) {
            this.client.sendMessage(msg.chat.id, `failed to find a link tagged as "${tag}"`);
            return;
        }
        state.temp_id = data.id;
        const answer = `
${data.title}

${data.url}

${data.description}
        `;
        const keyboard = {
            reply_markup: {
                keyboard: [
                    [{text: 'mark as read 👍', callback_data: 'done'}],
                ],
                resize_keyboard: true,
            },
        };
        this.client.sendMessage(msg.chat.id, answer, keyboard);
    });

    this.client.onText(/^[12345]/, async (msg) => {
        console.log('telegram:', '12345', msg.text);

        const priority = msg.text;
        this.client.sendMessage(msg.chat.id, 'Processing...');
        const state = readers.get(msg.from.id);
        if (!state) {
            start(this.client, msg);
            return;
        }
        try {
            const tags = await state.reader.addRow({url:state.temp_url, priority});
            this.client.sendMessage(msg.chat.id, `Done 👍 (tagged as: ${tags.join(', ')})`);
        } catch (err) {
            this.client.sendMessage(msg.chat.id, 'Failed 👎 Try again');
            console.error('failed to add row');
            throw err;
        }
    });

    this.client.onText(/Share this key/, async (msg) => {
        const code = msg.text.split('\n')[0];
        const result = await getAccessToken(CONFIG.NOTION.CLIENT_ID, CONFIG.NOTION.OAUTH_SECRET, code);
        let reader = readers.get(msg.from.id)?.reader;
        if (!reader) {
            const notion = new Notion(result.access_token, CONFIG.NOTION.CLIENT_ID, result.access_token);
            let dbid = result.duplicated_template_id;
            if (!dbid) {
                const result = await notion.client.search({page_size:10});
                result.results.forEach(r => {
                    if (dbid) {
                        return;
                    }
                    if (result?.results[0]?.title && result?.results[0]?.title[0]?.text?.content === 'Read list') {
                        dbid = result?.results[0].id;
                        return;
                    }
                    if (result?.results[0]?.parent?.database_id) {
                        dbid = result?.results[0]?.parent?.database_id;
                        return;
                    }
                });
                if (!dbid) {
                    this.client.sendMessage(msg.chat.id, 'Failed to find notion table to access to!');
                    return;
                }
            }
            notion.setDbId(dbid);
            reader = new Reader(notion, this.openai);
        }
        readers.set(msg.from.id, {reader});
        this.client.sendMessage(msg.chat.id, 'All set! Start pasting links 🔗');
    });
    
    this.client.onText(/^https:/, async (msg) => {
        console.log('telegram:', 'https', msg.text);
        
        const state = readers.get(msg.from.id);
        if (!state) {
            start(this.client, msg);
            return;
        }
        state.temp_url = msg.text;
        const options = [1,2,3,4,5];
        
        const keyboard = {
            reply_markup: {
                keyboard: [
                    options.map((option) => ({
                    text: option,
                    callback_data: option,
                    })),
                ],
                resize_keyboard: true,
            },
        };

        this.client.sendMessage(
            msg.chat.id,
            'Priority? ⭐',
            keyboard
        );
    
    });
}

module.exports = Telegram;