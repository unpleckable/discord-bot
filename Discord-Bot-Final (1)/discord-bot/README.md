# Discord Utility Bot - Professional Edition

A comprehensive, professional Discord bot with advanced tickets, moderation, utilities, and more!

## 🌟 Features

### 🎫 **Advanced Ticket System**
- **Multiple Categories:** General Support, Billing, Bug Reports, Suggestions, Other
- **Dropdown Menu:** Clean category selection interface
- **Ticket Management:** Claim, rename, add/remove users
- **Transcripts:** Export ticket conversations as text files
- **Professional UI:** Colored embeds with emojis and timestamps
- **Auto-tracking:** Prevents duplicate tickets per user
- **Support Role Pinging:** Automatically notifies your support team

### 🛡️ **Moderation Commands**
- **Kick/Ban/Unban** - Member management
- **Timeout** - Temporary mutes with duration
- **Warn** - Issue warnings with DM notifications
- **Clear** - Bulk delete messages (1-100)

### 🔧 **Utility Commands**
- **Ping** - Check bot latency
- **User Info** - Detailed user profiles
- **Server Info** - Server statistics
- **Avatar** - Display user avatars
- **Stats** - Comprehensive bot and server stats

### 📢 **Communication Tools**
- **Announcements** - Send formatted announcements with pings
- **Polls** - Create polls with up to 5 options
- **Custom Embeds** - Create beautiful custom embeds
- **Auto-Delete** - Remove messages from unverified users

### 👋 **Welcome System**
- Customizable welcome messages
- Embed format with user avatars
- Member count tracking
- Variable support ({user}, {server}, {memberCount})

## 📦 Installation

