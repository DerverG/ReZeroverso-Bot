// tasks.js
const { EmbedBuilder } = require('discord.js');

function printTaskEmbed(interaction, taskId) {
    // Aquí generas el embed que quieres enviar
    const embed = new EmbedBuilder()
        .setTitle('Tarea Seleccionada')
        .setDescription(`Detalles de la tarea con ID: ${taskId}`)
        .setColor('#ff0000');

    // Enviar el embed al canal donde se ejecutó el comando
    interaction.reply({ embeds: [embed] });
}

module.exports = {
    printTaskEmbed
};
