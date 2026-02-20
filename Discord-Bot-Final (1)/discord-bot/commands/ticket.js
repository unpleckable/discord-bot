const { SlashCommandBuilder, ChannelType, PermissionFlagsBits, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Advanced ticket system commands')
        .addSubcommand(subcommand =>
            subcommand
                .setName('setup')
                .setDescription('Setup the ticket system with categories')
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('Channel to send the ticket panel')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('close')
                .setDescription('Close the current ticket')
                .addStringOption(option =>
                    option.setName('reason')
                        .setDescription('Reason for closing')
                        .setRequired(false)))
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
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('rename')
                .setDescription('Rename the ticket channel')
                .addStringOption(option =>
                    option.setName('name')
                        .setDescription('New name for the ticket')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('claim')
                .setDescription('Claim this ticket'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('transcript')
                .setDescription('Generate a transcript of this ticket')),
    
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'setup') {
            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                return interaction.reply({ content: '❌ You need Administrator permission to use this command.', ephemeral: true });
            }

            const channel = interaction.options.getChannel('channel');

            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('🎫 Create a Support Ticket')
                .setDescription('Need help? Select a category below to create a support ticket.\n\n**Available Categories:**\n\n🔧 **General Support** - General questions and issues\n💰 **Billing** - Payment and subscription issues\n🐛 **Bug Report** - Report bugs or glitches\n💡 **Suggestions** - Share your ideas\n❓ **Other** - Everything else\n\n*Our team will respond as soon as possible!*')
                .setFooter({ text: 'Select a category to create your ticket' })
                .setTimestamp();

            const row = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('ticket_category')
                        .setPlaceholder('📋 Select a ticket category')
                        .addOptions([
                            {
                                label: 'General Support',
                                description: 'General questions and issues',
                                value: 'general',
                                emoji: '🔧'
                            },
                            {
                                label: 'Billing',
                                description: 'Payment and subscription issues',
                                value: 'billing',
                                emoji: '💰'
                            },
                            {
                                label: 'Bug Report',
                                description: 'Report bugs or glitches',
                                value: 'bug',
                                emoji: '🐛'
                            },
                            {
                                label: 'Suggestions',
                                description: 'Share your ideas',
                                value: 'suggestion',
                                emoji: '💡'
                            },
                            {
                                label: 'Other',
                                description: 'Everything else',
                                value: 'other',
                                emoji: '❓'
                            }
                        ])
                );

            await channel.send({ embeds: [embed], components: [row] });
            return interaction.reply({ content: `✅ Ticket panel created in ${channel}`, ephemeral: true });
        }

        if (subcommand === 'close') {
            if (!interaction.channel.name.startsWith('ticket-')) {
                return interaction.reply({ content: '❌ This command can only be used in ticket channels!', ephemeral: true });
            }

            const reason = interaction.options.getString('reason') || 'No reason provided';

            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('🔒 Ticket Closing')
                .setDescription(`This ticket is being closed by ${interaction.user}`)
                .addFields(
                    { name: 'Closed by', value: `${interaction.user.tag}`, inline: true },
                    { name: 'Reason', value: reason, inline: true }
                )
                .setFooter({ text: 'This channel will be deleted in 10 seconds' })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

            setTimeout(async () => {
                try {
                    await interaction.channel.delete();
                } catch (error) {
                    console.error('Error deleting ticket channel:', error);
                }
            }, 10000);
        }

        if (subcommand === 'add') {
            if (!interaction.channel.name.startsWith('ticket-')) {
                return interaction.reply({ content: '❌ This command can only be used in ticket channels!', ephemeral: true });
            }

            const user = interaction.options.getUser('user');
            await interaction.channel.permissionOverwrites.create(user, {
                ViewChannel: true,
                SendMessages: true,
                ReadMessageHistory: true,
                AttachFiles: true,
                EmbedLinks: true
            });

            const embed = new EmbedBuilder()
                .setColor('#00ff00')
                .setDescription(`✅ ${user} has been added to this ticket by ${interaction.user}`)
                .setTimestamp();

            return interaction.reply({ embeds: [embed] });
        }

        if (subcommand === 'remove') {
            if (!interaction.channel.name.startsWith('ticket-')) {
                return interaction.reply({ content: '❌ This command can only be used in ticket channels!', ephemeral: true });
            }

            const user = interaction.options.getUser('user');
            
            // Don't allow removing the ticket creator
            if (interaction.channel.topic && interaction.channel.topic.includes(user.id)) {
                return interaction.reply({ content: '❌ You cannot remove the ticket creator!', ephemeral: true });
            }

            await interaction.channel.permissionOverwrites.delete(user);

            const embed = new EmbedBuilder()
                .setColor('#ff9900')
                .setDescription(`🚫 ${user} has been removed from this ticket by ${interaction.user}`)
                .setTimestamp();

            return interaction.reply({ embeds: [embed] });
        }

        if (subcommand === 'rename') {
            if (!interaction.channel.name.startsWith('ticket-')) {
                return interaction.reply({ content: '❌ This command can only be used in ticket channels!', ephemeral: true });
            }

            const newName = interaction.options.getString('name');
            const cleanName = newName.toLowerCase().replace(/[^a-z0-9-]/g, '-');
            
            await interaction.channel.setName(`ticket-${cleanName}`);

            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setDescription(`✏️ Ticket renamed to **ticket-${cleanName}** by ${interaction.user}`)
                .setTimestamp();

            return interaction.reply({ embeds: [embed] });
        }

        if (subcommand === 'claim') {
            if (!interaction.channel.name.startsWith('ticket-')) {
                return interaction.reply({ content: '❌ This command can only be used in ticket channels!', ephemeral: true });
            }

            if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
                return interaction.reply({ content: '❌ You need Manage Channels permission to claim tickets!', ephemeral: true });
            }

            const embed = new EmbedBuilder()
                .setColor('#00ff00')
                .setTitle('✅ Ticket Claimed')
                .setDescription(`This ticket has been claimed by ${interaction.user}`)
                .addFields(
                    { name: 'Support Agent', value: `${interaction.user.tag}`, inline: true },
                    { name: 'Claimed At', value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true }
                )
                .setTimestamp();

            return interaction.reply({ embeds: [embed] });
        }

        if (subcommand === 'transcript') {
            if (!interaction.channel.name.startsWith('ticket-')) {
                return interaction.reply({ content: '❌ This command can only be used in ticket channels!', ephemeral: true });
            }

            await interaction.deferReply({ ephemeral: true });

            try {
                // Fetch messages
                const messages = await interaction.channel.messages.fetch({ limit: 100 });
                const sortedMessages = Array.from(messages.values()).reverse();

                // Create transcript
                let transcript = `Ticket Transcript - ${interaction.channel.name}\n`;
                transcript += `Generated: ${new Date().toLocaleString()}\n`;
                transcript += `Total Messages: ${sortedMessages.length}\n`;
                transcript += `${'='.repeat(50)}\n\n`;

                for (const msg of sortedMessages) {
                    const timestamp = msg.createdAt.toLocaleString();
                    const author = msg.author.tag;
                    const content = msg.content || '[Embed/Attachment]';
                    transcript += `[${timestamp}] ${author}: ${content}\n`;
                }

                // Save to buffer
                const buffer = Buffer.from(transcript, 'utf-8');

                await interaction.editReply({
                    content: '✅ Transcript generated!',
                    files: [{
                        attachment: buffer,
                        name: `transcript-${interaction.channel.name}-${Date.now()}.txt`
                    }]
                });

            } catch (error) {
                console.error('Error generating transcript:', error);
                await interaction.editReply({ content: '❌ Failed to generate transcript.' });
            }
        }
    },
};
