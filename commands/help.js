const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const prefix = '!'

module.exports = {
    // Configuración del Slash Command
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Muestra los comandos disponibles.'),
    
    // Ejecución para Slash Command
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('Lista de Comandos')
            .setColor('#00FF00')
            .setFooter({ text: `Mi prefijo es ${prefix}` })

        // Lista de Comandos
        interaction.client.commands.forEach(command => {
            embed.addFields({ name: `**/${command.data.name}**`, value: command.description || 'Sin descripción' })
        })

        await interaction.reply({ embeds: [embed] })
    },

    // Ejecución para el comando de texto tradicional
    run(client, message, args) {
        const embed = new EmbedBuilder()
            .setTitle('Lista de Comandos')
            .setColor('#00FF00')
            .setFooter({ text: `Mi prefijo es ${prefix}` })

        // Lista de Comandos
        client.commands.forEach(command => {
            embed.addFields({ name: `**${prefix}${command.name}**`, value: command.description || 'Sin descripción' })
        })

        message.channel.send({ embeds: [embed] })
    },
    
    name: 'help',
    description: 'Muestra los comandos disponibles.',
}

exports.name = 'help'
exports.description = 'Muestra los comandos disponibles.'