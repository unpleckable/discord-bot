# Minecraft Server Sync - Stage Channel Access

Automatically restrict your stage channel to only players currently online on your Minecraft server!

## 🎯 What This Does

- ✅ Player joins Minecraft → Gets "🟢 Online" role in Discord
- ✅ Player leaves Minecraft → Role removed
- ✅ Stage channel only allows people with the role
- ✅ Works automatically with DiscordSRV

---

## 📋 Setup (5 Steps)

### Step 1: Create the "Online" Role

1. **Server Settings → Roles → Create Role**
2. **Name:** `🟢 Online` (or "In-Game", "Playing", etc.)
3. **Color:** Green (#00ff00)
4. Click **Save Changes**
5. Right-click the role → **Copy Role ID**

### Step 2: Configure Stage Channel Permissions

1. Right-click your **Stage Channel**
2. **Edit Channel → Permissions**
3. Click **+ Add members or roles**

**For @everyone:**
```
View Channel: ✅ Allow
Connect: ❌ Deny
Request to Speak: ❌ Deny
Speak: ❌ Deny
```

**For @🟢 Online role:**
```
Connect: ✅ Allow
Request to Speak: ✅ Allow
Speak: ✅ Allow
```

**For your Staff/Mod role (optional):**
```
Connect: ✅ Allow
Request to Speak: ✅ Allow
Speak: ✅ Allow
Move Members: ✅ Allow
Mute Members: ✅ Allow
```

Click **Save Changes**

### Step 3: Find Your DiscordSRV Console Channel

DiscordSRV sends join/leave messages to a specific channel. Find it:

1. Look for the channel where you see:
   ```
   ✅ **PlayerName** joined the server
   ❌ **PlayerName** left the server
   ```

2. Right-click that channel → **Copy Channel ID**

### Step 4: Configure the Bot

**Option A - Use Command (Easy):**
```
/mcsync setup role:@🟢 Online channel:#console
```
Then add the IDs it gives you to `.env`

**Option B - Edit .env Directly:**
```env
# Minecraft Server Sync
MC_ONLINE_ROLE_ID=paste_role_id_here
MC_CONSOLE_CHANNEL_ID=paste_channel_id_here
```

### Step 5: Deploy & Restart

```bash
npm run deploy
npm start
```

---

## 🧪 Test It

### Test 1: Join Minecraft
1. Join your Minecraft server
2. Check Discord - you should have the "🟢 Online" role
3. Try joining the stage channel - should work!

### Test 2: Leave Minecraft
1. Leave Minecraft server
2. Role should be removed from Discord
3. You should be kicked from stage channel

### Test 3: Manual Control
```
/mcsync add user:@someone
/mcsync remove user:@someone
/mcsync list
```

---

## ⚙️ How It Works

1. Bot monitors your DiscordSRV console channel
2. When it sees:
   - `✅ **Username** joined` → Adds role
   - `❌ **Username** left` → Removes role
3. Stage channel permissions handle the rest!

**The bot matches Minecraft names to Discord users by:**
- Checking Discord username
- Checking Discord nickname/display name
- Case-insensitive matching

---

## 🔧 Advanced Options

### Require Linked Accounts Only

If you want to be extra strict:

1. In DiscordSRV config, require account linking
2. Use `/mcsync` to manually manage exceptions

### Multiple Minecraft Servers

If you have multiple servers:

1. Create different roles: "🟢 Survival", "🟢 Creative", etc.
2. Use different console channels
3. Set up separate syncs for each

### Custom Join/Leave Messages

If DiscordSRV formats messages differently, edit `/events/minecraftSync.js`:

```javascript
// Change these regex patterns to match your format:
const joinMatch = content.match(/✅\s*\*\*(.+?)\*\*\s*joined/i);
const leaveMatch = content.match(/❌\s*\*\*(.+?)\*\*\s*left/i);
```

---

## 🐛 Troubleshooting

### Roles not being added/removed?

**Check #1: Is sync configured?**
```bash
# Run this command to verify:
/mcsync list
```
If it says "not configured", run `/mcsync setup` again.

**Check #2: Is bot monitoring correct channel?**
- Make sure MC_CONSOLE_CHANNEL_ID matches your DiscordSRV channel
- Bot needs "Read Messages" permission in that channel

**Check #3: Can bot give/take roles?**
- Bot's role must be HIGHER than "🟢 Online" role
- Bot needs "Manage Roles" permission

**Check #4: Check console logs**
When someone joins/leaves Minecraft, bot should log:
```
✅ Added online role to Username#1234 (MC: MinecraftName)
✅ Removed online role from Username#1234 (MC: MinecraftName)
```

If you see:
```
⚠️ Could not find Discord user for Minecraft player: Name
```
The bot can't match the Minecraft username to a Discord account.

**Fix:** Make sure the player's Discord username or nickname contains their Minecraft name.

### Bot can't find Discord users?

The bot tries to match by username/nickname. Make sure:
- Player has linked their Discord (via DiscordSRV `/discord link`)
- Their Discord name is similar to Minecraft name
- OR manually add them: `/mcsync add user:@player`

### Stage channel still blocking people?

**Check permissions again:**
1. Edit Stage Channel → Permissions
2. Make sure @everyone has "Connect" set to ❌ DENY (red X)
3. Make sure @🟢 Online has "Connect" set to ✅ ALLOW (green check)
4. Save and test

### Role gets added but immediately removed?

- DiscordSRV might be sending multiple messages
- Check the console channel for duplicate join/leave messages
- May need to adjust the regex patterns in minecraftSync.js

---

## 💡 Pro Tips

### Tip 1: Show Who's Online
Create a voice channel named:
```
🎮 Playing: 0
```

Then use a separate bot (like Statusify) to update the number based on role count.

### Tip 2: Notify When Events Start
When starting an event:
```
/announce title:Event Starting! message:@🟢 Online Join the stage channel now! channel:#announcements ping:none
```

### Tip 3: Manual Override
If someone's having issues:
```
/mcsync add user:@player
```

### Tip 4: Check Who's Actually Online
```
/mcsync list
```
Shows everyone with the online role.

### Tip 5: Role Hierarchy
Make sure your bot's role is positioned ABOVE the "🟢 Online" role in Server Settings → Roles.

---

## 📊 Complete Example

### Your Setup Should Look Like:

**`.env` file:**
```env
DISCORD_TOKEN=your_token
CLIENT_ID=your_client_id
GUILD_ID=your_guild_id

MC_ONLINE_ROLE_ID=1234567890123456
MC_CONSOLE_CHANNEL_ID=9876543210987654
```

**Stage Channel Permissions:**
```
@everyone:
- View: ✅ Allow
- Connect: ❌ Deny

@🟢 Online:
- Connect: ✅ Allow
- Request to Speak: ✅ Allow
- Speak: ✅ Allow

@Moderators:
- Everything: ✅ Allow
```

**DiscordSRV Console Channel:**
```
#minecraft-console
✅ **Steve** joined the server
❌ **Alex** left the server
```

**Result:**
- Steve joins MC → Gets role → Can join stage
- Alex leaves MC → Loses role → Kicked from stage
- Only online players can join your event! ✅

---

## 🎮 Alternative: Without Bot Automation

If you don't want to use the bot automation:

### Manual Method:
1. Create "🟢 Event Attendee" role
2. Before event: Manually give role to online players
3. After event: Remove roles
4. Configure stage channel permissions same way

### Semi-Automatic:
1. Use DiscordSRV's role sync feature
2. Configure in DiscordSRV config.yml:
```yaml
MinecraftDiscordAccountLinkedRoleNameToAddUserTo: "Online"
```

---

## ✅ Quick Checklist

Before testing:
- [ ] Created "🟢 Online" role
- [ ] Configured stage channel permissions
- [ ] Found DiscordSRV console channel
- [ ] Added MC_ONLINE_ROLE_ID to .env
- [ ] Added MC_CONSOLE_CHANNEL_ID to .env
- [ ] Bot role is ABOVE online role
- [ ] Bot has "Manage Roles" permission
- [ ] Deployed commands: `npm run deploy`
- [ ] Restarted bot
- [ ] Tested with `/mcsync list`

---

**Now only players actively on your Minecraft server can join your stage events!** 🎮🎙️
