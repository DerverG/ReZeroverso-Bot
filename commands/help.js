const { EmbedBuilder } = require('discord.js')

const prefix = '!'

exports.run = (client, message, args) => {
    const embed = new EmbedBuilder()
        .setTitle('Lista de Comandos')
        .setFooter({ text: 'My prefix is !' })

    client.commands.forEach(command => {
        embed.addFields({ name: `**${prefix}${command.name}**`, value: command.description || 'Sin descripción' })
    })

    message.channel.send({ embeds: [embed] })
}

exports.name = 'help'
exports.description = 'Muestra los comandos disponibles.'