const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();

const commands = [];

// Leer todos los comandos de la carpeta commands
const foldersPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(foldersPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(foldersPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
        console.log(`✅ Comando preparado: ${command.data.name}`);
    } else {
        console.log(`⚠️ El comando en ${filePath} no tiene la estructura correcta.`);
    }
}

// Construir y preparar una instancia del módulo REST
const rest = new REST().setToken(process.env.DISCORD_TOKEN);

// Desplegar comandos
(async () => {
    try {
        console.log(`🚀 Comenzando a refrescar ${commands.length} comandos de aplicación (/).`);

        // Método para refrescar todos los comandos en el servidor especificado
        const data = await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands },
        );

        console.log(`✅ Recargados exitosamente ${data.length} comandos de aplicación (/).`);
    } catch (error) {
        console.error('❌ Error:', error);
    }
})();