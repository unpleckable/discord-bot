# Discord Utility Bot

A comprehensive Discord bot with tickets, moderation, utilities, and welcome system.

## 🌟 Features

### 🎫 Ticket System
- Create support tickets with button click
- Add/remove users from tickets
- Close tickets with automatic deletion
- Configurable ticket categories and support roles

### 🛡️ Moderation
- **Kick** - Remove members from server
- **Ban/Unban** - Ban or unban members
- **Timeout** - Temporarily mute members
- **Warn** - Issue warnings to members
- **Clear** - Bulk delete messages (1-100)

### 🔧 Utility Commands
- **Ping** - Check bot latency
- **User Info** - Get detailed user information
- **Server Info** - Get server statistics
- **Avatar** - Display user avatars

### 👋 Welcome System
- Customizable welcome messages
- Mention users and display server info
- Configurable welcome channel

## 📦 Installation

### Prerequisites
- Node.js 16.9.0 or higher
- A Discord Bot Token ([Discord Developer Portal](https://discord.com/developers/applications))

### Setup Steps

1. **Clone or download this repository**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure the bot**
   - Copy `.env.example` to `.env`
   - Fill in your bot token and IDs:
   ```env
   DISCORD_TOKEN=your_bot_token_here
   CLIENT_ID=your_client_id_here
   GUILD_ID=your_guild_id_here (optional, for faster testing)
   
   # Optional configurations
   TICKET_CATEGORY_ID=category_id_for_tickets
   SUPPORT_ROLE_ID=support_role_id
   ```

4. **Deploy slash commands**
   ```bash
   npm run deploy
   ```

5. **Start the bot**
   ```bash
   npm start
   ```

   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

## 📋 Commands

### Ticket Commands
| Command | Description |
|---------|-------------|
| `/ticket setup` | Setup the ticket panel in a channel |
| `/ticket close` | Close the current ticket |
| `/ticket add <user>` | Add a user to the ticket |
| `/ticket remove <user>` | Remove a user from the ticket |

### Moderation Commands
| Command | Description | Permission Required |
|---------|-------------|-------------------|
| `/mod kick <user> [reason]` | Kick a member | Moderate Members |
| `/mod ban <user> [reason]` | Ban a member | Moderate Members |
| `/mod unban <userid>` | Unban a user | Moderate Members |
| `/mod timeout <user> <minutes> [reason]` | Timeout a member | Moderate Members |
| `/mod warn <user> <reason>` | Warn a member | Moderate Members |
| `/mod clear <amount>` | Delete messages | Moderate Members |

### Utility Commands
| Command | Description |
|---------|-------------|
| `/utility ping` | Check bot latency |
| `/utility userinfo [user]` | Get user information |
| `/utility serverinfo` | Get server information |
| `/utility avatar [user]` | Get user avatar |

### Welcome Commands
| Command | Description | Permission Required |
|---------|-------------|-------------------|
| `/welcome setup <channel> <message>` | Setup welcome messages | Administrator |
| `/welcome disable` | Disable welcome messages | Administrator |

**Welcome Message Variables:**
- `{user}` - Mentions the new member
- `{server}` - Server name
- `{memberCount}` - Total member count

## 🎨 Bot Permissions

The bot needs the following permissions:
- Read Messages/View Channels
- Send Messages
- Manage Messages
- Embed Links
- Attach Files
- Read Message History
- Mention Everyone
- Manage Channels (for tickets)
- Kick Members
- Ban Members
- Moderate Members (for timeout)

## 📁 Project Structure

```
discord-bot/
├── commands/           # Slash commands
│   ├── ticket.js      # Ticket system
│   ├── mod.js         # Moderation commands
│   ├── utility.js     # Utility commands
│   └── welcome.js     # Welcome system
├── events/            # Event handlers
│   ├── ready.js       # Bot ready event
│   ├── interactionCreate.js  # Command & button handler
│   └── guildMemberAdd.js     # Welcome messages
├── index.js           # Main bot file
├── deploy-commands.js # Command deployment
├── package.json       # Dependencies
└── .env              # Configuration (create from .env.example)
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DISCORD_TOKEN` | Your bot token | ✅ Yes |
| `CLIENT_ID` | Your bot's client ID | ✅ Yes |
| `GUILD_ID` | Server ID for testing | ⚠️ Optional |
| `TICKET_CATEGORY_ID` | Category for ticket channels | ⚠️ Optional |
| `SUPPORT_ROLE_ID` | Role to ping in tickets | ⚠️ Optional |

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Deploy to Heroku
1. Create a Heroku app
2. Add Node.js buildpack
3. Set config vars (environment variables)
4. Deploy from Git

### Deploy to Railway/Render
1. Connect your GitHub repo
2. Set environment variables
3. Deploy automatically

## 🐛 Troubleshooting

**Commands not showing up?**
- Make sure you ran `npm run deploy`
- If using `GUILD_ID`, commands only appear in that server
- Global commands can take up to 1 hour to update

**Bot not responding?**
- Check if the bot is online in your server
- Verify the bot has necessary permissions
- Check console for error messages

**Tickets not working?**
- Make sure bot has "Manage Channels" permission
- Set `TICKET_CATEGORY_ID` in .env if you want tickets in a specific category
- Bot needs permission to create channels in the category

## 📝 License

MIT License - feel free to use this bot for your own servers!

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

## ⚙️ Support

If you need help, create an issue in the repository or join our support server (add your own support server link here).
