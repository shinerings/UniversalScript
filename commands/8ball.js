const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('Pregúntale algo a la bola mágica')
        .addStringOption(option =>
            option.setName('pregunta')
                .setDescription('¿Qué quieres saber?')
                .setRequired(true)
        ),
    
    async execute(interaction) {
        const pregunta = interaction.options.getString('pregunta');
        
        const respuestas = [
            'Sí, definitivamente',
            'Sin duda alguna',
            'Puedes contar con ello',
            'Es muy probable',
            'Las perspectivas son buenas',
            'Todo indica que sí',
            'Sí',
            'No está claro, pregunta de nuevo',
            'Pregunta más tarde',
            'Mejor no te lo digo ahora',
            'No puedo predecirlo',
            'Concéntrate y pregunta de nuevo',
            'No cuentes con ello',
            'Mi respuesta es no',
            'Mis fuentes dicen que no',
            'Las perspectivas no son buenas',
            'Muy dudoso',
            'No'
        ];
        
        const respuesta = respuestas[Math.floor(Math.random() * respuestas.length)];
        
        await interaction.reply(
            `🎱 **Pregunta:** ${pregunta}\n` +
            `🔮 **La bola mágica dice:** *${respuesta}*`
        );
    },
};