const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const loadData = require('../data/dataLoader');
const { printTaskEmbed } = require('../data/tasks')

let page = 0; // Variable global para el seguimiento de la página

module.exports = {
    data: new SlashCommandBuilder()
        .setName('projects')
        .setDescription('Muestra la lista de proyectos.'),

    async execute(interaction) {
        const data = loadData();
        const projectsPerPage = 5;

        const getEmbed = (page) => {
            const start = page * projectsPerPage;
            const end = start + projectsPerPage;
            const limitedProjects = data.projects.slice(start, end);
            const nombres = limitedProjects.map(project => project.title).join('\n');
            const estados = limitedProjects.map(project => project.status).join('\n');

            return new EmbedBuilder()
                .setTitle('**Lista de Proyectos**')
                .setColor('#00ffff')
                .setImage('https://media.discordapp.net/attachments/1274664335485960232/1274666549269233755/banner_bot_discord.png?ex=66c3153b&is=66c1c3bb&hm=6e264c4ed8b655ca4017360d8208221ec0bd41f76070c6d55f691edf21887778&=&format=webp&quality=lossless')
                .setFooter({ text: `Página ${page + 1} de ${Math.ceil(data.projects.length / projectsPerPage)}` })
                .setFields(
                    { name: 'Nombre', value: nombres, inline: true },
                    { name: 'Estado', value: estados, inline: true }
                );
        };

        const getSelectMenu = (page) => {
            const start = page * projectsPerPage;
            const end = start + projectsPerPage;
            const limitedProjects = data.projects.slice(start, end);

            return new StringSelectMenuBuilder()
                .setCustomId('select_menu')
                .setPlaceholder('Seleccionar')
                .addOptions(
                    limitedProjects.map(project => ({
                        label: project.title,
                        value: project.id.toString(),
                    }))
                );
        };

        const updateButtons = (page) => {
            const totalPages = Math.ceil(data.projects.length / projectsPerPage);

            return [
                new ButtonBuilder()
                    .setCustomId('previous')
                    .setLabel('Previous')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('⬅️')
                    .setDisabled(page === 0),

                new ButtonBuilder()
                    .setCustomId('next')
                    .setLabel('Next')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('➡️')
                    .setDisabled(page >= totalPages - 1)
            ];
        };

        const embed = getEmbed(page);
        const selectMenu = getSelectMenu(page);

        const buttonRow = new ActionRowBuilder().addComponents(updateButtons(page));
        const selectMenuRow = new ActionRowBuilder().addComponents(selectMenu);

        // Enviar el embed con los botones y el menú desplegable
        await interaction.reply({ embeds: [embed], components: [selectMenuRow, buttonRow] });

        const filter = i => i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            if (i.customId === 'next') {
                page++;
            } else if (i.customId === 'previous') {
                page--;
            } else if (i.customId === 'update') {
                // Puedes agregar la lógica para el botón de actualización aquí
            } else if (i.customId === 'select_menu') {
                // Lógica para manejar la selección del menú desplegable
                const selectedId = i.values[0];
                const selectedProject = data.projects.find(project => project.id.toString() === selectedId);
                await i.update({ content: `Seleccionaste: ${selectedProject.title}`, components: [] });
                return;
            }

            // Actualizar el embed, los botones y el menú desplegable
            const updatedEmbed = getEmbed(page);
            const updatedSelectMenu = getSelectMenu(page);
            await i.update({ embeds: [updatedEmbed], components: [new ActionRowBuilder().addComponents(updatedSelectMenu), new ActionRowBuilder().addComponents(updateButtons(page))] });
        });

        collector.on('end', collected => {
            // Desactivar botones después de 60 segundos
            interaction.editReply({ components: [] });
        });
    },
};

exports.name = 'projects';
exports.description = 'Muestra la lista de proyectos';