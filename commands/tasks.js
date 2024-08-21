const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const loadData = require('../data/dataLoader')
const writeData = require('../data/dataWriter')

async function printTaskEmbed(interaction, idProject, titlepProject) {
    const embed = new EmbedBuilder()
        .setTitle(`ID: ${idProject} | ${titlepProject}`)
        .setColor('#00ffff')
        .setDescription('Este es un embed con el título basado en el número seleccionado.');

    await interaction.reply({ embeds: [embed], ephemeral: false });
}

module.exports = { printTaskEmbed };
