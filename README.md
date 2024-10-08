# ai-reader-app-temp-name

superior bookmarking experience with ai (name is temporary)

## About

This is a 3 days project that integrates ChatGPT, Notion and Telegram to form a bookmarks management application that:

* requires no installation of client software
  * leveraging Telegram instead
* requires no database
  * leveraging Notion instead
* saves no state
  * the user provides the auth key to communicate with their Notion
  * meaning, everytime the server resets, auth is required

that lets you do this one simple thing that's for some reason isn't solved yet: **manage your damn bookmarks**

All it does is receive links from you accompanied with a 1 to 5 ranking of importance, and it does the rest, which is to tag and store it.

Afterwords, you can ask it to pop a link for you to read, based on the category it was tagged with, ordered by the ranking you gave it originally.

After you're done reading, you mark it as read, so the next link that's popped is the next on the list.
 
## State

Everything here (including this README) is temporary, this is a quick poc that serves my personal needs.

If enough people would show interest, I'll make this a proper SaaS.

Until then, this is VERY EXPERIMENTAL.

Meaning, at its current state, there's no guarantee against security concerns, it can be probably DoSed pretty easily, but aside for security, it has many other issues as well:

* _"Does this work with something that isn't Telegram Web or iOS?"_ - Who knows? Surely, I don't
* _"Would this potentially throw and crash on stupid things such as getting an unexpected response from ChatGPT?"_ Yes Sir!
* _"Is the user journey excellent?"_ - No. _"But is it at least good?"_ - Nope
* _"Does it work?"_ - Umm.. kinda?
* _"Don't you care?"_ - Are you paying me?

Do you want to see these answers flip? Let me know @ [SaaS this please!](https://github.com/weizman/ai-reader-app-temp-name/issues/1)

## Deploy

This used to be deployed on fly.io, but since then they ask for credit card info, and since I wasn't able to find another service that's willing to serve my app for free given its very small cpu consumption, I am currently avoiding deploying this software anywhere.

However, thanks to Telegram's awesome infra, running this locally is very easy and does the job just as well.

## Develop

The code just puts stuff together, basically just:

1. `yarn`
2. `cp .env_template .env`
3. configure all required fields within `.env`
4. `yarn start-env`

While this seems rather straightforward, step 3 isn't simple at all, because it requires you to:

* setup a notion application
* create a notion template
* create a telegram bot
* generate an open-ai api key
* put them all together

I'll SaaS this for you if enough people are into this
