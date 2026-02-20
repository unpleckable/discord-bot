# Welcome System Setup Guide

The welcome system automatically sends a message when new members join your server.

## ✅ Quick Setup (3 Steps)

### Step 1: Get Your Welcome Channel ID

1. Enable **Developer Mode** in Discord:
   - Settings → Advanced → Developer Mode (toggle ON)

2. Right-click your **welcome channel** (e.g., #welcome, #general)

3. Click **"Copy Channel ID"**

### Step 2: Configure `.env`

Add these lines to your `.env` file:

```env
# Welcome System
WELCOME_CHANNEL_ID=paste_your_channel_id_here
WELCOME_MESSAGE=Welcome {user} to {server}! We now have {memberCount} members!
```

**Variables you can use:**
- `{user}` - Mentions the new member (@Username)
- `{server}` - Server name
- `{memberCount}` - Total member count

**Example messages:**
```env
# Simple
WELCOME_MESSAGE=Welcome {user} to {server}!

# Detailed
WELCOME_MESSAGE=Hey {user}! Welcome to **{server}**! 🎉 You're member #{memberCount}! Make sure to read the rules!

# Fun
WELCOME_MESSAGE=🎊 {user} just landed in {server}! Say hi! We're now {memberCount} strong!

# Professional
WELCOME_MESSAGE=Welcome {user} to {server}. Please review our server guidelines and introduce yourself!
```

### Step 3: Restart Bot

```bash
npm start
```

---

## 🧪 Test It Works

### Method 1: Test Command
```
/welcome test
```
Shows you exactly what new members will see!

### Method 2: Invite Alt Account
1. Create a second Discord account (or use a friend)
2. Invite them to your server
3. Check if welcome message appears

### Method 3: Check Console
When a new member joins, you should see:
```
✅ Welcome message sent for Username#1234
```

---

## 🎨 Customization

The welcome message is displayed as a **beautiful embed** with:
- ✅ Green color (#00ff00)
- ✅ "👋 Welcome!" title
- ✅ Member's avatar as thumbnail
- ✅ "Member #X" footer
- ✅ Timestamp

**To change the embed appearance**, edit `/events/guildMemberAdd.js`:

```javascript
const embed = new EmbedBuilder()
    .setColor('#00ff00')  // Change color here (hex code)
    .setTitle('👋 Welcome!')  // Change title here
    .setDescription(message)
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
    .setFooter({ text: `Member #${member.guild.memberCount}` })
    .setTimestamp();
```

---

## 🐛 Troubleshooting

### Welcome messages not sending?

**Check #1: Is it configured?**
```bash
# Make sure these are in your .env:
WELCOME_CHANNEL_ID=123456789012345678
WELCOME_MESSAGE=Welcome {user} to {server}!
```

**Check #2: Is the channel ID correct?**
- Right-click channel → Copy Channel ID
- Make sure it matches the ID in `.env`
- Channel must exist in the server

**Check #3: Does bot have permission?**
- Bot needs "Send Messages" permission in welcome channel
- Bot needs "Embed Links" permission
- Check bot's role has these permissions

**Check #4: Restart bot after .env changes**
```bash
# Stop bot (Ctrl+C)
npm start
```

**Check #5: Look at console**
When someone joins, you should see:
```
✅ Welcome message sent for Username#1234
```

If you see:
```
⚠️ Welcome system not configured
```
→ Add WELCOME_CHANNEL_ID and WELCOME_MESSAGE to .env

```
⚠️ Welcome channel not found: 123456789
```
→ Channel ID is wrong or channel was deleted

```
❌ Error sending welcome message: Missing Permissions
```
→ Bot doesn't have Send Messages or Embed Links permission

### Test command not working?

Make sure you deployed commands:
```bash
npm run deploy
```

Then restart Discord and try `/welcome test` again.

### Variables not replacing?

Make sure you're using the **exact variable names**:
- ✅ `{user}` - correct
- ❌ `{username}` - wrong
- ❌ `{member}` - wrong

- ✅ `{server}` - correct
- ❌ `{guild}` - wrong
- ❌ `{servername}` - wrong

- ✅ `{memberCount}` - correct (note the capital C!)
- ❌ `{membercount}` - wrong
- ❌ `{members}` - wrong

---

## 💡 Pro Tips

### 1. Use Emojis
```env
WELCOME_MESSAGE=🎉 Welcome {user}! 👋 Enjoy your stay in {server}!
```

### 2. Multi-line Messages
Use `\n` for line breaks:
```env
WELCOME_MESSAGE=Welcome {user}!\n\nWe're glad you're here! 🎊\n\nCheck out our rules and have fun!
```

### 3. Ping Roles
```env
WELCOME_MESSAGE=Welcome {user}! <@&ROLE_ID_HERE> will help you get started!
```

### 4. Channel References
```env
WELCOME_MESSAGE=Welcome {user}! Check out <#CHANNEL_ID> to get started!
```

### 5. Test Before Launching
Always use `/welcome test` to preview before going live!

---

## 📋 Complete Example

Here's a complete `.env` setup:

```env
# Bot Credentials
DISCORD_TOKEN=your_token_here
CLIENT_ID=your_client_id
GUILD_ID=your_guild_id

# Welcome System
WELCOME_CHANNEL_ID=1234567890123456
WELCOME_MESSAGE=🎉 Welcome {user} to **{server}**! 🎉\n\nYou're member #{memberCount}! Make yourself at home and don't forget to read the rules! 📜

# Optional: Tickets
TICKET_CATEGORY_ID=
SUPPORT_ROLE_ID=

# Optional: Auto-delete
PROTECTED_CHANNELS=
REQUIRED_ROLE_ID=
```

---

## ✅ Checklist

Before testing, make sure:
- [ ] WELCOME_CHANNEL_ID is set in .env
- [ ] WELCOME_MESSAGE is set in .env
- [ ] Channel ID is correct (copied from Discord)
- [ ] Bot has Send Messages permission in welcome channel
- [ ] Bot has Embed Links permission
- [ ] Bot has been restarted after .env changes
- [ ] Tested with `/welcome test` command

---

**That's it!** Your welcome system is now ready. New members will automatically receive a beautiful welcome message! 🎊
