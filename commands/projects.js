const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const loadData = require('../data/dataLoader')
const writeData = require('../data/dataWriter')

let page = 0 // Variable global para el seguimiento de la página
const allowedRoleId = '1273142126217003008'
let currentCollector = null

module.exports = {
    data: new SlashCommandBuilder()
        .setName('projects')
        .setDescription('Administracion de proyectos.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('view')
                .setDescription('Ver lista de proyectos.')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Añadir un nuevo proyecto.')
                .addStringOption(option =>
                    option
                        .setName('title')
                        .setDescription('Título del proyecto')
                        .setRequired(true))
        ),

    async execute(interaction) {
        const command = interaction.options.getSubcommand()
        const data = loadData()

        if (!interaction.member.roles.cache.has(allowedRoleId)) return

        // Si existe un recolector anterior, detenerlo antes de crear uno nuevo
        if (currentCollector) {
            currentCollector.stop()
        }

        switch (command) {
            case 'view':
                page = 0
                const projectsPerPage = 5

                const getEmbed = (page) => {
                    const start = page * projectsPerPage
                    const end = start + projectsPerPage
                    const limitedProjects = data.projects.slice(start, end)
                    const IDs = limitedProjects.map(project => project.id).join('\n')
                    const nombres = limitedProjects.map(project => project.title).join('\n')
                    const estados = limitedProjects.map(project => project.status).join('\n')

                    return new EmbedBuilder()
                        .setTitle('**Lista de Proyectos**')
                        .setColor('#00ffff')
                        .setImage('https://media.discordapp.net/attachments/1274664335485960232/1274666549269233755/banner_bot_discord.png?ex=66c3153b&is=66c1c3bb&hm=6e264c4ed8b655ca4017360d8208221ec0bd41f76070c6d55f691edf21887778&=&format=webp&quality=lossless')
                        .setFooter({ text: `Página ${page + 1} de ${Math.ceil(data.projects.length / projectsPerPage)}` })
                        .setFields(
                            { name: 'ID', value: IDs, inline: true },
                            { name: 'Nombre', value: nombres, inline: true },
                            { name: 'Estado', value: estados, inline: true }
                        )
                }

                const getSelectMenu = (page) => {
                    const start = page * projectsPerPage
                    const end = start + projectsPerPage
                    const limitedProjects = data.projects.slice(start, end)

                    return new StringSelectMenuBuilder()
                        .setCustomId('select_menu')
                        .setPlaceholder('Seleccionar proyecto')
                        .addOptions(
                            limitedProjects.map(project => ({
                                label: project.title,
                                value: project.id.toString(),
                            }))
                        )
                }

                const updateButtons = (page) => {
                    const totalPages = Math.ceil(data.projects.length / projectsPerPage)

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
                    ]
                }

                const embed = getEmbed(page)
                const selectMenu = getSelectMenu(page)

                const buttonRow = new ActionRowBuilder().addComponents(updateButtons(page))
                const selectMenuRow = new ActionRowBuilder().addComponents(selectMenu)

                // Enviar el embed con los botones y el menú desplegable
                await interaction.reply({ embeds: [embed], components: [selectMenuRow, buttonRow] })

                const filter = i => i.user.id === interaction.user.id
                const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 })
                currentCollector = collector

                collector.on('collect', async i => {
                    try {
                        // Asegúrate de que la interacción sea válida
                        if (!i.isButton() && !i.isStringSelectMenu()) return

                        // Manejar interacciones de botones
                        if (i.isButton()) {
                            if (i.customId === 'next') {
                                page++
                            } else if (i.customId === 'previous') {
                                page--
                            }

                            // Actualizar el embed, el menú desplegable y los botones
                            const updatedEmbed = getEmbed(page)
                            const updatedSelectMenu = getSelectMenu(page)
                            const updatedButtons = updateButtons(page)

                            await i.update({
                                embeds: [updatedEmbed],
                                components: [
                                    new ActionRowBuilder().addComponents(updatedSelectMenu),
                                    new ActionRowBuilder().addComponents(updatedButtons)
                                ]
                            })
                        }

                        // Manejar interacciones de select menu
                        if (i.isStringSelectMenu() && i.customId === 'select_menu') {
                            const selectedId = i.values[0]
                            const selectedProject = data.projects.find(project => project.id.toString() === selectedId)

                            // Aquí puedes manejar lo que sucede al seleccionar un proyecto
                        }
                    } catch (error) {
                        console.error('Error al manejar la interacción:', error)
                        await i.reply({ content: 'Ocurrió un error al procesar tu interacción.', ephemeral: true })
                    }
                })
                collector.on('end', collected => {
                    // Desactivar botones después de 60 segundos
                    interaction.editReply({ components: [] })
                })
                break
            case 'add':
                const title = interaction.options.getString('title')
                const newID = Math.max(...data.projects.map(project => project.id)) + 1

                // Nuevo proyecto
                const newProject = {
                    id: newID,
                    title: title,
                    status: 'Pendiente' // default
                }

                // Agregar al JSON
                data.projects.push(newProject)
                
                // Guardar cambios
                writeData(data)

                await interaction.reply({ content: `ID: ${newID} Titulo: ${title} Guardado correctamente.`, ephemeral: true })
                break
            case 'remove':
                
                break
            case 'update':

                break

        }
    },
}

exports.name = 'projects'
exports.description = 'Administracion de proyectos.'
