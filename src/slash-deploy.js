const config = require('dotenv').config()
const {REST, Routes, SlashCommandBuilder} = require('discord.js')

// Info needed for slash commands
const botID = process.env.DISCORD_BOT
const serverID = process.env.DISCORD_SERVER
const botToken = process.env.DISCORD_TOKEN

const rest = new REST().setToken(botToken)
const slashRegister = async () => {
    try {
        // to test change next line to:             Routes.applicationGuildCommands(botID, serverID)
        // to global config change next line to:    Routes.applicationCommands(botID)
        await rest.put(Routes.applicationGuildCommands(botID, serverID), {
            body: [
                new SlashCommandBuilder()
                    .setName('ping')
                    .setDescription('Reply with a Pong!'),

                new SlashCommandBuilder()
                    .setName('reply')
                    .setDescription('Repeat your sentence.')
                    .addStringOption(option => {
                        return option
                        .setName('text')
                        .setDescription('Say anything.')
                        .setRequired(true)
                    })
                    
            ]
        })
    } catch (err) {
        console.error(err)
    }
}

slashRegister();