const delimiter = '🕵🏼‍♀';

function parseMatches(completion) {
    try {
        const result = completion.choices[0].message.content;
        return {tags: result.trim()
            .split('"').join('')
            .split('#').join('')
            .toLowerCase()
            .split(',')
            .map(x=>x.trim())};
    }
    catch (err) {
        debugger;
        console.error('failed to parse openai response:', completion.choices[0].message.content);
        throw err;
    }
}

function parseTitleAndDescription(completion) {
    try {
        const result = completion.choices[0].message.content.split(delimiter);
        return {title: result[0].trim(), description: result[1].trim()};
    }
    catch (err) {
        debugger;
        console.error('failed to parse openai response:', completion.choices[0].message.content);
        throw err;
    }
}

module.exports = {
    delimiter,
    parseMatches,
    parseTitleAndDescription,
}