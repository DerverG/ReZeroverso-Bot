const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const loadData = require('../data/dataLoader')

// Leer proyectos.json para sacar la informacion:


module.exports = {
    // Configuracion del Slash Command
    data: new SlashCommandBuilder()
        .setName('projects')
        .setDescription('Muestra la lista de proyectos.'),

    async execute(interaction) {
        const data = loadData()
        // Limitar a un máximo de 5 proyectos
        const limitedProjects = data.projects.slice(0, 5);

        // Concatenar los nombres y estados en cadenas de texto
        const nombres = limitedProjects.map(project => project.title).join('\n');
        const estados = limitedProjects.map(project => project.status).join('\n');

        const embed = new EmbedBuilder()
            .setTitle('**Lista de Proyectos**')
            .setColor('#00ffff')
            .setImage('https://media.discordapp.net/attachments/1274664335485960232/1274666549269233755/banner_bot_discord.png?ex=66c3153b&is=66c1c3bb&hm=6e264c4ed8b655ca4017360d8208221ec0bd41f76070c6d55f691edf21887778&=&format=webp&quality=lossless')
            .setFooter({ text: `Página 1 de ${Math.ceil(data.projects.length / 5)}` }) // Calcular paginas
            .setFields(
                { name: 'Nombre', value: nombres, inline: true },
                { name: 'Estado', value: estados, inline: true }
            )

        // Crear Botones
        const previous = new ButtonBuilder()
            .setCustomId('previous')
            //.setLabel('')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('⬅️')

        const next = new ButtonBuilder()
            .setCustomId('next')
            //.setLabel('')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('➡️')

        const update = new ButtonBuilder()
            .setCustomId('update')
            .setLabel('Modificar')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('🔄')

        // Menu Desplegable - MAXIMO 5 por Pagina
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
                },
                {
                    label: 'opcion 3',
                    value: 'opcion 3',
                },
                {
                    label: 'opcion 4',
                    value: 'opcion 4',
                },
                {
                    label: 'opcion 5',
                    value: 'opcion 5',
                }
            ])

        // Crear la fila de acción para incluir el menú desplegable
        const selectMenuRow = new ActionRowBuilder().addComponents(selectMenu)
        const buttonRow = new ActionRowBuilder().addComponents(previous, next, update)

        // Enviar el embed con el menú desplegable
        await interaction.reply({ embeds: [embed], components: [selectMenuRow, buttonRow] })
    },

    name: 'projects',
    description: 'Muestra la lista de proyectos.',
}

exports.name = 'projects'
exports.description = 'Muestra la lista de proyectos'