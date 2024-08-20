const { ActionRowBuilder, StringSelectMenuBuilder, SlashCommandBuilder, TextInputBuilder, ModalBuilder, MessageCollector } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('modify')
        .setDescription('Agregar/Eliminar/Actualizar Proyectos o Tareas')
        .addStringOption(option => 
            option
                .setName('type')
                .setDescription('Selecciona Proyecto o Tarea')
                .setRequired(true)
                .addChoices(
                    { name: 'Proyecto', value: 'project' },
                    { name: 'Tarea', value: 'task' }
                )
        ),
    
    async execute(interaction) {
        const type = interaction.options.getString('type');
        let options;

        if (type === 'project') {
            // Mostrar menú desplegable para seleccionar "Añadir", "Eliminar" o "Modificar Estado" proyecto
            options = new StringSelectMenuBuilder()
                .setCustomId('modify_project')
                .setPlaceholder('Selecciona una opción')
                .addOptions([
                    { label: 'Añadir Proyecto', value: 'add_project' },
                    { label: 'Eliminar Proyecto', value: 'remove_project' },
                    { label: 'Modificar Estado de Proyecto', value: 'update_project_status' }
                ]);
        } else if (type === 'task') {
            // Mostrar menú desplegable para seleccionar "Añadir", "Eliminar" o "Actualizar" tarea
            options = new StringSelectMenuBuilder()
                .setCustomId('modify_task')
                .setPlaceholder('Selecciona una opción')
                .addOptions([
                    { label: 'Añadir Tarea', value: 'add_task' },
                    { label: 'Eliminar Tarea', value: 'remove_task' },
                    { label: 'Actualizar Tarea', value: 'update_task' }
                ]);
        }

        const selectMenuRow = new ActionRowBuilder().addComponents(options);

        await interaction.reply({
            content: `Selecciona una opción para ${type === 'project' ? 'Proyecto' : 'Tarea'}`,
            components: [selectMenuRow]
        });
    },
};
