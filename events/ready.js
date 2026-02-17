const { Events, ActivityType } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`✅ Logged in as ${client.user.tag}!`);
        console.log(`📊 Serving ${client.guilds.cache.size} servers`);
        console.log(`👥 Total users: ${client.users.cache.size}`);

        // Set bot status
        client.user.setPresence({
            activities: [{ name: 'your server', type: ActivityType.Watching }],
            status: 'online',
        });
    },
};
