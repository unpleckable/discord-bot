const { Events, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '..', 'config.json');

function loadConfig() {
    if (fs.existsSync(configPath)) {
        return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }
    return {};
}

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        const config = loadConfig();
        const guildConfig = config[member.guild.id];

        if (!guildConfig || !guildConfig.welcomeChannel) return;

        const channel = member.guild.channels.cache.get(guildConfig.welcomeChannel);
        if (!channel) return;

        let message = guildConfig.welcomeMessage || 'Welcome {user} to {server}!';
        message = message.replace('{user}', `${member}`);
        message = message.replace('{server}', member.guild.name);
        message = message.replace('{memberCount}', `${member.guild.memberCount}`);

        const embed = new EmbedBuilder()
            .setColor('#00ff00')
            .setTitle('👋 Welcome!')
            .setDescription(message)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setFooter({ text: `Member #${member.guild.memberCount}` })
            .setTimestamp();

        try {
            await channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error sending welcome message:', error);
        }
    },
};
