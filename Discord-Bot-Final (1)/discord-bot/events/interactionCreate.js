const { Events, ChannelType, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

// Category emojis and descriptions
const categoryInfo = {
    general: { emoji: '🔧', name: 'General Support', color: '#0099ff' },
    billing: { emoji: '💰', name: 'Billing', color: '#ffaa00' },
    bug: { emoji: '🐛', name: 'Bug Report', color: '#ff0000' },
    suggestion: { emoji: '💡', name: 'Suggestions', color: '#00ff00' },
    other: { emoji: '❓', name: 'Other', color: '#9900ff' }
};

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        // Handle slash commands
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: '❌ There was an error while executing this command!', ephemeral: true });
                } else {
                    await interaction.reply({ content: '❌ There was an error while executing this command!', ephemeral: true });
                }
            }
        }

        // Handle select menu interactions (for ticket categories)
        if (interaction.isStringSelectMenu()) {
            if (interaction.customId === 'ticket_category') {
                try {
                    await interaction.deferReply({ ephemeral: true });

                    const category = interaction.values[0];
                    const guild = interaction.guild;
                    const member = interaction.member;

                    // Check if user already has a ticket
                    const existingTicket = guild.channels.cache.find(
                        channel => channel.name.startsWith('ticket-') && 
                                 channel.topic && channel.topic.includes(`User: ${member.user.id}`)
                    );

                    if (existingTicket) {
                        return interaction.editReply({ 
                            content: `❌ You already have an open ticket: ${existingTicket}` 
                        });
                    }

                    const categoryData = categoryInfo[category] || categoryInfo.other;
                    const cleanUsername = member.user.username.toLowerCase().replace(/[^a-z0-9]/g, '');

                    console.log(`Creating ${category} ticket for ${member.user.tag}...`);

                    // Create ticket channel
                    const ticketChannel = await guild.channels.create({
                        name: `ticket-${cleanUsername}`,
                        type: ChannelType.GuildText,
                        topic: `${categoryData.emoji} ${categoryData.name} | User: ${member.user.id} | Created: ${Date.now()}`,
                        parent: process.env.TICKET_CATEGORY_ID || null,
                        permissionOverwrites: [
                            {
                                id: guild.id,
                                deny: [PermissionFlagsBits.ViewChannel],
                            },
                            {
                                id: member.id,
                                allow: [
                                    PermissionFlagsBits.ViewChannel,
                                    PermissionFlagsBits.SendMessages,
                                    PermissionFlagsBits.ReadMessageHistory,
                                    PermissionFlagsBits.AttachFiles,
                                    PermissionFlagsBits.EmbedLinks,
                                ],
                            },
                            {
                                id: interaction.client.user.id,
                                allow: [
                                    PermissionFlagsBits.ViewChannel,
                                    PermissionFlagsBits.SendMessages,
                                    PermissionFlagsBits.ReadMessageHistory,
                                    PermissionFlagsBits.ManageChannels,
                                    PermissionFlagsBits.ManageMessages,
                                ],
                            },
                        ],
                    });

                    console.log(`✅ Ticket channel created: ${ticketChannel.name}`);

                    // Add support role if configured
                    if (process.env.SUPPORT_ROLE_ID) {
                        try {
                            await ticketChannel.permissionOverwrites.create(process.env.SUPPORT_ROLE_ID, {
                                ViewChannel: true,
                                SendMessages: true,
                                ReadMessageHistory: true,
                            });
                        } catch (error) {
                            console.log('⚠️ Could not add support role');
                        }
                    }

                    // Create welcome embed
                    const welcomeEmbed = new EmbedBuilder()
                        .setColor(categoryData.color)
                        .setTitle(`${categoryData.emoji} ${categoryData.name} Ticket`)
                        .setDescription(`Welcome ${member}!\n\n**Thank you for contacting support.**\n\nPlease describe your issue in detail and our team will assist you as soon as possible.\n\n*This ticket was created <t:${Math.floor(Date.now() / 1000)}:R>*`)
                        .addFields(
                            { name: '📋 Category', value: categoryData.name, inline: true },
                            { name: '👤 Created By', value: member.user.tag, inline: true },
                            { name: '⏰ Status', value: '🟡 Waiting for support', inline: true }
                        )
                        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                        .setFooter({ text: 'Use the buttons below to manage this ticket' })
                        .setTimestamp();

                    // Create control buttons
                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('close_ticket')
                                .setLabel('Close Ticket')
                                .setEmoji('🔒')
                                .setStyle(ButtonStyle.Danger),
                            new ButtonBuilder()
                                .setCustomId('claim_ticket')
                                .setLabel('Claim')
                                .setEmoji('✋')
                                .setStyle(ButtonStyle.Success),
                            new ButtonBuilder()
                                .setCustomId('transcript_ticket')
                                .setLabel('Transcript')
                                .setEmoji('📝')
                                .setStyle(ButtonStyle.Secondary)
                        );

                    await ticketChannel.send({ 
                        content: process.env.SUPPORT_ROLE_ID ? `<@&${process.env.SUPPORT_ROLE_ID}> New ticket created!` : `${member}`,
                        embeds: [welcomeEmbed], 
                        components: [row] 
                    });

                    return interaction.editReply({ 
                        content: `✅ Ticket created: ${ticketChannel}` 
                    });

                } catch (error) {
                    console.error('Error creating ticket:', error);
                    
                    const errorMessage = '❌ Failed to create ticket. Please make sure the bot has "Manage Channels" permission.';
                    if (interaction.deferred) {
                        return interaction.editReply({ content: errorMessage });
                    } else {
                        return interaction.reply({ content: errorMessage, ephemeral: true });
                    }
                }
            }
        }

        // Handle button interactions
        if (interaction.isButton()) {
            if (interaction.customId === 'close_ticket') {
                try {
                    if (!interaction.channel.name.startsWith('ticket-')) {
                        return interaction.reply({ content: '❌ This is not a ticket channel!', ephemeral: true });
                    }

                    const embed = new EmbedBuilder()
                        .setColor('#ff0000')
                        .setTitle('🔒 Ticket Closing')
                        .setDescription(`This ticket is being closed by ${interaction.user}`)
                        .addFields(
                            { name: 'Closed By', value: interaction.user.tag, inline: true },
                            { name: 'Closed At', value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true }
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

                } catch (error) {
                    console.error('Error closing ticket:', error);
                }
            }

            if (interaction.customId === 'claim_ticket') {
                try {
                    if (!interaction.channel.name.startsWith('ticket-')) {
                        return interaction.reply({ content: '❌ This is not a ticket channel!', ephemeral: true });
                    }

                    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
                        return interaction.reply({ content: '❌ You need Manage Channels permission to claim tickets!', ephemeral: true });
                    }

                    const embed = new EmbedBuilder()
                        .setColor('#00ff00')
                        .setTitle('✅ Ticket Claimed')
                        .setDescription(`This ticket has been claimed by ${interaction.user}`)
                        .addFields(
                            { name: '👤 Support Agent', value: interaction.user.tag, inline: true },
                            { name: '⏰ Claimed At', value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true },
                            { name: '📊 Status', value: '🟢 Being handled', inline: true }
                        )
                        .setTimestamp();

                    await interaction.reply({ embeds: [embed] });

                } catch (error) {
                    console.error('Error claiming ticket:', error);
                }
            }

            if (interaction.customId === 'transcript_ticket') {
                try {
                    if (!interaction.channel.name.startsWith('ticket-')) {
                        return interaction.reply({ content: '❌ This is not a ticket channel!', ephemeral: true });
                    }

                    await interaction.deferReply({ ephemeral: true });

                    // Fetch messages
                    const messages = await interaction.channel.messages.fetch({ limit: 100 });
                    const sortedMessages = Array.from(messages.values()).reverse();

                    // Create transcript
                    let transcript = `╔══════════════════════════════════════════════╗\n`;
                    transcript += `║     TICKET TRANSCRIPT - ${interaction.channel.name.toUpperCase()}\n`;
                    transcript += `╚══════════════════════════════════════════════╝\n\n`;
                    transcript += `Generated: ${new Date().toLocaleString()}\n`;
                    transcript += `Channel: ${interaction.channel.name}\n`;
                    transcript += `Total Messages: ${sortedMessages.length}\n`;
                    transcript += `${'═'.repeat(50)}\n\n`;

                    for (const msg of sortedMessages) {
                        const timestamp = msg.createdAt.toLocaleString();
                        const author = `${msg.author.tag} (${msg.author.id})`;
                        const content = msg.content || '[Embed/Attachment/System Message]';
                        
                        transcript += `┌─ [${timestamp}]\n`;
                        transcript += `│ 👤 ${author}\n`;
                        transcript += `└─ ${content}\n\n`;
                    }

                    transcript += `${'═'.repeat(50)}\n`;
                    transcript += `End of transcript\n`;

                    // Save to buffer
                    const buffer = Buffer.from(transcript, 'utf-8');

                    await interaction.editReply({
                        content: '✅ Transcript generated successfully!',
                        files: [{
                            attachment: buffer,
                            name: `transcript-${interaction.channel.name}-${Date.now()}.txt`
                        }]
                    });

                } catch (error) {
                    console.error('Error generating transcript:', error);
                    if (interaction.deferred) {
                        await interaction.editReply({ content: '❌ Failed to generate transcript.' });
                    }
                }
            }
        }
    },
};
