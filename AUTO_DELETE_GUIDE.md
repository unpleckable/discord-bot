# Auto-Delete Messages Without Role

Your bot can now **automatically delete messages** from users who don't have a specific role in certain channels.

## 🎯 Perfect For:
- ✅ Rules channels (allow messages, but auto-delete from unverified users)
- ✅ Announcements (satisfy Discord's onboarding requirement)
- ✅ Any channel where only verified users should talk

---

## 📝 Setup Instructions

### Step 1: Get Your IDs

#### Get Channel IDs:
1. Enable **Developer Mode** (Discord Settings → Advanced → Developer Mode)
2. Right-click the **channel** (e.g., #rules, #announcements)
3. Click **"Copy Channel ID"**

#### Get Role ID:
1. Server Settings → Roles
2. Right-click your **"Verified"** role (or whatever role unlocks the server)
3. Click **"Copy Role ID"**

### Step 2: Configure `.env`

Add these to your `.env` file:

```env
# Channels where messages will be auto-deleted if user lacks role
PROTECTED_CHANNELS=123456789012345678,987654321098765432

# Role required to send messages in protected channels
REQUIRED_ROLE_ID=111222333444555666
```

**Multiple channels:** Separate with commas (no spaces!)

### Step 3: Restart Bot

```bash
npm start
```

---

## ✅ How It Works

### In Protected Channels:

**User WITHOUT required role:**
- Sends message → ❌ **Instantly deleted**
- Sees warning: "You need to complete verification to send messages here"
- Warning disappears after 5 seconds

**User WITH required role:**
- Sends message → ✅ **Message stays**
- Everything works normally

### In Other Channels:
- Bot does nothing
- Normal chat works fine

---

## 🎮 Example Use Cases

### Use Case 1: Rules Channel
```
Channel: #rules
Permissions:
- @everyone: Can view + Can send messages ✅
- Bot has Message Content intent ✅

.env configuration:
PROTECTED_CHANNELS=rules_channel_id
REQUIRED_ROLE_ID=verified_role_id

Result:
- Unverified users CAN technically message
- Bot instantly deletes their messages
- Satisfies Discord's onboarding requirement!
```

### Use Case 2: Verification Channel
```
Channel: #verify-here
Message: "Click ✅ below to verify"

.env configuration:
PROTECTED_CHANNELS=verify_channel_id
REQUIRED_ROLE_ID=verified_role_id

Result:
- New members can't spam
- Channel stays clean
- Only reaction to verify works
```

### Use Case 3: Multiple Protected Channels
```
Channels: #rules, #announcements, #info

.env configuration:
PROTECTED_CHANNELS=rules_id,announcements_id,info_id
REQUIRED_ROLE_ID=verified_role_id

Result:
- All three channels protected
- Unverified users' messages auto-deleted
- Verified users can message freely
```

---

## 🔧 Advanced Configuration

### Change the Warning Message

Edit `events/messageCreate.js`, line ~32:

```javascript
// Change this message:
const warning = await message.channel.send(`${message.author}, you need to complete verification to send messages here.`);

// To whatever you want:
const warning = await message.channel.send(`❌ ${message.author} Please verify first by reacting in #verify`);
```

### Disable Warning Message

Remove or comment out lines 32-36 in `messageCreate.js`:

```javascript
// Optional: Send a temporary warning message
// const warning = await message.channel.send(...);
// setTimeout(() => { ... }, 5000);
```

Now it **silently deletes** without warning.

### Change Warning Duration

Line 35, change `5000` (5 seconds):

```javascript
setTimeout(() => {
    warning.delete().catch(() => {});
}, 10000); // 10 seconds instead
```

---

## 🎯 Complete Setup Example

Here's a full example for a rules channel:

### 1. Discord Channel Settings:
**#rules permissions:**
```
@everyone:
- View Channel: ✅ Allow
- Send Messages: ✅ Allow
- Read Message History: ✅ Allow

@Verified role:
- (inherits from @everyone)
```

### 2. Your `.env`:
```env
DISCORD_TOKEN=your_token_here
CLIENT_ID=your_client_id
GUILD_ID=your_guild_id

# Auto-delete in #rules
PROTECTED_CHANNELS=1234567890123456
REQUIRED_ROLE_ID=9876543210987654
```

### 3. Start Bot:
```bash
npm start
```

### 4. Test:
- User without "Verified" role tries to message in #rules
- Message instantly deleted ✅
- Warning appears for 5 seconds ✅
- Channel stays clean ✅

---

## ⚠️ Important Notes

### Bot Permissions Required:
- ✅ **Read Messages** (to detect messages)
- ✅ **Manage Messages** (to delete messages)
- ✅ **Send Messages** (for warning)

### Bot Must Have Higher Role:
- The bot's role must be **higher** than the users it's deleting messages from
- Otherwise it won't have permission to delete

### Doesn't Delete:
- ❌ Bot messages (ignored)
- ❌ Users with the required role
- ❌ Messages in non-protected channels

---

## 🐛 Troubleshooting

**Messages aren't being deleted?**
- Check bot has "Manage Messages" permission
- Verify channel ID is correct in `.env`
- Check bot's role is high enough
- Make sure `REQUIRED_ROLE_ID` is set

**Bot keeps deleting everyone's messages?**
- Check `REQUIRED_ROLE_ID` is correct
- Make sure verified users actually have that role
- Verify role ID with: right-click role → Copy Role ID

**Warning messages don't appear?**
- Check bot has "Send Messages" permission
- This is optional - you can disable warnings (see Advanced Configuration)

**Console shows errors?**
- Make sure bot has Message Content Intent enabled in Developer Portal
- Bot tab → Privileged Gateway Intents → Message Content Intent ✅

---

## 💡 Pro Tips

1. **Test with an alt account** before going live
2. **Pin a message** explaining verification in protected channels
3. **Combine with reaction roles** for best experience
4. **Use slowmode** as backup (Settings → Edit Channel → Slowmode)
5. Keep `PROTECTED_CHANNELS` list minimal (only channels that need it)

---

**Now your rules channel can satisfy Discord's onboarding requirement while staying clean!** 🎉
