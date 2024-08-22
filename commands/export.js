const { SlashCommandBuilder } = require('discord.js')
const path = require('path')
const fs = require('fs')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('export')
        .setDescription('Exporta los datos en un archivo .json'),

    async execute(interaction) {
        const filePath = path.join(__dirname, '../data/data.json')

        try {
            // Verifica si el archivo existe
            if (fs.existsSync(filePath)) {
                await interaction.reply({
                    content: 'Aquí está el archivo data.json:',
                    files: [filePath]
                })
            } else {
                await interaction.reply({
                    content: 'El archivo data.json no se encontró.',
                    ephemeral: true
                })
            }
        } catch (err) {
            console.error('Error al enviar el archivo:', err)
            await interaction.reply({
                content: 'Ocurrió un error al intentar enviar el archivo.',
                ephemeral: true
            })
        }
    }
}
