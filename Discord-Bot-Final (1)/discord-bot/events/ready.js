const { Events, ActivityType } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`✅ Logged in as ${client.user.tag}!`);
        console.log(`📊 Serving ${client.guilds.cache.size} servers`);
        console.log(`👥 Total users: ${client.users.cache.size}`);

        // Whitelist check - leave only allowed servers
        if (process.env.ALLOWED_GUILD_IDS) {
            const allowedGuilds = process.env.ALLOWED_GUILD_IDS.split(',');
            
            client.guilds.cache.forEach(async guild => {
                if (!allowedGuilds.includes(guild.id)) {
                    console.log(`⚠️ Leaving unauthorized server: ${guild.name} (${guild.id})`);
                    try {
                        await guild.leave();
                        console.log(`✅ Left server: ${guild.name}`);
                    } catch (error) {
                        console.error(`❌ Failed to leave ${guild.name}:`, error);
                    }
                }
            });
        }

        // Set bot status
        client.user.setPresence({
            activities: [{ name: 'your server', type: ActivityType.Watching }],
            status: 'online',
        });
    },
};
