const { Client } = require('@notionhq/client');
const parser = require('./parser');

const MEMORY = new Map();

function Notion(auth, id, secret, dbid) {
    this.client = new Client({ auth });
    this.auth = auth;
    this.id = id;
    this.secret = secret;
    this.dbid = dbid;
}

Notion.prototype.setDbId = function(id) {
  this.dbid = id;
};

Notion.prototype.refreshMemory = async function() {
  const database = await this.client.databases.retrieve({ database_id: this.dbid });
  const pages =  await this.client.databases.query({ database_id: this.dbid });
  const parsed = parser(database, pages);
  MEMORY.set(this.dbid, {...parsed});
}

Notion.prototype.getTags = async function() {
  await this.refreshMemory();
  return MEMORY.get(this.dbid).tags;
}

Notion.prototype.popByTag = async function(tag, offset = 0) {
  await this.refreshMemory();
  return MEMORY
    .get(this.dbid).reads
    .filter(r => r.status !== 'Done')
    .filter(r => '*' === tag || r.tags.includes(tag))
    .sort((r1, r2) => r1.priority > r2.priority ? -1 : 1)
    [offset];
}

Notion.prototype.markAsRead = async function(id) {
  try {
    const response = await this.client.pages.update({
      page_id: id,
      properties: {
        Status: {
          status: {
            name: 'Done',
          }
        },
      },
    });
} catch (err) {
    console.error('failed to add new row');
    throw err;
}
}

Notion.prototype.addRow = async function({url, title, priority = null, tags = [], description = ''}) {
    if (!url) {
        throw new Error('expected @url');
    }
    if (!title) {
        throw new Error('expected @title');
    }
    priority = parseInt(priority);
    if (isNaN(priority) || priority < 0) {
        throw new Error('expected @priority to be a number');
    }
    
    try {
        const response = await this.client.pages.create({
          parent: {
            database_id: this.dbid,
          },
          properties: {
            Title: {
              title: [
                {
                  text: {
                    content: title,
                  },
                },
              ],
            },
            Priority: {
                number: priority,
              },
            Tags: {
                multi_select: tags.map(t => ({name: t})),
              },
            Description: {
                rich_text: [
                  {
                    text: {
                      content: description,
                    },
                  },
                ],
              },
              URL: {
                url: url,
              },
          },
        });
    } catch (err) {
        console.error('failed to add new row');
        throw err;
    }
}

module.exports = Notion;