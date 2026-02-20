# How to Prevent Others from Adding Your Bot

There are two ways to keep your bot private:

## ✅ Method 1: Disable Public Bot (EASIEST - RECOMMENDED)

This is the **simplest and most effective** way.

### Steps:
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click on your bot application
3. Go to the **"Bot"** tab (left sidebar)
4. Scroll down to **"Authorization Flow"** section
5. **UNCHECK** the box that says **"Public Bot"**
6. Click **"Save Changes"**

### What this does:
- ✅ **Only YOU** (the bot owner) can invite the bot
- ✅ Invite links won't work for anyone else
- ✅ No code changes needed
- ✅ Bot immediately becomes private

**This is all you need!** Once "Public Bot" is unchecked, nobody else can add your bot.

---

## ⚡ Method 2: Server Whitelist in Code (EXTRA SECURITY)

If you want **extra protection** and want the bot to auto-leave unauthorized servers:

### Step 1: Replace `index.js`

Replace your current `index.js` with this version that has whitelist protection:

```javascript
const { Client, GatewayIntentBits, Collection, Partials } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.DirectMessages,
    ],
    partials: [Partials.Channel, Partials.Message],
});

// Collections for commands
client.commands = new Collection();
client.cooldowns = new Collection();

// Whitelist of allowed server IDs
const ALLOWED_SERVERS = process.env.ALLOWED_SERVERS 
    ? process.env.ALLOWED_SERVERS.split(',') 
    : [];

// Check if bot is added to an unauthorized server
client.on('guildCreate', async (guild) => {
    // If whitelist is enabled and server is not allowed
    if (ALLOWED_SERVERS.length > 0 && !ALLOWED_SERVERS.includes(guild.id)) {
        console.log(`⚠️ Bot added to unauthorized server: ${guild.name} (${guild.id})`);
        console.log(`🚫 Leaving server...`);
        
        // Try to notify the server owner
        try {
            const owner = await guild.fetchOwner();
            await owner.send('⚠️ This bot is private and can only be used in authorized servers. The bot has left your server.');
        } catch (error) {
            // Owner has DMs disabled
        }
        
        // Leave the server
        await guild.leave();
        console.log(`✅ Left unauthorized server: ${guild.name}`);
    } else {
        console.log(`✅ Bot added to server: ${guild.name} (${guild.id})`);
    }
});

// Load command files
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        console.log(`✅ Loaded command: ${command.data.name}`);
    } else {
        console.log(`⚠️  Command at ${filePath} is missing required "data" or "execute" property.`);
    }
}

// Load event files
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
    console.log(`✅ Loaded event: ${event.name}`);
}

// Login to Discord
client.login(process.env.DISCORD_TOKEN);
```

### Step 2: Add to your `.env` file

Add this line to your `.env`:

```env
# List of allowed server IDs (comma-separated, no spaces)
ALLOWED_SERVERS=123456789012345678,987654321098765432
```

**Replace with YOUR server IDs:**
- Right-click your server icon → **Copy Server ID**
- If you have multiple servers, separate with commas (no spaces!)

### Step 3: Restart the bot

```bash
npm start
```

### What this does:
- ✅ Bot checks every server it joins
- ✅ If server ID is NOT in the whitelist → bot auto-leaves
- ✅ Sends a DM to the server owner explaining why
- ✅ Logs the action in console

---

## 🏆 Recommended Approach

**Just use Method 1** (Disable Public Bot). It's simpler and works perfectly.

**Only use Method 2 if:**
- You want to be EXTRA cautious
- You want logs when someone tries to add it
- You want automatic removal from unauthorized servers

---

## Testing It Works

### Test Method 1:
1. Disable "Public Bot" in Developer Portal
2. Share your bot invite link with a friend
3. They try to add it → Should get an error
4. ✅ Success!

### Test Method 2:
1. Add whitelist to `.env` with only YOUR server ID
2. Create a second Discord account
3. Create a test server with that account
4. Try to add the bot there
5. Bot should join, then immediately leave
6. ✅ Success!

---

## ⚠️ Important Notes

- **Method 1** prevents invites BEFORE they happen
- **Method 2** removes the bot AFTER it joins an unauthorized server
- Using **BOTH** together = maximum security
- If you're the only one who needs the bot, **Method 1 alone is perfect**

---

## FAQ

**Q: Can someone still see my bot?**
A: They can see it exists if they have a direct link, but they can't add it.

**Q: What if I want to add it to multiple servers?**
A: Add all server IDs to `ALLOWED_SERVERS`, separated by commas.

**Q: Can I make it public later?**
A: Yes! Just re-enable "Public Bot" in Developer Portal and remove/empty `ALLOWED_SERVERS`.

**Q: Do I need both methods?**
A: No. Method 1 (Disable Public Bot) is enough for most people.

---

**That's it!** Your bot is now private. 🔒
