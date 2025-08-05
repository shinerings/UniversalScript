const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dado')
        .setDescription('Lanza un dado')
        .addIntegerOption(option =>
            option.setName('caras')
                .setDescription('Número de caras del dado (por defecto 6)')
                .setMinValue(2)
                .setMaxValue(100)
                .setRequired(false)
        ),
    
    async execute(interaction) {
        const caras = interaction.options.getInteger('caras') || 6;
        const resultado = Math.floor(Math.random() * caras) + 1;
        
        const dados = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
        const dadoEmoji = caras === 6 ? dados[resultado - 1] : '🎲';
        
        await interaction.reply(
            `${dadoEmoji} **${interaction.user.displayName}** lanzó un dado de ${caras} caras!\n` +
            `🎯 **Resultado:** \`${resultado}\``
        );
    },
};