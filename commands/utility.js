const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('utility')
        .setDescription('Utility commands')
        .addSubcommand(subcommand =>
            subcommand
                .setName('ping')
                .setDescription('Check bot latency'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('userinfo')
                .setDescription('Get information about a user')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('User to get info about')
                        .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('serverinfo')
                .setDescription('Get information about the server'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('avatar')
                .setDescription('Get a user\'s avatar')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('User to get avatar from')
                        .setRequired(false))),
    
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'ping') {
            const sent = await interaction.reply({ content: '🏓 Pinging...', fetchReply: true });
            const latency = sent.createdTimestamp - interaction.createdTimestamp;
            const apiLatency = Math.round(interaction.client.ws.ping);

            const embed = new EmbedBuilder()
                .setColor('#00ff00')
                .setTitle('🏓 Pong!')
                .addFields(
                    { name: 'Bot Latency', value: `${latency}ms`, inline: true },
                    { name: 'API Latency', value: `${apiLatency}ms`, inline: true }
                )
                .setTimestamp();

            return interaction.editReply({ content: null, embeds: [embed] });
        }

        if (subcommand === 'userinfo') {
            const user = interaction.options.getUser('user') || interaction.user;
            const member = await interaction.guild.members.fetch(user.id);

            const roles = member.roles.cache
                .filter(role => role.id !== interaction.guild.id)
                .sort((a, b) => b.position - a.position)
                .map(role => role.toString())
                .slice(0, 10);

            const embed = new EmbedBuilder()
                .setColor(member.displayHexColor || '#0099ff')
                .setTitle(`👤 User Information - ${user.tag}`)
                .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 256 }))
                .addFields(
                    { name: 'ID', value: user.id, inline: true },
                    { name: 'Nickname', value: member.nickname || 'None', inline: true },
                    { name: 'Account Created', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true },
                    { name: 'Joined Server', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true },
                    { name: `Roles [${member.roles.cache.size - 1}]`, value: roles.length ? roles.join(', ') : 'None', inline: false }
                )
                .setFooter({ text: `Requested by ${interaction.user.tag}` })
                .setTimestamp();

            return interaction.reply({ embeds: [embed] });
        }

        if (subcommand === 'serverinfo') {
            const { guild } = interaction;

            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle(`🏰 ${guild.name}`)
                .setThumbnail(guild.iconURL({ dynamic: true, size: 256 }))
                .addFields(
                    { name: 'Server ID', value: guild.id, inline: true },
                    { name: 'Owner', value: `<@${guild.ownerId}>`, inline: true },
                    { name: 'Created', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true },
                    { name: 'Members', value: `${guild.memberCount}`, inline: true },
                    { name: 'Channels', value: `${guild.channels.cache.size}`, inline: true },
                    { name: 'Roles', value: `${guild.roles.cache.size}`, inline: true },
                    { name: 'Boost Level', value: `Level ${guild.premiumTier}`, inline: true },
                    { name: 'Boosts', value: `${guild.premiumSubscriptionCount || 0}`, inline: true }
                )
                .setTimestamp();

            if (guild.description) {
                embed.setDescription(guild.description);
            }

            return interaction.reply({ embeds: [embed] });
        }

        if (subcommand === 'avatar') {
            const user = interaction.options.getUser('user') || interaction.user;

            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle(`${user.tag}'s Avatar`)
                .setImage(user.displayAvatarURL({ dynamic: true, size: 1024 }))
                .setDescription(`[Download](${user.displayAvatarURL({ dynamic: true, size: 1024 })})`)
                .setTimestamp();

            return interaction.reply({ embeds: [embed] });
        }
    },
};
