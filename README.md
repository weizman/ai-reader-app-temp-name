# ai-reader-app-temp-name

superior bookmarking experience with ai (name is temporary)

## About

This is a 3 days project that integrates ChatGPT, Notion and Telegram to form a bookmarking application that:

* requires no installation client
  * leveraging Telegram instead
* requires no db
  * leveraging Notion instead
* saves no state
  * the user provides the auth key to communicate with their Notion
  * meaning, everytime the server resets, auth is required
 
## State

Everything here (including this README) is temporary, this is a quick poc that serves my personal needs.

If enough people would show interest, I'll make this a proper SaaS.

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
