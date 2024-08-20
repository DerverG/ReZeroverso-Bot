const { EmbedBuilder } = require('discord.js');

async function printTaskEmbed(interaction, title) {
    const embed = new EmbedBuilder()
        .setTitle(title)
        .setColor('#00ffff')
        .setDescription('Este es un embed con el título basado en el número seleccionado.');

    await interaction.reply({ embeds: [embed], ephemeral: false });
}

module.exports = { printTaskEmbed };
