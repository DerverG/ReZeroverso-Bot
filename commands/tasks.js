const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const loadData = require('../data/dataLoader')
const writeData = require('../data/dataWriter')

const allowedRoleId = '1273142126217003008'

// Función para imprimir el embed de la tarea
async function printTaskEmbed(interaction, idProject, titleProject) {
    const data = loadData() // Carga los datos desde tu archivo de datos

    // Encuentra el proyecto con el ID proporcionado
    const project = data.projects.find(p => p.id === idProject)
    if (!project) {
        await interaction.reply({ content: 'Proyecto no encontrado.', ephemeral: true })
        return
    }

    // Obtener las tareas asociadas al proyecto
    const tasks = project.tasks || []
    if (tasks.length === 0) {
        await interaction.reply({ content: 'No hay tareas para este proyecto.', ephemeral: true })
        return
    }

    // Crear el contenido del embed
    const taskTitles = tasks.map(task => `${task.id}: ${task.title}`).join('\n')
    const responsible = tasks.map(task => task.responsible ? `<@${task.responsible}>` : 'No asignado').join('\n')
    const statuses = tasks.map(task => task.status).join('\n')

    const embed = new EmbedBuilder()
        .setTitle(`**${idProject}: ${titleProject} | Tareas**`)
        .setColor('#00ffff')
        .setImage('https://media.discordapp.net/attachments/1274664335485960232/1275620688644014191/banner_bot_discord.png?ex=66c68dd8&is=66c53c58&hm=8e68cf691b0469fb948025a78add5740489e0e4e6091755e457f9945136160b6&=&format=webp&quality=lossless')
        .setFields(
            { name: '[ID]: Tareas', value: taskTitles, inline: true },
            { name: 'Responsable', value: responsible, inline: true },
            { name: 'Estado', value: statuses, inline: true }
        )

    await interaction.reply({ embeds: [embed], ephemeral: false })
}

