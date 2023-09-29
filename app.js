const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
require("dotenv").config()

const bot = new TelegramBot(process.env.TM_TOKEN, {
    polling: {
        interval:1000,
        autoStart:true,
        params:{
            timeout: 10 ,
            log: true
        }
    }
});

bot.on('message', async (message) => {
    if (message.text) {
        const searchQuery = message.text.trim();
        await axios.get(`https://api.themoviedb.org/3/search/multi?api_key=${process.env.API_KEY}&query=${searchQuery}`)
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
                        if (res.media_type === "movie" || res.media_type === "tv") {
                            const links = `
                            Links: \n
                            vidsrc:\n
                            https://vidsrc.to/embed/${res.media_type}/${res.id}\n
                            SuperEmbed:\n
                            https://multiembed.com/?video_id=${res.id}&tmdb=1 \n
                            seez.su \n
                            https://seez.su/${res.media_type}/${res.id} \n
                            movie-web: \n
                            https://movie-web.app/search/${res.media_type === "tv" ? "series" : res.media_type }/${searchQuery.replace(" ", "%20")}
                            `
                            return bot.sendMessage(message.chat.id, msg + links);
                        } else {
                            return bot.sendMessage(message.chat.id, 'Not found movie or tv show');
                        }
                    })
                } else {
                    return bot.sendMessage(message.chat.id, 'No movies found');
                }
            })
            .catch(error => {
                console.error(error);
                return bot.sendMessage(message.chat.id, 'Error searching for movie');
            });
    }
});
