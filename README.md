# jestlearn
## serverless website for interactive educational content
[![Netlify Status](https://api.netlify.com/api/v1/badges/4250a53b-cc48-482c-ae06-c07cbffd75f6/deploy-status)](https://app.netlify.com/sites/jestlearn/deploys)
Make multichoice/input problems with ease!

## How to use:
Edit `course_name` in `data.ts`, should be unique
Edit `data.ts` with problem sets and such and that's mostly it
If you want cloud syncing change the `website_sync_point` and self host the server. For now it's pointed at my server
If you want to support more languages, just replace prism.js and prism.css

## Legend:
✅ - for correct answer
❌ - for incorrect answer
⚠️ - for corrected incorrect answer
❓ - for unanswered

## Todo:
* Anki spaced alg.
* consider removing choice problem because all select problems are choice problems, but not all choice problems are select ones, maybe there's a way to limit the checkbox selection
* pure offline support
* Add more documentation, make it easier to set up a sync server, a video to show how to set it up
* GUI editor for problems? (too lazy atm, just edit js)
* Analytics page for teachers
* provide a way to add comments other than github comments?
* better device scaling support, use tachyons or something.. my css is terrible 

## Motivation:
< 1000 lines of code
I just want something super simple, fast, flexible(open source), and offline to make small educational exercise content. Google classroom and everything else is too bloat, not to mention I don't really care about grades. Instead of focusing on grades, focus on constant repitition, ergo Anki, because memory is fragile.

Mistranslated quote but emphasis on doing always rather than listening/watching
> What I hear, I forget; What I see, I remember; What I do, I understand. —Confucius, 551–479 BC
> What I cannot create I do not understand - Feynman
## Credits:
* Favicon provided by https://twemoji.twitter.com/
