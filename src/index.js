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

client.on('Ready', () => {
    console.log('The bot is ready.')
})

client.on('interactionCreate', async (message) => {
    if (message.isCommand()) {
        if (message.commandName === 'ping') {
            // Messagges Dissapear with ephemeral: true
            message.reply({ content: "Pong!", ephemeral: false })
        }

        if (message.commandName === 'reply') {
            const textReceived = message.options.getString('text')

            // Deferimos la respuesta para indicar que estamos procesando
            await message.deferReply({ ephemeral: true })

            // Enviamos el mensaje al canal
            await message.channel.send({ content: textReceived, ephemeral: false });

            // Elimina la respuesta pendiente si no quieres mostrarla
            await message.deleteReply()
        }
    }
})