const config = require('dotenv').config()
const { REST, Routes, SlashCommandBuilder } = require('discord.js')

// Info needed for slash commands
const botID = process.env.DISCORD_BOT
const serverID = process.env.DISCORD_SERVER
const botToken = process.env.DISCORD_TOKEN

const rest = new REST().setToken(botToken)
const slashRegister = async () => {
    try {
        console.log('Agregando todos los comandos de guild...')
        // to test change next line to:             Routes.applicationGuildCommands(botID, serverID)
        // to global config change next line to:    Routes.applicationCommands(botID)
        await rest.put(Routes.applicationGuildCommands(botID, serverID), {
            body: [
                // Ping
                new SlashCommandBuilder()
                    .setName('ping')
                    .setDescription('Reply with a Pong!'),

                // Reply
                new SlashCommandBuilder()
                    .setName('reply')
                    .setDescription('Repeat your sentence.')
                    .addStringOption(option => {
                        return option
                            .setName('text')
                            .setDescription('Say anything.')
                            .setRequired(true)
                    }),

                // Help
                new SlashCommandBuilder()
                    .setName('help')
                    .setDescription('Muestra los comandos disponibles.'),

                // Projects
                new SlashCommandBuilder()
                    .setName('projects')
                    .setDescription('Muestra la lista de proyectos.'),

                // addProject
                new SlashCommandBuilder()
                    .setName('addproject')
                    .setDescription('Agregar un nuevo proyecto.')
                    .addStringOption(x => {
                        return x
                            .setName('title')
                            .setDescription('Ingresa un titulo para el proyecto.')
                            .setRequired(true)
                    }),

                // removeProject
                new SlashCommandBuilder()
                    .setName('removeproject')
                    .setDescription('Elimina un proyecto')
                    .addNumberOption(option => {
                        return option
                            .setName('id')
                            .setDescription('Ingresa ID del proyecto.')
                            .setRequired(true)
                    }),

                // statusProject
                new SlashCommandBuilder()
                    .setName('statusproject')
                    .setDescription('Actualiza el estado del proyecto.')
                    .addNumberOption(option => {
                        return option
                            .setName('id')
                            .setDescription('Ingresa ID del proyecto')
                            .setRequired(true)
                    }),


            ]
        })
        console.log('Todos los comandos de guild agregados con éxito.')
    } catch (err) {
        console.error('Error al agregar los comandos de guild:', err)
    }
}

slashRegister()