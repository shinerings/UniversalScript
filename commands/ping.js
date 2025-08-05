const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Verifica la latencia del bot'),
    
    async execute(interaction) {
        const sent = await interaction.reply({ 
            content: 'Calculando ping...', 
            fetchReply: true 
        });
        
        const ping = sent.createdTimestamp - interaction.createdTimestamp;
        const apiPing = Math.round(interaction.client.ws.ping);
        
        await interaction.editReply(
            `🏓 **Pong!**\n` +
            `⏱️ Latencia: \`${ping}ms\`\n` +
            `💝 API: \`${apiPing}ms\``
        );
    },
};