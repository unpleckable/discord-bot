const { Events } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        // Ignore bot messages
        if (message.author.bot) return;

        // Ignore DMs
        if (!message.guild) return;

        // Get protected channel IDs from environment
        const protectedChannels = process.env.PROTECTED_CHANNELS 
            ? process.env.PROTECTED_CHANNELS.split(',') 
            : [];

        // Check if this is a protected channel
        if (!protectedChannels.includes(message.channel.id)) return;

        // Get required role ID from environment
        const requiredRoleId = process.env.REQUIRED_ROLE_ID;
        if (!requiredRoleId) return;

        // Check if user has the required role
        const member = message.member;
        const hasRole = member.roles.cache.has(requiredRoleId);

        // If user doesn't have the role, delete their message
        if (!hasRole) {
            try {
                await message.delete();
                console.log(`🗑️ Deleted message from ${message.author.tag} in ${message.channel.name} (missing required role)`);

                // Optional: Send a temporary warning message
                const warning = await message.channel.send(`${message.author}, you need to complete verification to send messages here.`);
                
                // Delete the warning after 5 seconds
                setTimeout(() => {
                    warning.delete().catch(() => {});
                }, 5000);
            } catch (error) {
                console.error('Error deleting message:', error);
            }
        }
    },
};
