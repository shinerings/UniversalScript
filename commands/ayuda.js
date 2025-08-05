const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ayuda')
        .setDescription('Muestra todos los comandos disponibles del bot'),
    
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor(0x00AE86)
            .setTitle('🤖 Comandos del Bot')
            .setDescription('Aquí tienes todos los comandos disponibles:')
            .addFields(
                { name: '📋 /ayuda', value: 'Muestra esta lista de comandos', inline: true },
                { name: '🏓 /ping', value: 'Verifica la latencia del bot', inline: true },
                { name: '👤 /usuario', value: 'Muestra información del usuario', inline: true },
                { name: '🎲 /dado', value: 'Lanza un dado de 6 caras', inline: true },
                { name: '🎱 /8ball', value: 'Haz una pregunta a la bola mágica', inline: true },
                { name: '🧮 /calc', value: 'Calculadora básica', inline: true },
                { name: '🎉 /servidor', value: 'Información del servidor', inline: true },
                { name: '💰 /moneda', value: 'Lanza una moneda', inline: true }
            )
            .setFooter({ text: 'Bot creado con Discord.js v14' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};