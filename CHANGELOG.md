# 0.6.1
- Critical Fix bug where problems would not generate at all
+ Fixed semantic versioning

# 0.0.6
- Switched to giscus using github discussion feature instead of issues(turns out utterances doesn't work at all due to re-direct)
- Using giscus to store and review student submissions for now
- TODO: when github discussions introduce templates, use those to force correct submission structure
- Added code submission/discussion problems

# 0.0.5
- Now titles are used for comparisons rather than ids since ids are hard to make unique and are tied to section-ids(maybe crc32 the titles for uids)
- Prevent re-doing of problems that are already marked correct when the user did not click "Next" to proceed.
- Added clear cache button
- Added show answer button
- Added cloudflare analytics
- Input answers are now space insensitive
- Input answer hints now can take html
- Breaking ProblemSet constructor because search tags are kinda optional and should be last
# 0.0.4
- Fixed TOC not updating
- Merged back other deleted props rather than just .gen()
- Page no longer refreshes after logging in
- Added support for hitting enter key to proceed for InputProblems
- No longer using + - ! ? , all emoji now
# 0.0.3
- No longer saving problems that have not been worked on in localstorage
- Fixed diffing algorithim to merge ones that dont exist along with getting rid of duplicates
- Fixed issues with the discussions page for single domain courses
- Added hover effect to select answers
- Added async support to fetch problems from an api and an example on how to do so
- Removed num of problems from the problem set in favor closures that hold that privately since it was not used anywhere else
- Fixed input problems not supporting syntax highlighting