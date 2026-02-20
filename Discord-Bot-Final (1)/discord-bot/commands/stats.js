const { SlashCommandBuilder, EmbedBuilder, version } = require('discord.js');
const os = require('os');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Show bot and server statistics'),
    
    async execute(interaction) {
        const { client, guild } = interaction;

        // Calculate uptime
        const uptime = process.uptime();
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor(uptime / 3600) % 24;
        const minutes = Math.floor(uptime / 60) % 60;
        const seconds = Math.floor(uptime) % 60;

        // Memory usage
        const memUsage = process.memoryUsage();
        const memUsed = (memUsage.heapUsed / 1024 / 1024).toFixed(2);
        const memTotal = (memUsage.heapTotal / 1024 / 1024).toFixed(2);

        // Count channels by type
        const textChannels = guild.channels.cache.filter(c => c.type === 0).size;
        const voiceChannels = guild.channels.cache.filter(c => c.type === 2).size;
        const categories = guild.channels.cache.filter(c => c.type === 4).size;

        // Count members
        const totalMembers = guild.memberCount;
        const humans = guild.members.cache.filter(m => !m.user.bot).size;
        const bots = guild.members.cache.filter(m => m.user.bot).size;

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('📊 Server & Bot Statistics')
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .addFields(
                { name: '🏰 Server Information', value: `**Name:** ${guild.name}\n**ID:** ${guild.id}\n**Owner:** <@${guild.ownerId}>\n**Created:** <t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: false },
                { name: '👥 Members', value: `**Total:** ${totalMembers}\n**Humans:** ${humans}\n**Bots:** ${bots}`, inline: true },
                { name: '📺 Channels', value: `**Text:** ${textChannels}\n**Voice:** ${voiceChannels}\n**Categories:** ${categories}`, inline: true },
                { name: '💎 Boosts', value: `**Level:** ${guild.premiumTier}\n**Boosts:** ${guild.premiumSubscriptionCount || 0}`, inline: true },
                { name: '🤖 Bot Stats', value: `**Uptime:** ${days}d ${hours}h ${minutes}m ${seconds}s\n**Memory:** ${memUsed}MB / ${memTotal}MB\n**Ping:** ${client.ws.ping}ms`, inline: false },
                { name: '⚙️ System', value: `**Discord.js:** v${version}\n**Node.js:** ${process.version}\n**Platform:** ${os.platform()}`, inline: false }
            )
            .setFooter({ text: `Requested by ${interaction.user.tag}` })
            .setTimestamp();

        return interaction.reply({ embeds: [embed] });
    },
};