### Prerequisites
- Node.js 16.9.0 or higher
- A Discord Bot Token ([Discord Developer Portal](https://discord.com/developers/applications))

### Quick Setup

1. **Extract the bot files**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure the bot**
   - Copy `.env.example` to `.env`
   - Fill in your credentials:
   ```env
   DISCORD_TOKEN=your_bot_token_here
   CLIENT_ID=your_client_id_here
   GUILD_ID=your_guild_id_here
   ```

4. **Deploy commands**
   ```bash
   npm run deploy
   ```

5. **Start the bot**
   ```bash
   npm start
   ```

## 📋 All Commands

### 🎫 Ticket Commands
| Command | Description | Permission |
|---------|-------------|------------|
| `/ticket setup <channel>` | Setup ticket panel with categories | Administrator |
| `/ticket close [reason]` | Close current ticket | Anyone in ticket |
| `/ticket add <user>` | Add user to ticket | Anyone in ticket |
| `/ticket remove <user>` | Remove user from ticket | Anyone in ticket |
| `/ticket rename <n>` | Rename the ticket | Anyone in ticket |
| `/ticket claim` | Claim ticket as support agent | Manage Channels |
| `/ticket transcript` | Export ticket conversation | Anyone in ticket |

### 🛡️ Moderation Commands
| Command | Description | Permission |
|---------|-------------|------------|
| `/mod kick <user> [reason]` | Kick a member | Moderate Members |
| `/mod ban <user> [reason]` | Ban a member | Moderate Members |
| `/mod unban <userid>` | Unban a user | Moderate Members |
| `/mod timeout <user> <minutes> [reason]` | Timeout a member | Moderate Members |
| `/mod warn <user> <reason>` | Warn a member | Moderate Members |
| `/mod clear <amount>` | Delete messages (1-100) | Moderate Members |

### 🔧 Utility Commands
| Command | Description |
|---------|-------------|
| `/utility ping` | Check bot latency |
| `/utility userinfo [user]` | User information |
| `/utility serverinfo` | Server statistics |
| `/utility avatar [user]` | Get user avatar |
| `/stats` | Bot and server stats |

### 📢 Communication Commands
| Command | Description | Permission |
|---------|-------------|------------|
| `/announce <title> <message> [channel] [color] [ping]` | Send announcement | Administrator |
| `/poll <question> <option1> <option2> [...]` | Create a poll | Everyone |
| `/embed <title> <description> [options]` | Create custom embed | Manage Messages |

### 👋 Welcome Commands
| Command | Description | Permission |
|---------|-------------|------------|
| `/welcome setup <channel> <message>` | Setup welcomes | Administrator |
| `/welcome disable` | Disable welcomes | Administrator |

## 🎨 Ticket System Features

### Multiple Categories
Users select from:
- 🔧 **General Support** - Blue
- 💰 **Billing** - Orange
- 🐛 **Bug Report** - Red
- 💡 **Suggestions** - Green
- ❓ **Other** - Purple

### Professional Welcome Message
Each ticket opens with:
- Category icon and name
- User information
- Creation timestamp
- Status indicator
- Control buttons (Close, Claim, Transcript)

### Control Buttons
- 🔒 **Close** - Close and delete ticket (10s delay)
- ✋ **Claim** - Support agent claims ticket
- 📝 **Transcript** - Export conversation as .txt file

## 🔧 Configuration

### Required Environment Variables
```env
DISCORD_TOKEN=your_bot_token
CLIENT_ID=your_client_id
GUILD_ID=your_server_id
```

### Optional Configuration
```env
# Ticket System
TICKET_CATEGORY_ID=category_id_for_tickets
SUPPORT_ROLE_ID=role_to_ping_in_tickets

# Auto-Delete Messages (for unverified users)
PROTECTED_CHANNELS=channel_id_1,channel_id_2
REQUIRED_ROLE_ID=verified_role_id

# Server Whitelist (keep bot private)
ALLOWED_SERVERS=server_id_1,server_id_2
```

## 🎯 Bot Permissions Required

**Essential Permissions:**
- ✅ Read Messages/View Channels
- ✅ Send Messages
- ✅ Manage Messages
- ✅ Embed Links
- ✅ Attach Files
- ✅ Read Message History
- ✅ Add Reactions
- ✅ Mention Everyone
- ✅ Manage Channels (for tickets)
- ✅ Kick Members
- ✅ Ban Members
- ✅ Moderate Members

**Privileged Intents (Developer Portal):**
- ✅ Server Members Intent
- ✅ Message Content Intent
- ✅ Presence Intent

## 📊 Example Usage

### Setup Tickets
```
/ticket setup channel:#support
```
Users see a dropdown menu with 5 categories → Select category → Ticket created!

### Create Announcement
```
/announce title:Server Update message:We've added new features! channel:#announcements color:Blue ping:everyone
```

### Create Poll
```
/poll question:What should we add next? option1:Music Bot option2:Games option3:More Commands
```

### Generate Transcript
Click the 📝 Transcript button in any ticket, or use:
```
/ticket transcript
```

## 🐛 Troubleshooting

**Tickets not creating?**
- Bot needs "Manage Channels" permission
- Check TICKET_CATEGORY_ID is valid or empty
- Bot role must be high enough in role hierarchy

**Commands not showing?**
- Run `npm run deploy`
- Wait a few minutes for Discord to update
- Restart Discord client

**Auto-delete not working?**
- Bot needs "Message Content Intent" enabled
- Check PROTECTED_CHANNELS and REQUIRED_ROLE_ID
- Bot needs "Manage Messages" permission

See `TICKET_TROUBLESHOOTING.md` and other guides for detailed help!

## 📝 Documentation

- `README.md` - This file
- `QUICKSTART.md` - Step-by-step setup guide
- `TICKET_TROUBLESHOOTING.md` - Ticket system help
- `AUTO_DELETE_GUIDE.md` - Auto-delete configuration
- `PRIVATE_BOT_GUIDE.md` - Keep bot private

## 🎨 Customization

All colors, messages, and emojis can be customized by editing the command files in `/commands` and `/events`.

## 📜 License

MIT License - Free to use and modify!

---

**Made with ❤️ for amazing Discord communities**
