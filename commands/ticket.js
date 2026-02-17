const { SlashCommandBuilder, ChannelType, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Ticket system commands')
        .addSubcommand(subcommand =>
            subcommand
                .setName('setup')
                .setDescription('Setup the ticket system')
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('Channel to send the ticket panel')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('close')
                .setDescription('Close the current ticket'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Add a user to the ticket')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('User to add')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Remove a user from the ticket')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('User to remove')
                        .setRequired(true))),
    
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'setup') {
            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                return interaction.reply({ content: '❌ You need Administrator permission to use this command.', ephemeral: true });
            }

            const channel = interaction.options.getChannel('channel');

            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('🎫 Support Tickets')
                .setDescription('Need help? Click the button below to create a support ticket.\n\nOur team will assist you as soon as possible!')
                .setFooter({ text: 'Click the button to open a ticket' })
                .setTimestamp();

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('create_ticket')
                        .setLabel('📩 Create Ticket')
                        .setStyle(ButtonStyle.Primary)
                );

            await channel.send({ embeds: [embed], components: [row] });
            return interaction.reply({ content: `✅ Ticket panel created in ${channel}`, ephemeral: true });
        }

        if (subcommand === 'close') {
            if (!interaction.channel.name.startsWith('ticket-')) {
                return interaction.reply({ content: '❌ This is not a ticket channel!', ephemeral: true });
            }

            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('🔒 Ticket Closed')
                .setDescription(`Ticket closed by ${interaction.user.tag}`)
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

            setTimeout(async () => {
                await interaction.channel.delete();
            }, 5000);
        }

        if (subcommand === 'add') {
            if (!interaction.channel.name.startsWith('ticket-')) {
                return interaction.reply({ content: '❌ This is not a ticket channel!', ephemeral: true });
            }

            const user = interaction.options.getUser('user');
            await interaction.channel.permissionOverwrites.create(user, {
                ViewChannel: true,
                SendMessages: true,
                ReadMessageHistory: true
            });

            return interaction.reply({ content: `✅ Added ${user} to the ticket.` });
        }

        if (subcommand === 'remove') {
            if (!interaction.channel.name.startsWith('ticket-')) {
                return interaction.reply({ content: '❌ This is not a ticket channel!', ephemeral: true });
            }

            const user = interaction.options.getUser('user');
            await interaction.channel.permissionOverwrites.delete(user);

            return interaction.reply({ content: `✅ Removed ${user} from the ticket.` });
        }
    },
};
