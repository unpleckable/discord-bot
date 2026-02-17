const { Events, ChannelType, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

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

        // Handle button interactions (for tickets)
        if (interaction.isButton()) {
            if (interaction.customId === 'create_ticket') {
                const guild = interaction.guild;
                const member = interaction.member;

                // Check if user already has a ticket
                const existingTicket = guild.channels.cache.find(
                    channel => channel.name === `ticket-${member.user.username.toLowerCase()}`
                );

                if (existingTicket) {
                    return interaction.reply({ 
                        content: `❌ You already have an open ticket: ${existingTicket}`, 
                        ephemeral: true 
                    });
                }

                // Create ticket channel
                const ticketChannel = await guild.channels.create({
                    name: `ticket-${member.user.username}`,
                    type: ChannelType.GuildText,
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
                            ],
                        },
                        {
                            id: interaction.client.user.id,
                            allow: [
                                PermissionFlagsBits.ViewChannel,
                                PermissionFlagsBits.SendMessages,
                                PermissionFlagsBits.ReadMessageHistory,
                            ],
                        },
                    ],
                });

                // Add support role if configured
                if (process.env.SUPPORT_ROLE_ID) {
                    await ticketChannel.permissionOverwrites.create(process.env.SUPPORT_ROLE_ID, {
                        ViewChannel: true,
                        SendMessages: true,
                        ReadMessageHistory: true,
                    });
                }

                const embed = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle('🎫 Support Ticket')
                    .setDescription(`Welcome ${member}!\n\nPlease describe your issue and our support team will assist you shortly.`)
                    .setFooter({ text: 'Click the button below to close this ticket' })
                    .setTimestamp();

                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('close_ticket')
                            .setLabel('🔒 Close Ticket')
                            .setStyle(ButtonStyle.Danger)
                    );

                await ticketChannel.send({ 
                    content: process.env.SUPPORT_ROLE_ID ? `<@&${process.env.SUPPORT_ROLE_ID}>` : '',
                    embeds: [embed], 
                    components: [row] 
                });

                return interaction.reply({ 
                    content: `✅ Ticket created: ${ticketChannel}`, 
                    ephemeral: true 
                });
            }

            if (interaction.customId === 'close_ticket') {
                if (!interaction.channel.name.startsWith('ticket-')) {
                    return interaction.reply({ content: '❌ This is not a ticket channel!', ephemeral: true });
                }

                const embed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('🔒 Ticket Closing')
                    .setDescription(`Ticket closed by ${interaction.user}\n\nThis channel will be deleted in 5 seconds.`)
                    .setTimestamp();

                await interaction.reply({ embeds: [embed] });

                setTimeout(async () => {
                    await interaction.channel.delete();
                }, 5000);
            }
        }
    },
};
