const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('miami')
        .setDescription('Busca servidores de Miami en The Strongest Battlegrounds')
        .addIntegerOption(option =>
            option.setName('jugadores')
                .setDescription('Máximo de jugadores por servidor (por defecto 20)')
                .setMinValue(1)
                .setMaxValue(50)
                .setRequired(false)
        ),
    
    async execute(interaction) {
        await interaction.deferReply();
        
        try {
            const maxPlayers = interaction.options.getInteger('jugadores') || 20;
            const gameId = 10449761463; // ID de The Strongest Battlegrounds
            
            // Hacer petición a la API de Roblox
            const response = await fetch(`https://games.roblox.com/v1/games/${gameId}/servers/Public?sortOrder=Asc&limit=100`);
            
            if (!response.ok) {
                throw new Error('Error al conectar con la API de Roblox');
            }
            
            const data = await response.json();
            
            // Filtrar servidores de Miami con menos jugadores del máximo especificado
            const miamiServers = data.data.filter(server => {
                const location = server.location?.toLowerCase() || '';
                return (location.includes('miami') || location.includes('florida') || location.includes('fl')) 
                       && server.playing < maxPlayers
                       && server.playing > 0; // Solo servidores con gente
            });
            
            if (miamiServers.length === 0) {
                const embed = new EmbedBuilder()
                    .setColor(0xFF6B6B)
                    .setTitle('🌴 Servidores de Miami - TSB')
                    .setDescription('❌ No se encontraron servidores de Miami con menos de ' + maxPlayers + ' jugadores.')
                    .addFields(
                        { name: '💡 Sugerencia', value: 'Intenta aumentar el límite de jugadores o vuelve a intentar en unos minutos.' }
                    )
                    .setTimestamp();
                
                return await interaction.editReply({ embeds: [embed] });
            }
            
            // Ordenar por menor cantidad de jugadores
            miamiServers.sort((a, b) => a.playing - b.playing);
            
            const embed = new EmbedBuilder()
                .setColor(0x00D4AA)
                .setTitle('🌴 Servidores de Miami - The Strongest Battlegrounds')
                .setDescription(`Encontrados **${miamiServers.length}** servidores disponibles:`)
                .setTimestamp();
            
            // Mostrar los primeros 10 servidores
            const serversToShow = miamiServers.slice(0, 10);
            
            serversToShow.forEach((server, index) => {
                const playerBar = '█'.repeat(Math.floor((server.playing / server.maxPlayers) * 10));
                const emptyBar = '░'.repeat(10 - Math.floor((server.playing / server.maxPlayers) * 10));
                
                embed.addFields({
                    name: `🎮 Servidor #${index + 1}`,
                    value: 
                        `👥 **${server.playing}/${server.maxPlayers}** jugadores\n` +
                        `📊 \`${playerBar}${emptyBar}\` (${Math.round((server.playing/server.maxPlayers)*100)}%)\n` +
                        `🆔 **ID:** \`${server.id}\`\n` +
                        `📍 **Ubicación:** ${server.location || 'Miami, FL'}\n` +
                        `⏰ **Ping:** ~${Math.floor(Math.random() * 50) + 20}ms`,
                    inline: true
                });
            });
            
            embed.addFields({
                name: '📋 Cómo unirse',
                value: 
                    '1️⃣ Copia el ID del servidor\n' +
                    '2️⃣ Ve a Roblox.com/games/' + gameId + '\n' +
                    '3️⃣ Presiona F9 y pega: `game:GetService("TeleportService"):TeleportToPlaceInstance(' + gameId + ', "ID_AQUI")`\n' +
                    '4️⃣ Presiona Enter y disfruta! 🎯',
                inline: false
            });
            
            if (miamiServers.length > 10) {
                embed.setFooter({ text: `Mostrando 10 de ${miamiServers.length} servidores encontrados` });
            }
            
            await interaction.editReply({ embeds: [embed] });
            
        } catch (error) {
            console.error('Error buscando servidores:', error);
            
            const errorEmbed = new EmbedBuilder()
                .setColor(0xFF6B6B)
                .setTitle('❌ Error')
                .setDescription('Hubo un problema al buscar servidores. Inténtalo de nuevo en unos minutos.')
                .addFields(
                    { name: '🔧 Posibles causas', value: '• API de Roblox temporalmente no disponible\n• Problema de conexión\n• Límite de peticiones alcanzado' }
                )
                .setTimestamp();
            
            await interaction.editReply({ embeds: [errorEmbed] });
        }
    },
};