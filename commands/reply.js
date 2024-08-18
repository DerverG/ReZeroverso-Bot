const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reply')
        .setDescription('Repite lo que dices.')
        .addStringOption(option =>
            option.setName('texto') // Nombre del argumento
                .setDescription('El texto que quieres que se repita')
                .setRequired(true)
        ),

    async execute(interaction) {
        const textReceived = interaction.options.getString('text')

        // Verificar si el texto recibido no está vacío
        if (!textReceived || !textReceived.trim()) {
            return await interaction.reply({ content: 'No puedes enviar un mensaje vacío.', ephemeral: true })
        }

        // Enviar el mensaje al canal
        await interaction.channel.send({ content: textReceived })

        // Deferimos la respuesta para indicar que estamos procesando
        await interaction.deferReply({ ephemeral: true })

        // Eliminar el mensaje de la interacción
        await interaction.deleteReply()
    },

    async run(client, message, args) {
        const textReceived = args.join(' ')

        if (!textReceived || !textReceived.trim()) {
            return message.channel.send({ content: 'Por favor, proporciona un texto para repetir' })
        }

        await message.delete()
        await message.channel.send({ content: textReceived })
    },
    
    name: 'reply',
    description: 'Repite lo que dices.',
}
