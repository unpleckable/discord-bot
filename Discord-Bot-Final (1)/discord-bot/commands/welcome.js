const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('welcome')
        .setDescription('Configure welcome messages')
        .addSubcommand(subcommand =>
            subcommand
                .setName('test')
                .setDescription('Test the welcome message for yourself')),
    
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'test') {
            if (!process.env.WELCOME_CHANNEL_ID || !process.env.WELCOME_MESSAGE) {
                return interaction.reply({ 
                    content: '❌ Welcome system is not configured!\n\n**To set up:**\n1. Add to your `.env` file:\n```\nWELCOME_CHANNEL_ID=your_channel_id\nWELCOME_MESSAGE=Welcome {user} to {server}! We now have {memberCount} members!\n```\n2. Restart the bot\n3. New members will automatically get welcomed!', 
                    ephemeral: true 
                });
            }

            // Simulate welcome for the user
            let message = process.env.WELCOME_MESSAGE;
            message = message.replace('{user}', `${interaction.user}`);
            message = message.replace('{server}', interaction.guild.name);
            message = message.replace('{memberCount}', `${interaction.guild.memberCount}`);

            const embed = new EmbedBuilder()
                .setColor('#00ff00')
                .setTitle('👋 Welcome!')
                .setDescription(message)
                .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                .setFooter({ text: `Member #${interaction.guild.memberCount}` })
                .setTimestamp();

            return interaction.reply({ 
                content: '**This is what new members will see:**', 
                embeds: [embed], 
                ephemeral: true 
            });
        }
    },
};
