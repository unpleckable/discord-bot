# Quick Start Guide

Get your Discord bot up and running in 5 minutes!

## Step 1: Create a Discord Bot

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Give it a name and click "Create"
4. Go to the "Bot" tab
5. Click "Add Bot"
6. Under "Token", click "Reset Token" and copy it (you'll need this!)
7. Under "Privileged Gateway Intents", enable:
   - ✅ Presence Intent
   - ✅ Server Members Intent
   - ✅ Message Content Intent
8. Click "Save Changes"

## Step 2: Invite Bot to Your Server

1. Go to "OAuth2" → "URL Generator"
2. Select scopes:
   - ✅ `bot`
   - ✅ `applications.commands`
3. Select bot permissions:
   - ✅ Read Messages/View Channels
   - ✅ Send Messages
   - ✅ Manage Messages
   - ✅ Embed Links
   - ✅ Attach Files
   - ✅ Read Message History
   - ✅ Mention Everyone
   - ✅ Manage Channels
   - ✅ Kick Members
   - ✅ Ban Members
   - ✅ Moderate Members
4. Copy the generated URL at the bottom
5. Paste it in your browser and invite the bot to your server

## Step 3: Setup the Bot Files

1. Extract the bot files
2. Open a terminal in the bot folder
3. Install dependencies:
   ```bash
   npm install
   ```

## Step 4: Configure the Bot

1. Copy `.env.example` to `.env`
2. Edit `.env` and add your bot token:
   ```env
   DISCORD_TOKEN=paste_your_token_here
   CLIENT_ID=your_bot_client_id
   GUILD_ID=your_server_id
   ```

**How to get IDs:**
- Enable Developer Mode in Discord (Settings → Advanced → Developer Mode)
- **Client ID**: Copy from Developer Portal → General Information
- **Guild ID**: Right-click your server icon → Copy Server ID
- **Category ID**: Right-click a category → Copy Category ID
- **Role ID**: Server Settings → Roles → Right-click role → Copy Role ID

## Step 5: Deploy Commands

```bash
npm run deploy
```

You should see: `✅ Successfully reloaded X guild commands.`

## Step 6: Start the Bot

```bash
npm start
```

You should see:
```
✅ Logged in as YourBot#1234!
📊 Serving 1 servers
```

## Step 7: Test It!

In your Discord server, try these commands:

1. **Check if it's working:**
   ```
   /utility ping
   ```

2. **Setup tickets:**
   ```
   /ticket setup channel:#general
   ```
   Then click the button to test!

3. **Setup welcome messages:**
   ```
   /welcome setup channel:#welcome message:Welcome {user} to {server}!
   ```

4. **Test moderation:**
   ```
   /mod warn user:@someone reason:Testing
   ```

## 🎉 You're Done!

Your bot is now running! Here are some next steps:

### Optional Configuration

Add these to your `.env` for extra features:

```env
# Tickets will be created in this category
TICKET_CATEGORY_ID=your_category_id

# This role will be pinged in new tickets
SUPPORT_ROLE_ID=your_support_role_id
```

### Keep Bot Running 24/7

**Option 1: On your computer (testing only)**
- Just keep the terminal open
- Bot stops when you close the terminal

**Option 2: Free hosting (recommended)**
- [Railway.app](https://railway.app) - Free tier available
- [Render.com](https://render.com) - Free tier available
- [Heroku](https://heroku.com) - Paid (no longer free)

**Option 3: VPS (advanced)**
- DigitalOcean, Linode, AWS EC2
- Use PM2 to keep bot running: `npm install -g pm2 && pm2 start index.js`

## Troubleshooting

**Bot shows as offline?**
- Make sure `npm start` is running without errors
- Check your bot token is correct in `.env`

**Commands not showing?**
- Make sure you ran `npm run deploy`
- Wait a few seconds and restart Discord
- If using global commands (no GUILD_ID), wait up to 1 hour

**Permission errors?**
- Make sure the bot has all required permissions
- Check bot's role is higher than the roles it's trying to moderate

**Need help?**
Check the full README.md or create an issue!
