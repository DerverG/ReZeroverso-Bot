const {Client, GatewayIntentBits, Partials, Collection} = require('discord.js')
const config = require('dotenv').config()
const token = process.env.DISCORD_TOKEN
const path = require('path')
const fs = require('fs')
const prefix = '!'

const client = new Client ({
    intents: [GatewayIntentBits.Guilds, Object.keys(GatewayIntentBits)],
    partials: [Object.keys(Partials)],
})

// Command Handler
client.commands = new Collection()
const commandsPath = path.join(__dirname, '../commands') // Ruta correcta a la carpeta commands
const commands = fs.readdirSync(commandsPath).filter(file => file.endsWith('js'))
for(file of commands) {
    const commandName = file.split('.')[0]
    const command = require(`./../commands/${commandName}`)
    client.commands.set(commandName, command)
}

client.login(token).then((result) => {
    console.log(`El Bot: ${client.user.tag} esta conectado.`)
}).catch((err) => {
    console.log('Ocurrio un error al encender el bot.')
    console.error(err)
})

client.on('ready', () => {
    console.log('The bot is ready.')
})

// Slash Commands
client.on('interactionCreate', async (message) => {
    if (message.isCommand()) {
        if (message.commandName === 'ping') {
            // Messagges Dissapear with ephemeral: true
            message.reply({ content: "Pong!", ephemeral: false })
        }

        if (message.commandName === 'reply') {
            const textReceived = message.options.getString('text')

            // Deferimos la respuesta para indicar que estamos procesando
            await message.deferReply({ ephemeral: true });

            // Enviamos el mensaje al canal
            await message.channel.send({ content: textReceived, ephemeral: false });

            // Elimina la respuesta pendiente si no quieres mostrarla
            await message.deleteReply();
        }
    }
})

console.log('Comandos cargados:', client.commands.keys())


// Commands Handler
client.on('messageCreate', message => {
    if (message.author.bot) return // Ignora mensajes de otros bots
    if (!message.content.startsWith(prefix)) return // Ignora mensajes que no comiencen con el prefijo

    const args = message.content.slice(prefix.length).trim().split(/ +/g)
    const commandName = args.shift().toLowerCase()
    const command = client.commands.get(commandName)

    if (!command) return message.channel.send({ content: 'No existe ese comando' })
    
    try {
        command.run(client, message, args)
    } catch (error) {
        console.error(error)
        message.channel.send({ content: 'Hubo un error al ejecutar el comando' })
    }
})