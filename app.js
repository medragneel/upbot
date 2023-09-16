require("dotenv").config()
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const bot = new TelegramBot(process.env.TM_TOKEN, { polling: true,pollingInterval: 1000 });

bot.on('message', (message) => {
    if (message.text) {
        const searchQuery = message.text.trim();
        axios.get(`https://api.themoviedb.org/3/search/multi?api_key=${process.env.API_KEY}&query=${searchQuery}`)
            .then(response => {
                const results = response.data.results;
                if (results.length > 0) {
                    results.map(res => {
                        const msg = `
                        id: ${res.id}  \t\t
                        name: ${res.title} \n
                        Desc: ${res.overview} \n
                        Type: ${res.media_type}\n
                        https://image.tmdb.org/t/p/w500/${res.poster_path}\n
                        `

                        if (res.media_type === "movie") {
                            const links = `
                            Links: \n
                            vidsrc:\n
                            https://vidsrc.to/embed/movie/${res.id}\n
                            SuperEmbed:\n
                            https://multiembed.mov/?video_id=${res.id}&tmdb=1 \n
                            seez.su \n
                            https://seez.su/movie/${res.id} \n
                            movie-web: \n
                            https://movie-web.app/search/movie/${searchQuery.replace(" ", "%20")} \n
                            smashystream: \n
                            https://embed.smashystream.com/playere.php?tmdb=${res.id} \n
                            `
                            bot.sendMessage(message.chat.id, msg + links)

                        } else if (res.media_type === "tv") {
                            const links = `
                            vidsrc:\n
                            https://vidsrc.to/embed/tv/${res.id} \n
                            SuperEmbed:\n
                            https://multiembed.mov/?video_id=${res.id}&tmdb=1&s=1&e=1 \n
                            seez.su \n
                            https://seez.su/tv/${res.id} \n
                            movie-web: \n
                            https://movie-web.app/search/series/${searchQuery.replace(" ", "%20")}
                            smashystream: \n
                             https://embed.smashystream.com/playere.php?tmdb=${res.id}&season=1&episode=1 \n
                            `
                            bot.sendMessage(message.chat.id, msg + links)


                        } else {
                            bot.sendMessage(message.chat.id, 'not found movie or tv show')

                        }
                    })

                } else {
                    bot.sendMessage(message.chat.id, 'No movies found');
                }
            })
            .catch(error => {
                console.error(error);
                bot.sendMessage(message.chat.id, 'Error searching for movie');
            });
    }
});
