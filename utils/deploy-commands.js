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
                    .setDescription('Administracion de proyectos.')
                    .addSubcommand(subcommand => {
                        return subcommand
                            .setName('view')
                            .setDescription('Ver lista de proyectos.')
                    })
                    .addSubcommand(subcommand => {
                        return subcommand
                            .setName('add')
                            .setDescription('Agregar un proyecto.')
                            .addStringOption(option => {
                                return option
                                    .setName('title')
                                    .setDescription('Ingresa el titulo del proyecto.')
                                    .setRequired(true)
                            })
                    })
                    .addSubcommand(subcommand => {
                        return subcommand
                            .setName('remove')
                            .setDescription('Elimina un proyecto.')
                            .addIntegerOption(option => {
                                return option
                                    .setName('id')
                                    .setDescription('Ingrese un ID de un proyecto.')
                                    .setRequired(true)
                            })
                    })
                    .addSubcommand(subcommand => {
                        return subcommand
                            .setName('update')
                            .setDescription('Actualiza el estado de un proyecto')
                            .addIntegerOption(option => {
                                return option
                                    .setName('id')
                                    .setDescription('Ingrese un ID de un proyecto.')
                                    .setRequired(true)
                            })
                    // Añadira un selector para el estado.
                    }),

                // Tasks
                new SlashCommandBuilder()
                    .setName('tasks')
                    .setDescription('Administracion de Tareas')
                    .addSubcommand(subcommand => {
                        return subcommand
                        .setName('add')
                        .setDescription('Agregar una tarea.')
                        .addIntegerOption(option => {
                            return option
                                .setName('idproject')
                                .setDescription('Ingresa un ID de un proyecto')
                                .setRequired(true)
                        })
                        .addStringOption(option => {
                            return option
                                .setName('title')
                                .setDescription('Ingresa el titulo de la tarea.')
                                .setRequired(true)
                        })
                    })
                    .addSubcommand(subcommand => {
                        return subcommand
                            .setName('remove')
                            .setDescription('Elimina una tarea.')
                            .addIntegerOption(option => {
                                return option
                                    .setName('idproject')
                                    .setDescription('Ingresa un ID de un proyecto')
                                    .setRequired(true)
                            })
                            .addIntegerOption(option => {
                                return option
                                    .setName('idtask')
                                    .setDescription('Ingrese un ID de una tarea.')
                                    .setRequired(true)
                            })
                    })
                    .addSubcommand(subcommand => {
                        return subcommand
                            .setName('update')
                            .setDescription('Actualiza el estado de una tarea.')
                            .addIntegerOption(option => {
                                return option
                                    .setName('idproject')
                                    .setDescription('Ingresa un ID de un proyecto.')
                                    .setRequired(true)
                            })
                            .addIntegerOption(option => {
                                return option
                                    .setName('idtask')
                                    .setDescription('Ingrese un ID de una tarea.')
                                    .setRequired(true)
                            })
                            // Añadira un selector para el estado.
                        })
                    .addSubcommand(subcommand => {
                        return subcommand
                            .setName('responsible')
                            .setDescription('Asigna a un encargado de la tarea')
                            .addIntegerOption(option => {
                                return option
                                    .setName('idproject')
                                    .setDescription('Ingresa un ID de un proyecto.')
                                    .setRequired(true)
                            })
                            .addIntegerOption(option => {
                                return option
                                    .setName('idtask')
                                    .setDescription('Ingrese un ID de una tarea.')
                                    .setRequired(true)
                            })
                            .addUserOption(user => {
                                return user
                                    .setName('user')
                                    .setDescription('Ingrese el usuario a cargo.')
                                    .setRequired(true)
                            })
                    })
                    
            ]
        })
        console.log('Todos los comandos de guild agregados con éxito.')
    } catch (err) {
        console.error('Error al agregar los comandos de guild:', err)
    }
}

slashRegister()