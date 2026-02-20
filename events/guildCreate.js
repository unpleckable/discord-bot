const { Events } = require('discord.js');

module.exports = {
    name: Events.GuildCreate,
    async execute(guild) {
        console.log(`🆕 Bot added to new server: ${guild.name} (${guild.id})`);

        // Check if server is whitelisted
        if (process.env.ALLOWED_GUILD_IDS) {
            const allowedGuilds = process.env.ALLOWED_GUILD_IDS.split(',');
            
            if (!allowedGuilds.includes(guild.id)) {
                console.log(`⚠️ Server ${guild.name} is not whitelisted. Leaving...`);
                
                // Try to message the server owner
                try {
                    const owner = await guild.fetchOwner();
                    await owner.send(
                        `❌ This bot is private and cannot be added to other servers.\n\n` +
                        `Server: ${guild.name}\n` +
                        `The bot has automatically left your server.`
                    );
                } catch (error) {
                    console.log('Could not DM server owner');
                }
                
                // Leave the server
                try {
                    await guild.leave();
                    console.log(`✅ Successfully left unauthorized server: ${guild.name}`);
                } catch (error) {
                    console.error(`❌ Failed to leave server:`, error);
                }
            } else {
                console.log(`✅ Server ${guild.name} is whitelisted`);
            }
        }
    },
};
