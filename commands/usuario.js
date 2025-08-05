const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('usuario')
        .setDescription('Muestra información de un usuario')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('Usuario del que quieres ver la info')
                .setRequired(false)
        ),
    
    async execute(interaction) {
        const target = interaction.options.getUser('target') || interaction.user;
        const member = interaction.guild.members.cache.get(target.id);
        
        const embed = new EmbedBuilder()
            .setColor(0x00AE86)
            .setTitle(`👤 Información de ${target.displayName}`)
            .setThumbnail(target.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: '🏷️ Tag', value: target.tag, inline: true },
                { name: '🆔 ID', value: target.id, inline: true },
                { name: '🤖 Es Bot', value: target.bot ? 'Sí' : 'No', inline: true },
                { name: '📅 Cuenta creada', value: `<t:${Math.floor(target.createdTimestamp / 1000)}:F>`, inline: false }
            )
            .setTimestamp();
        
        if (member) {
            embed.addFields(
                { name: '📥 Se unió al servidor', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`, inline: false },
                { name: '🎭 Roles', value: member.roles.cache.map(role => role.toString()).join(' ') || 'Sin roles', inline: false }
            );
        }
        
        await interaction.reply({ embeds: [embed] });
    },
};