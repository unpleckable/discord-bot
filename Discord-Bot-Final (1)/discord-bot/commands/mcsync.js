const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mcsync')
        .setDescription('Minecraft server sync commands')
        .addSubcommand(subcommand =>
            subcommand
                .setName('setup')
                .setDescription('Setup Minecraft server sync')
                .addRoleOption(option =>
                    option.setName('role')
                        .setDescription('Role to give online players')
                        .setRequired(true))
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('DiscordSRV console channel to monitor')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Manually add online role to a user')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('User to add role to')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Manually remove online role from a user')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('User to remove role from')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('List all users with online role'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('disable')
                .setDescription('Disable Minecraft sync')),
    
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ content: '❌ You need Administrator permission to use this command.', ephemeral: true });
        }

        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'setup') {
            const role = interaction.options.getRole('role');
            const channel = interaction.options.getChannel('channel');

            // Save to environment (you'll need to update .env manually for persistence)
            process.env.MC_ONLINE_ROLE_ID = role.id;
            process.env.MC_CONSOLE_CHANNEL_ID = channel.id;

            return interaction.reply({ 
                content: `✅ Minecraft sync configured!\n\n**Online Role:** ${role}\n**Console Channel:** ${channel}\n\n⚠️ **Important:** Add these to your \`.env\` file to make it permanent:\n\`\`\`\nMC_ONLINE_ROLE_ID=${role.id}\nMC_CONSOLE_CHANNEL_ID=${channel.id}\n\`\`\`\n\nThen restart the bot.`, 
                ephemeral: true 
            });
        }

        if (subcommand === 'add') {
            if (!process.env.MC_ONLINE_ROLE_ID) {
                return interaction.reply({ content: '❌ Minecraft sync not configured! Run `/mcsync setup` first.', ephemeral: true });
            }

            const user = interaction.options.getUser('user');
            const member = await interaction.guild.members.fetch(user.id);
            const role = interaction.guild.roles.cache.get(process.env.MC_ONLINE_ROLE_ID);

            if (!role) {
                return interaction.reply({ content: '❌ Online role not found! Please run setup again.', ephemeral: true });
            }

            await member.roles.add(role);

            return interaction.reply({ 
                content: `✅ Added ${role} to ${user}`, 
                ephemeral: true 
            });
        }

        if (subcommand === 'remove') {
            if (!process.env.MC_ONLINE_ROLE_ID) {
                return interaction.reply({ content: '❌ Minecraft sync not configured! Run `/mcsync setup` first.', ephemeral: true });
            }

            const user = interaction.options.getUser('user');
            const member = await interaction.guild.members.fetch(user.id);
            const role = interaction.guild.roles.cache.get(process.env.MC_ONLINE_ROLE_ID);

            if (!role) {
                return interaction.reply({ content: '❌ Online role not found! Please run setup again.', ephemeral: true });
            }

            await member.roles.remove(role);

            return interaction.reply({ 
                content: `✅ Removed ${role} from ${user}`, 
                ephemeral: true 
            });
        }

        if (subcommand === 'list') {
            if (!process.env.MC_ONLINE_ROLE_ID) {
                return interaction.reply({ content: '❌ Minecraft sync not configured! Run `/mcsync setup` first.', ephemeral: true });
            }

            const role = interaction.guild.roles.cache.get(process.env.MC_ONLINE_ROLE_ID);
            if (!role) {
                return interaction.reply({ content: '❌ Online role not found! Please run setup again.', ephemeral: true });
            }

            const members = role.members.map(m => m.user.tag).join('\n') || 'No one is online';

            return interaction.reply({ 
                content: `**🟢 Currently Online (${role.members.size}):**\n${members}`, 
                ephemeral: true 
            });
        }

        if (subcommand === 'disable') {
            delete process.env.MC_ONLINE_ROLE_ID;
            delete process.env.MC_CONSOLE_CHANNEL_ID;

            return interaction.reply({ 
                content: '✅ Minecraft sync disabled (for this session). Remove from `.env` to disable permanently.', 
                ephemeral: true 
            });
        }
    },
};
