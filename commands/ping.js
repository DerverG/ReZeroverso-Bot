const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    // Configuracion del Slash Command
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Responde con un Pong!'),
    
    // Ejecución para Slash Command
    async execute(interaction) {
        await interaction.reply('Pong!')
    },

    // Ejecución para el comando de texto tradicional
    run(client, message, args) {
        message.channel.send('Pong!')
    },
    
    name: 'ping',
    description: 'Responde con un Pong!',
}

exports.name = 'ping'
exports.description = 'Responde con un Pong!'