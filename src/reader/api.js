function Reader(notion, openai) {
    this.notion = notion;
    this.openai = openai;
}

Reader.prototype.getTags = async function() {
    return this.notion.getTags();
}

Reader.prototype.popByTag = async function(tag, offset) {
    return this.notion.popByTag(tag, offset);
}

Reader.prototype.markAsRead = async function(id) {
    return this.notion.markAsRead(id);
}

Reader.prototype.addRow = async function({url, priority, tags, title = '', description = ''}) {
    if (!title || !description) {
        const result = await this.openai.generateInfo(url);
        title = result.title;
        description = result.description;
    }
    if (!tags) {
        const result = await this.openai.generateTags(url, await this.getTags());
        tags = result.tags;
    }
    this.notion.addRow({url, priority, tags, title, description});
    return tags;
}

module.exports = Reader;