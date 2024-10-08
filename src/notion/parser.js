function getAllTags(database) {
    const properties = database.properties;
    const tags = [];
  
    for (const propertyId in properties) {
      const property = properties[propertyId];
  
      if (property.type === 'multi_select') {
        tags.push(...property.multi_select.options.map(t=>t.name));
      }
    }
  
    return tags;
}

function getAllReads(pages) {
  return pages.results.map(p => ({
    id: p.id,
    url: p.properties.URL.url,
    priority: p.properties.Priority.number,
    description: p.properties.Description.rich_text[0].plain_text,
    status: p.properties.Status.status.name,
    title: p.properties.Title.title[0].plain_text,
    tags: p.properties.Tags.multi_select.map(t => t.name),
  })).sort((a,b) => a.created_time > b.created_time ? 1 : -1);
}

function parse(database, pages) {
    const tags = getAllTags(database);
    const reads = getAllReads(pages);
    return {tags, reads};
}

module.exports = parse;