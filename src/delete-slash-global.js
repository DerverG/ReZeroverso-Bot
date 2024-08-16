const config = require('dotenv').config()
const { REST, Routes } = require('discord.js')

// Info needed for slash commands
const botID = process.env.DISCORD_BOT
const botToken = process.env.DISCORD_TOKEN

const rest = new REST().setToken(botToken)

const deleteGlobalCommands = async () => {
    try {
        console.log('Eliminando todos los comandos globales...')

        await rest.put(Routes.applicationCommands(botID), { body: [] })

        console.log('Todos los comandos globales eliminados con éxito.')
    } catch (err) {
        console.error('Error al eliminar los comandos globales:', err)
    }
};

deleteGlobalCommands()
