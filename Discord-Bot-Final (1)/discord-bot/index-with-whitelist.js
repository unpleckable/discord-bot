const { Client, GatewayIntentBits, Collection, Partials } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.DirectMessages,
    ],
    partials: [Partials.Channel, Partials.Message],
});

// Collections for commands
client.commands = new Collection();
client.cooldowns = new Collection();

// Whitelist of allowed server IDs (optional extra security)
const ALLOWED_SERVERS = process.env.ALLOWED_SERVERS 
    ? process.env.ALLOWED_SERVERS.split(',') 
    : [];

// Check if bot is in an unauthorized server
client.on('guildCreate', async (guild) => {
    // If whitelist is enabled and server is not allowed
    if (ALLOWED_SERVERS.length > 0 && !ALLOWED_SERVERS.includes(guild.id)) {
        console.log(`⚠️ Bot added to unauthorized server: ${guild.name} (${guild.id})`);
        console.log(`🚫 Leaving server...`);
        
        // Try to notify the server owner
        try {
            const owner = await guild.fetchOwner();
            await owner.send('This bot is private and can only be used in authorized servers. The bot has left your server.');
        } catch (error) {
            // Owner has DMs disabled, that's okay
        }
        
        // Leave the server
        await guild.leave();
        console.log(`✅ Left unauthorized server: ${guild.name}`);
    } else {
        console.log(`✅ Bot added to server: ${guild.name} (${guild.id})`);
    }
});

// Load command files
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        console.log(`✅ Loaded command: ${command.data.name}`);
    } else {
        console.log(`⚠️  Command at ${filePath} is missing required "data" or "execute" property.`);
    }
}

// Load event files
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
    console.log(`✅ Loaded event: ${event.name}`);
}

// Login to Discord
client.login(process.env.DISCORD_TOKEN);
