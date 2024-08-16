const {Client, GatewayIntentBits, Partials, Collection} = require('discord.js')
const config = require('dotenv').config()
const token = process.env.DISCORD_TOKEN

const client = new Client ({
    intents: [GatewayIntentBits.Guilds, Object.keys(GatewayIntentBits)],
    partials: [Object.keys(Partials)],
})

client.login(token).then((result) => {
    console.log(`El Bot: ${client.user.tag} esta conectado.`)
}).catch((err) => {
    console.log('Ocurrio un error al encender el bot.')
    console.error(err)
})