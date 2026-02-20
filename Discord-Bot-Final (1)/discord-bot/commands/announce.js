const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('announce')
        .setDescription('Send an announcement')
        .addStringOption(option =>
            option.setName('title')
                .setDescription('Announcement title')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Announcement message')
                .setRequired(true))
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Channel to send announcement')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('color')
                .setDescription('Embed color')
                .addChoices(
                    { name: 'Blue', value: '#0099ff' },
                    { name: 'Green', value: '#00ff00' },
                    { name: 'Red', value: '#ff0000' },
                    { name: 'Yellow', value: '#ffff00' },
                    { name: 'Purple', value: '#9900ff' }
                )
                .setRequired(false))
        .addStringOption(option =>
            option.setName('ping')
                .setDescription('Who to ping')
                .addChoices(
                    { name: 'Everyone', value: '@everyone' },
                    { name: 'Here', value: '@here' },
                    { name: 'None', value: 'none' }
                )
                .setRequired(false)),
    
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ content: '❌ You need Administrator permission to use this command.', ephemeral: true });
        }

        const title = interaction.options.getString('title');
        const message = interaction.options.getString('message');
        const channel = interaction.options.getChannel('channel') || interaction.channel;
        const color = interaction.options.getString('color') || '#0099ff';
        const ping = interaction.options.getString('ping') || 'none';

        const embed = new EmbedBuilder()
            .setColor(color)
            .setTitle(`📢 ${title}`)
            .setDescription(message)
            .setFooter({ text: `Posted by ${interaction.user.tag}` })
            .setTimestamp();

        const content = ping !== 'none' ? ping : null;

        await channel.send({ content, embeds: [embed] });

        return interaction.reply({ 
            content: `✅ Announcement sent to ${channel}`, 
            ephemeral: true 
        });
    },
};
