const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '..', 'config.json');

function loadConfig() {
    if (fs.existsSync(configPath)) {
        return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }
    return {};
}

function saveConfig(config) {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('welcome')
        .setDescription('Configure welcome messages')
        .addSubcommand(subcommand =>
            subcommand
                .setName('setup')
                .setDescription('Setup welcome messages')
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('Channel to send welcome messages')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('message')
                        .setDescription('Welcome message (use {user} for mention, {server} for server name)')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('disable')
                .setDescription('Disable welcome messages')),
    
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ content: '❌ You need Administrator permission to use this command.', ephemeral: true });
        }

        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'setup') {
            const channel = interaction.options.getChannel('channel');
            const message = interaction.options.getString('message');

            const config = loadConfig();
            if (!config[interaction.guild.id]) {
                config[interaction.guild.id] = {};
            }

            config[interaction.guild.id].welcomeChannel = channel.id;
            config[interaction.guild.id].welcomeMessage = message;

            saveConfig(config);

            const embed = new EmbedBuilder()
                .setColor('#00ff00')
                .setTitle('✅ Welcome System Setup')
                .addFields(
                    { name: 'Channel', value: `${channel}`, inline: true },
                    { name: 'Message', value: message, inline: false }
                )
                .setTimestamp();

            return interaction.reply({ embeds: [embed] });
        }

        if (subcommand === 'disable') {
            const config = loadConfig();
            if (config[interaction.guild.id]) {
                delete config[interaction.guild.id].welcomeChannel;
                delete config[interaction.guild.id].welcomeMessage;
                saveConfig(config);
            }

            return interaction.reply({ content: '✅ Welcome messages disabled.', ephemeral: true });
        }
    },
};
