const { OpenAI } = require('openai');

const {
    parseMatches,
    parseTitleAndDescription,
    delimiter,
} = require('./parser');

function OpenAIAPI(apiKey) {
    this.client = new OpenAI({apiKey});
}

function verifyURL(url) {
    if (new URL(url).protocol !== 'https:') {
        throw new Error('url must start with "https:"');
    }
}

async function request(client, prompt) {
    try {
        console.log('OpenAIAPI:', 'sending prompt:', prompt);
        const completion = await client.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'gpt-3.5-turbo',
        });
        return completion;
    } catch (err) {
        console.error('failed to get response from openai');
        throw err;
    }
}

OpenAIAPI.prototype.generateTags = async function(url = '', tags = []) {
    verifyURL(url);
    const matches = await request(this.client, `using 2 commas max, respond with only the three or less best tags to describe the contents of ${url} out of the following tags ${JSON.stringify(tags)}`);
    const result = parseMatches(matches);
    console.log('OpenAIAPI:', 'matches:', result);
    return result;
}

OpenAIAPI.prototype.generateInfo = async function(url = '') {
    verifyURL(url);
    const completion = await request(this.client, `respond exactly with "{{ title }} ${delimiter} {{ description }}" but instead of "{{ title }}" extract the title from the page and instead of "{{ description }}" put your best 40 words max summary of it (get page from ${url})`);
    const result = parseTitleAndDescription(completion);
    console.log('OpenAIAPI:', 'info:', result);
    return result;
}

module.exports = OpenAIAPI;