const config = require('dotenv').config()
const { REST, Routes } = require('discord.js')

// Info needed for slash commands
const botID = process.env.DISCORD_BOT
const serverID = process.env.DISCORD_SERVER
const botToken = process.env.DISCORD_TOKEN

const rest = new REST().setToken(botToken)

const deleteGuildCommands = async () => {
    try {
        console.log('Eliminando todos los comandos de guild...')

        await rest.put(Routes.applicationGuildCommands(botID, serverID), { body: [] })

        console.log('Todos los comandos de guild eliminados con éxito.')
    } catch (err) {
        console.error('Error al eliminar los comandos de guild:', err)
    }
}

deleteGuildCommands()