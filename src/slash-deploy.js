const config = require('dotenv').config()
const {REST, Routes} = require('discord.js')

// Info needed for slash commands
const botID = process.env.DISCORD_BOT
const serverID = process.env.DISCORD_SERVER
const botToken = process.env.DISCORD_TOKEN

const rest = new REST().setToken(botToken)
const slashRegister = async () => {
    try {
        // to test change next line to: Routes.applicationGuildCommands(botID, serverID)
        await rest.put(Routes.applicationCommands(botID), {
            body: [
                {
                    name: "ping",
                    description: "Reply with a Pong! v2"
                }
            ]
        })
    } catch (err) {
        console.error(err)
    }
}

slashRegister();