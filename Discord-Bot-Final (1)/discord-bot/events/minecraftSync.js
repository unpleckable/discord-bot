const { Events } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        // Ignore if MC sync not configured
        if (!process.env.MC_ONLINE_ROLE_ID || !process.env.MC_CONSOLE_CHANNEL_ID) {
            return;
        }

        // Only monitor the configured console channel
        if (message.channel.id !== process.env.MC_CONSOLE_CHANNEL_ID) {
            return;
        }

        // Ignore bot's own messages
        if (message.author.id === message.client.user.id) {
            return;
        }

        const role = message.guild.roles.cache.get(process.env.MC_ONLINE_ROLE_ID);
        if (!role) {
            console.log('⚠️ MC Online role not found');
            return;
        }

        // DiscordSRV formats:
        // Join: ":white_check_mark: **Username** joined the server"
        // Leave: ":x: **Username** left the server"
        
        const content = message.content;

        // Check for player join
        const joinMatch = content.match(/(?:✅|:white_check_mark:)\s*\*\*(.+?)\*\*\s*(?:joined|joined the server)/i);
        if (joinMatch) {
            const minecraftUsername = joinMatch[1];
            
            // Try to find the Discord user by their nickname or username
            const member = message.guild.members.cache.find(m => 
                m.displayName.toLowerCase().includes(minecraftUsername.toLowerCase()) ||
                m.user.username.toLowerCase().includes(minecraftUsername.toLowerCase())
            );

            if (member) {
                try {
                    await member.roles.add(role);
                    console.log(`✅ Added online role to ${member.user.tag} (MC: ${minecraftUsername})`);
                } catch (error) {
                    console.error(`Error adding role to ${member.user.tag}:`, error.message);
                }
            } else {
                console.log(`⚠️ Could not find Discord user for Minecraft player: ${minecraftUsername}`);
            }
        }

        // Check for player leave
        const leaveMatch = content.match(/(?:❌|:x:)\s*\*\*(.+?)\*\*\s*(?:left|left the server|disconnected)/i);
        if (leaveMatch) {
            const minecraftUsername = leaveMatch[1];
            
            // Try to find the Discord user
            const member = message.guild.members.cache.find(m => 
                m.displayName.toLowerCase().includes(minecraftUsername.toLowerCase()) ||
                m.user.username.toLowerCase().includes(minecraftUsername.toLowerCase())
            );

            if (member) {
                try {
                    await member.roles.remove(role);
                    console.log(`✅ Removed online role from ${member.user.tag} (MC: ${minecraftUsername})`);
                } catch (error) {
                    console.error(`Error removing role from ${member.user.tag}:`, error.message);
                }
            }
        }
    },
};
