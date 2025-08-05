const { Client, GatewayIntentBits, Collection, Events } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Crear el cliente del bot con los intents necesarios
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// Colección para almacenar los comandos
client.commands = new Collection();

// Cargar comandos automáticamente
const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            console.log(`✅ Comando cargado: ${command.data.name}`);
        } else {
            console.log(`⚠️ El comando en ${filePath} no tiene la estructura correcta.`);
        }
    }
}

// Evento cuando el bot está listo
client.once(Events.ClientReady, readyClient => {
    console.log(`🚀 ¡Bot conectado como ${readyClient.user.tag}!`);
    console.log(`📊 Conectado a ${client.guilds.cache.size} servidor(es)`);
    
    // Establecer estado del bot
    client.user.setActivity('¡Listo para ayudar! 🤖', { type: 'WATCHING' });
});

// Manejar comandos slash
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`❌ No se encontró el comando ${interaction.commandName}.`);
        return;
    }

    try {
        await command.execute(interaction);
        console.log(`✅ Comando ejecutado: ${interaction.commandName} por ${interaction.user.tag}`);
    } catch (error) {
        console.error(`❌ Error ejecutando ${interaction.commandName}:`, error);
        
        const errorMessage = { 
            content: '❌ Hubo un error al ejecutar este comando!', 
            ephemeral: true 
        };
        
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp(errorMessage);
        } else {
            await interaction.reply(errorMessage);
        }
    }
});

// Manejar mensajes normales (opcional)
client.on(Events.MessageCreate, message => {
    // Ignorar mensajes del bot
    if (message.author.bot) return;
    
    // Responder a menciones
    if (message.mentions.has(client.user)) {
        message.reply('¡Hola! 👋 Usa `/ayuda` para ver mis comandos.');
    }
    
    // Reaccionar a mensajes que contengan "bot"
    if (message.content.toLowerCase().includes('bot')) {
        message.react('🤖');
    }
});

// Manejar errores
client.on('error', error => {
    console.error('❌ Error del cliente Discord:', error);
});

process.on('unhandledRejection', error => {
    console.error('❌ Promesa rechazada sin manejar:', error);
});

// Conectar el bot
if (!process.env.DISCORD_TOKEN) {
    console.error('❌ No se encontró DISCORD_TOKEN en las variables de entorno!');
    console.log('📝 Crea un archivo .env basado en .env.example');
    process.exit(1);
}

client.login(process.env.DISCORD_TOKEN);