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
        
        // DEBUG: Log every message in console channel
        console.log(`[MC SYNC DEBUG] Message in console: "${content}"`);

        // Check for player join
        // Support multiple DiscordSRV formats:
        // Format 1: "✅ **Username** joined the server"
        // Format 2: "[Fri 18:16:42 INFO  Server] Username joined the game"
        
        let joinMatch = content.match(/(?:✅|:white_check_mark:)\s*\*\*(.+?)\*\*\s*(?:joined|joined the server)/i);
        
        // If not found, try server log format
        if (!joinMatch) {
            joinMatch = content.match(/\[.*?\]\s+\[.*?\]\s+(\w+)\s+joined the (?:game|server)/i);
        }
        
        if (joinMatch) {
            const minecraftUsername = joinMatch[1];
            console.log(`[MC SYNC DEBUG] Detected join for: "${minecraftUsername}"`);
            
            // Try to find the Discord user by their nickname or username
            const member = message.guild.members.cache.find(m => 
                m.displayName.toLowerCase().includes(minecraftUsername.toLowerCase()) ||
                m.user.username.toLowerCase().includes(minecraftUsername.toLowerCase())
            );

            if (member) {
                console.log(`[MC SYNC DEBUG] Found Discord user: ${member.user.tag}`);
                try {
                    await member.roles.add(role);
                    console.log(`✅ Added online role to ${member.user.tag} (MC: ${minecraftUsername})`);
                } catch (error) {
                    console.error(`❌ Error adding role to ${member.user.tag}:`, error.message);
                }
            } else {
                console.log(`⚠️ Could not find Discord user for Minecraft player: ${minecraftUsername}`);
                console.log(`[MC SYNC DEBUG] Searched for username containing: "${minecraftUsername.toLowerCase()}"`);
            }
        }

        // Check for player leave
        // Support multiple DiscordSRV formats:
        // Format 1: "❌ **Username** left the server"
        // Format 2: "[Fri 18:16:42 INFO  Server] Username left the game"
        
        let leaveMatch = content.match(/(?:❌|:x:)\s*\*\*(.+?)\*\*\s*(?:left|left the server|disconnected)/i);
        
        // If not found, try server log format
        if (!leaveMatch) {
            leaveMatch = content.match(/\[.*?\]\s+\[.*?\]\s+(\w+)\s+left the (?:game|server)/i);
        }
        
        if (leaveMatch) {
            const minecraftUsername = leaveMatch[1];
            console.log(`[MC SYNC DEBUG] Detected leave for: "${minecraftUsername}"`);
            
            // Try to find the Discord user
            const member = message.guild.members.cache.find(m => 
                m.displayName.toLowerCase().includes(minecraftUsername.toLowerCase()) ||
                m.user.username.toLowerCase().includes(minecraftUsername.toLowerCase())
            );

            if (member) {
                console.log(`[MC SYNC DEBUG] Found Discord user: ${member.user.tag}`);
                try {
                    await member.roles.remove(role);
                    console.log(`✅ Removed online role from ${member.user.tag} (MC: ${minecraftUsername})`);
                } catch (error) {
                    console.error(`❌ Error removing role from ${member.user.tag}:`, error.message);
                }
            }
        }
    },
};
