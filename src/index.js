const {Client, GatewayIntentBits, Partials, Collection} = require('discord.js')
const config = require('dotenv').config()
const token = process.env.DISCORD_TOKEN
const path = require('path')
const fs = require('fs')
const prefix = '!'

const allowedRoleId = '1273142126217003008';

// Cliente de Discord.js
const client = new Client ({
    intents: [GatewayIntentBits.Guilds, Object.keys(GatewayIntentBits)],
    partials: [Object.keys(Partials)],
})

// Read Commands
client.commands = new Collection()
const commandsPath = path.join(__dirname, '../commands') // Ruta correcta a la carpeta commands
const commands = fs.readdirSync(commandsPath).filter(file => file.endsWith('js'))
for(file of commands) {
    const commandName = file.split('.')[0]
    const command = require(`./../commands/${commandName}`)
    client.commands.set(commandName, command)
}

console.log('Comandos cargados:', client.commands.keys())

client.login(token).then((result) => {
    console.log(`El Bot: ${client.user.tag} esta conectado.`)
}).catch((err) => {
    console.log('Ocurrio un error al encender el bot.')
    console.error(err)
})

client.on('ready', () => {
    console.log('The bot is ready.')
})

// Slash Commands - Command Handler
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return
    if (!interaction.member.roles.cache.has(allowedRoleId)) return // Limitar uso a un Rol


    const command = client.commands.get(interaction.commandName)

    if (!command) {
        return interaction.reply({ content: 'Comando no encontrado.', ephemeral: true })
    }

    try {
        await command.execute(interaction)
    } catch (error) {
        console.error(error)
        await interaction.reply({ content: 'Hubo un error al ejecutar el comando.', ephemeral: true })
    }
})

// Text Commands - Command Handler
client.on('messageCreate', message => {
    if (message.author.bot) return // Ignora mensajes de otros bots
    if (!message.content.startsWith(prefix)) return // Ignora mensajes que no comiencen con el prefijo
    if (!message.member.roles.cache.has(allowedRoleId)) return // Limitar uso a un Rol

    const args = message.content.slice(prefix.length).trim().split(/ +/)
    const commandName = args.shift().toLowerCase()
    const command = client.commands.get(commandName)

    if (!command) return message.channel.send({ content: 'No existe ese comando' })

    try {
        command.run(client, message, args)
    } catch (error) {
        console.error(error)
        message.channel.send({ content: 'Hubo un error al ejecutar el comando.' })
    }
})

// Manage Interactions
client.on('interactionCreate', async interaction => {
    if (!interaction.isStringSelectMenu()) return // Verificar que la interacción es de tipo select menu
    if (!interaction.member.roles.cache.has(allowedRoleId)) return // Limitar uso a un Rol


    if (interaction.customId === 'select_menu') {
        // Obtener el valor seleccionado
        const selectedOption = interaction.values[0]

        // Enviar una respuesta basada en la opción seleccionada
        await interaction.update({ content: `Has seleccionado: ${selectedOption}`, components: [] })
    }
})
