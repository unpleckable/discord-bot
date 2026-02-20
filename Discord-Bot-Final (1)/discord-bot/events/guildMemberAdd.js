const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        // Check if welcome system is configured
        if (!process.env.WELCOME_CHANNEL_ID || !process.env.WELCOME_MESSAGE) {
            console.log('⚠️ Welcome system not configured (missing WELCOME_CHANNEL_ID or WELCOME_MESSAGE in .env)');
            return;
        }

        // Get the welcome channel
        const channel = member.guild.channels.cache.get(process.env.WELCOME_CHANNEL_ID);
        if (!channel) {
            console.log(`⚠️ Welcome channel not found: ${process.env.WELCOME_CHANNEL_ID}`);
            return;
        }

        // Replace variables in message
        let message = process.env.WELCOME_MESSAGE;
        message = message.replace(/{user}/g, `${member}`);
        message = message.replace(/{server}/g, member.guild.name);
        message = message.replace(/{memberCount}/g, `${member.guild.memberCount}`);

        // Create welcome embed
        const embed = new EmbedBuilder()
            .setColor('#00ff00')
            .setTitle('👋 Welcome!')
            .setDescription(message)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
            .setFooter({ text: `Member #${member.guild.memberCount}` })
            .setTimestamp();

        try {
            await channel.send({ embeds: [embed] });
            console.log(`✅ Welcome message sent for ${member.user.tag}`);
        } catch (error) {
            console.error('❌ Error sending welcome message:', error.message);
        }
    },
};
