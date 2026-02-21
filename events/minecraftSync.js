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

        const content = message.content;
        const embeds = message.embeds;
        
        // DEBUG: Log every message in console channel
        console.log(`[MC SYNC DEBUG] Message in console: "${content}"`);

        // Check for player join
        // Support ALL possible DiscordSRV formats:
        // 1. Standard embed: "✅ **Username** joined the server"
        // 2. Emoji text: ":white_check_mark: **Username** joined the server"
        // 3. Simple text: "Username joined the server"
        // 4. Server log: "[Fri 18:16:42 INFO  Server] Username joined the game"
        // 5. Embed author: Just "Username joined the server" in embed
        // 6. With display name: "Username (DisplayName) joined"
        
        let minecraftUsername = null;
        
        // Try different patterns in order of specificity
        const patterns = [
            // Pattern 1: Emoji + bold username
            /(?:✅|:white_check_mark:|☑️)\s*\*\*(.+?)\*\*\s*(?:joined|has joined)/i,
            
            // Pattern 2: Server log format
            /\[.*?\]\s*\[.*?\]\s*(\w+)\s+(?:joined|left)/i,
            
            // Pattern 3: Simple bold
            /\*\*(.+?)\*\*\s*(?:joined|has joined)/i,
            
            // Pattern 4: Username at start
            /^(\w+)\s+(?:joined|has joined)/i,
            
            // Pattern 5: With parentheses display name
            /(\w+)\s*\([^)]+\)\s*(?:joined|has joined)/i,
        ];
        
        // Try each pattern
        for (const pattern of patterns) {
            const match = content.match(pattern);
            if (match) {
                minecraftUsername = match[1];
                break;
            }
        }
        
        // If not found in content, check embeds
        if (!minecraftUsername && embeds.length > 0) {
            for (const embed of embeds) {
                // Check embed author
                if (embed.author && embed.author.name) {
                    const embedMatch = embed.author.name.match(/(\w+)\s+(?:joined|has joined)/i);
                    if (embedMatch) {
                        minecraftUsername = embedMatch[1];
                        break;
                    }
                }
                // Check embed description
                if (!minecraftUsername && embed.description) {
                    const embedMatch = embed.description.match(/(\w+)\s+(?:joined|has joined)/i);
                    if (embedMatch) {
                        minecraftUsername = embedMatch[1];
                        break;
                    }
                }
            }
        }
        
        if (minecraftUsername) {
            console.log(`[MC SYNC DEBUG] Detected join for: "${minecraftUsername}"`);
            
            // Try to find the Discord user by their nickname or username
            const member = message.guild.members.cache.find(m => {
                const displayName = m.displayName.toLowerCase();
                const userName = m.user.username.toLowerCase();
                const mcName = minecraftUsername.toLowerCase();
                
                // Exact match
                if (displayName === mcName || userName === mcName) return true;
                
                // Contains match
                if (displayName.includes(mcName) || userName.includes(mcName)) return true;
                
                // MC name contains Discord name (for names like "Steve123" matching "Steve")
                if (mcName.includes(displayName) || mcName.includes(userName)) return true;
                
                return false;
            });

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
        // Support ALL possible DiscordSRV formats:
        // Same patterns as join, but for "left" messages
        
        minecraftUsername = null;
        
        const leavePatterns = [
            // Pattern 1: Emoji + bold username
            /(?:❌|:x:|✖️|:cross_mark:)\s*\*\*(.+?)\*\*\s*(?:left|has left|disconnected)/i,
            
            // Pattern 2: Server log format
            /\[.*?\]\s*\[.*?\]\s*(\w+)\s+(?:left|disconnected)/i,
            
            // Pattern 3: Simple bold
            /\*\*(.+?)\*\*\s*(?:left|has left|disconnected)/i,
            
            // Pattern 4: Username at start
            /^(\w+)\s+(?:left|has left|disconnected)/i,
            
            // Pattern 5: With parentheses display name
            /(\w+)\s*\([^)]+\)\s*(?:left|has left|disconnected)/i,
        ];
        
        // Try each pattern
        for (const pattern of leavePatterns) {
            const match = content.match(pattern);
            if (match) {
                minecraftUsername = match[1];
                break;
            }
        }
        
        // If not found in content, check embeds
        if (!minecraftUsername && embeds.length > 0) {
            for (const embed of embeds) {
                // Check embed author
                if (embed.author && embed.author.name) {
                    const embedMatch = embed.author.name.match(/(\w+)\s+(?:left|has left|disconnected)/i);
                    if (embedMatch) {
                        minecraftUsername = embedMatch[1];
                        break;
                    }
                }
                // Check embed description
                if (!minecraftUsername && embed.description) {
                    const embedMatch = embed.description.match(/(\w+)\s+(?:left|has left|disconnected)/i);
                    if (embedMatch) {
                        minecraftUsername = embedMatch[1];
                        break;
                    }
                }
            }
        }
        
        if (minecraftUsername) {
            console.log(`[MC SYNC DEBUG] Detected leave for: "${minecraftUsername}"`);
            
            // Try to find the Discord user
            const member = message.guild.members.cache.find(m => {
                const displayName = m.displayName.toLowerCase();
                const userName = m.user.username.toLowerCase();
                const mcName = minecraftUsername.toLowerCase();
                
                // Exact match
                if (displayName === mcName || userName === mcName) return true;
                
                // Contains match
                if (displayName.includes(mcName) || userName.includes(mcName)) return true;
                
                // MC name contains Discord name
                if (mcName.includes(displayName) || mcName.includes(userName)) return true;
                
                return false;
            });

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