module.exports = {
    printTaskEmbed, // Asegúrate de exportar la función
    data: new SlashCommandBuilder()
        .setName('tasks')
        .setDescription('Administración de Tareas')
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Agregar una tarea.')
                .addIntegerOption(option =>
                    option
                        .setName('idproject')
                        .setDescription('Ingresa un ID de un proyecto')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName('title')
                        .setDescription('Ingresa el título de la tarea.')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Elimina una tarea.')
                .addIntegerOption(option =>
                    option
                        .setName('idproject')
                        .setDescription('Ingresa un ID de un proyecto')
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option
                        .setName('idtask')
                        .setDescription('Ingrese un ID de una tarea.')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('update')
                .setDescription('Actualiza el estado de una tarea.')
                .addIntegerOption(option =>
                    option
                        .setName('idproject')
                        .setDescription('Ingresa un ID de un proyecto.')
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option
                        .setName('idtask')
                        .setDescription('Ingrese un ID de una tarea.')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName('status')
                        .setDescription('Seleccione el nuevo estado de la tarea.')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Pendiente', value: 'Pendiente' },
                            { name: 'En Progreso', value: 'En Progreso' },
                            { name: 'Completada', value: 'Completada' }
                        )
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('responsible')
                .setDescription('Asignar un responsable a una tarea.')
                .addIntegerOption(option =>
                    option
                        .setName('idproject')
                        .setDescription('Ingresa un ID de un proyecto.')
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option
                        .setName('idtask')
                        .setDescription('Ingrese un ID de una tarea.')
                        .setRequired(true)
                )
                .addUserOption(option =>
                    option
                        .setName('user')
                        .setDescription('Seleccione el usuario responsable.')
                        .setRequired(true)
                )
        ),

    async execute(interaction) {
        const command = interaction.options.getSubcommand()
        let data = loadData()

        switch (command) {
            case 'add':
                if (!interaction.member.roles.cache.has(allowedRoleId)) {
                    await interaction.reply({ content: 'No tienes permiso para usar este comando.', ephemeral: true });
                    return;
                }
                const project_id = interaction.options.getInteger('idproject')
                const taskTitle = interaction.options.getString('title')
                const project = data.projects.find(p => p.id === project_id)

                if (!project) {
                    await interaction.reply({ content: 'Proyecto no encontrado.', ephemeral: true });
                    return;
                }

                const newTaskID = Math.max(...(project.tasks.map(task => task.id) || []), 0) + 1

                const newTask = {
                    id: newTaskID,
                    title: taskTitle,
                    status: 'Pendiente' // default
                }

                if (!project.tasks) project.tasks = []
                project.tasks.push(newTask)
                writeData(data)

                await interaction.reply({ content: `Tarea añadida con ID: ${newTaskID}`, ephemeral: true })
                break

            case 'remove':
                if (!interaction.member.roles.cache.has(allowedRoleId)) {
                    await interaction.reply({ content: 'No tienes permiso para usar este comando.', ephemeral: true });
                    return;
                }
                const projectIDToRemove = interaction.options.getInteger('idproject')
                const taskIDToRemove = interaction.options.getInteger('idtask')

                const projectToRemoveFrom = data.projects.find(p => p.id === projectIDToRemove)
                if (!projectToRemoveFrom || !projectToRemoveFrom.tasks) {
                    await interaction.reply({ content: 'No se encontró el proyecto o no tiene tareas.', ephemeral: true });
                    return;
                }

                const taskIndex = projectToRemoveFrom.tasks.findIndex(task => task.id === taskIDToRemove)

                if (taskIndex !== -1) {
                    const removedTask = projectToRemoveFrom.tasks.splice(taskIndex, 1)[0]
                    writeData(data)

                    await interaction.reply({ content: `Tarea con ID: ${removedTask.id} eliminada`, ephemeral: true })
                } else {
                    await interaction.reply({ content: 'No se encontró la tarea con ese ID.', ephemeral: true })
                }
                break

            case 'update':
                if (!interaction.member.roles.cache.has(allowedRoleId)) {
                    await interaction.reply({ content: 'No tienes permiso para usar este comando.', ephemeral: true });
                    return;
                }
                const projectIDToUpdate = interaction.options.getInteger('idproject')
                const taskIDToUpdate = interaction.options.getInteger('idtask')
                const newStatus = interaction.options.getString('status')

                const projectToUpdateIn = data.projects.find(p => p.id === projectIDToUpdate)
                if (!projectToUpdateIn || !projectToUpdateIn.tasks) {
                    await interaction.reply({ content: 'No se encontró el proyecto o no tiene tareas.', ephemeral: true });
                    return;
                }

                const taskToUpdate = projectToUpdateIn.tasks.find(task => task.id === taskIDToUpdate)

                if (taskToUpdate) {
                    taskToUpdate.status = newStatus
                    writeData(data)

                    await interaction.reply({ content: `Estado de la tarea actualizado a **${newStatus}**`, ephemeral: true })
                } else {
                    await interaction.reply({ content: 'No se encontró la tarea con ese ID.', ephemeral: true })
                }
                break

            case 'responsible':
                if (!interaction.member.roles.cache.has(allowedRoleId)) {
                    await interaction.reply({ content: 'No tienes permiso para usar este comando.', ephemeral: true });
                    return;
                }
                const projectIDForResponsible = interaction.options.getInteger('idproject')
                const taskIDForResponsible = interaction.options.getInteger('idtask')
                const newResponsible = interaction.options.getUser('user').id

                const projectForResponsible = data.projects.find(p => p.id === projectIDForResponsible)
                if (!projectForResponsible || !projectForResponsible.tasks) {
                    await interaction.reply({ content: 'No se encontró el proyecto o no tiene tareas.', ephemeral: true });
                    return;
                }

                const taskToUpdateResponsible = projectForResponsible.tasks.find(task => task.id === taskIDForResponsible)

                if (taskToUpdateResponsible) {
                    taskToUpdateResponsible.responsible = newResponsible
                    taskToUpdateResponsible.status = 'En Progreso'
                    writeData(data)
                    await interaction.reply({ content: `Responsable de la tarea actualizado a <@${newResponsible}>`, ephemeral: true })
                } else {
                    await interaction.reply({ content: 'No se encontró la tarea con ese ID.', ephemeral: true })
                }
                break
        }
    }
}
