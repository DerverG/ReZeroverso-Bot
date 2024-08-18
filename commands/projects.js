const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder  } =  require('discord.js')

module.exports = {
    // Configuracion del Slash Command
    data: new SlashCommandBuilder()
        .setName('projects')
        .setDescription('Muestra la lista de projectos.'),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('**Proyectos**')
            .setDescription('Proyecto 1\nProyecto 2') // Mostrar Proyectos
            .setColor('#00ffff')

        // Menu Desplegable
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('select_menu')
            .setPlaceholder('Seleccionar')
            .setOptions([
                {
                    label: 'opcion 1',
                    value: 'opcion 1',
                },
                {
                    label: 'opcion 2',
                    value: 'opcion 2',
                }
            ])

            // Crear la fila de acción para incluir el menú desplegable
            const row = new ActionRowBuilder().addComponents(selectMenu)

            // Enviar el embed con el menú desplegable
            await interaction.reply({ embeds: [embed], components: [row] })
    },

    name: 'projects',
    description: 'Muestra la lista de projectos.',
}