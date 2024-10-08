const CONFIG = {
    TELEGRAM: {
        API: process.env.TELEGRAM_API,
    },
    OPENAI: {
        API: process.env.OPENAI_API,
    },
    NOTION: {
        CLIENT_ID: process.env.NOTION_CLIENT_ID,
        OAUTH_SECRET: process.env.NOTION_OAUTH_SECRET,
        AUTH_URL: `https://api.notion.com/v1/oauth/authorize?client_id=${process.env.NOTION_CLIENT_ID}&response_type=code&owner=user&redirect_uri=${process.env.REDIRECT_URI}`,
    },
    APILAYER: {
        API: process.env.APILAYER_API,
    },
    // TAGS: [
    //     'Travel',
    //     'Food',
    //     'Health',
    //     'Fitness',
    //     'Fashion',
    //     'Beauty',
    //     'Technology',
    //     'Business',
    //     'Marketing',
    //     'Personal Development',
    //     'Finance',
    //     'Entertainment',
    //     'News',
    //     'Sports',
    //     'DIY',
    //     'Relationships',
    //     'Parenting',
    //     'Education',
    //     'Social Media',
    //     'Gaming',
    //     'Music',
    //     'Culture',
    //     'Art',
    //     'Literature',
    //     'Environment',
    //     'Science',
    //     'History',
    //     'Politics',
    //     'Spirituality',
    // ],
};

module.exports = CONFIG;