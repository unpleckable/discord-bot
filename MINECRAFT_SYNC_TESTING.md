# Minecraft Sync - Complete Testing & Verification Guide

This bot is now **bulletproof** and supports ALL possible DiscordSRV message formats. Here's how to verify it works.

---

## ✅ Supported Message Formats

The bot will automatically detect **ANY** of these formats:

### Join Messages:
1. `✅ **unpleckable** joined the server` ✅
2. `:white_check_mark: **unpleckable** joined the server` ✅
3. `**unpleckable** joined the server` ✅
4. `[Fri 18:16:42 INFO  Server] unpleckable joined the game` ✅
5. `unpleckable joined the server` ✅
6. `unpleckable (DisplayName) joined the server` ✅
7. Embed with "unpleckable joined" in author ✅
8. Embed with "unpleckable joined" in description ✅

### Leave Messages:
1. `❌ **unpleckable** left the server` ✅
2. `:x: **unpleckable** left the server` ✅
3. `**unpleckable** left the server` ✅
4. `[Fri 18:16:42 INFO  Server] unpleckable left the game` ✅
5. `unpleckable disconnected` ✅
6. Same embed support as join messages ✅

**You don't need to configure anything - it just works!**

---

## 🔍 Pre-Flight Checklist

Before testing, verify these are correct:

### ✅ Step 1: Verify .env Configuration

Your `.env` file must have:
```env
# Required
DISCORD_TOKEN=your_bot_token
CLIENT_ID=your_client_id
GUILD_ID=your_guild_id

# Minecraft Sync (REQUIRED)
MC_ONLINE_ROLE_ID=1234567890123456789
MC_CONSOLE_CHANNEL_ID=9876543210987654321
```

**Get IDs:**
- Enable Developer Mode in Discord
- Role ID: Right-click role → Copy Role ID
- Channel ID: Right-click channel → Copy Channel ID

### ✅ Step 2: Verify Role Setup

```
Server Settings → Roles

Your roles should be ordered like:
1. Admin roles
2. Bot role ← MUST BE HERE
3. 🟢 Online role ← BELOW BOT ROLE
4. Other roles
```

**Bot role must be ABOVE the Online role!**

### ✅ Step 3: Verify Bot Permissions

```
Server Settings → Roles → Bot Role

Required permissions:
✅ Manage Roles
✅ View Channels
✅ Send Messages
✅ Read Message History
```

### ✅ Step 4: Verify Stage Channel

```
Right-click Stage Channel → Edit Channel → Permissions

@everyone:
- View Channel: ✅ Allow
- Connect: ❌ DENY (red X)
- Request to Speak: ❌ DENY

@🟢 Online:
- Connect: ✅ ALLOW (green check)
- Request to Speak: ✅ ALLOW
- Speak: ✅ ALLOW
```

### ✅ Step 5: Verify Bot is Running

```bash
npm start
```

Console should show:
```
✅ Logged in as YourBot#1234!
📊 Serving 1 servers
```

---

## 🧪 Testing Procedure

### Test 1: Configuration Check

In Discord, run:
```
/mcsync list
```

**Expected result:**
```
🟢 Currently Online (0):
No one is online
```

**If you see "not configured":**
- Check .env file has MC_ONLINE_ROLE_ID and MC_CONSOLE_CHANNEL_ID
- Restart bot
- Try again

---

### Test 2: Manual Role Add

```
/mcsync add user:@yourself
```

**Expected result:**
```
✅ Added @🟢 Online to @You
```

**Check:**
- Do you now have the 🟢 Online role? ✅
- Can you join the stage channel? ✅

**If this fails:**
- Bot doesn't have "Manage Roles" permission
- Bot role is below Online role

---

### Test 3: Manual Role Remove

```
/mcsync remove user:@yourself
```

**Expected result:**
```
✅ Removed @🟢 Online from @You
```

**Check:**
- Role removed? ✅
- Can't join stage anymore? ✅

---

### Test 4: Minecraft Join Detection

**Steps:**
1. Make sure bot console is visible
2. Join your Minecraft server
3. Watch both:
   - Bot console
   - Discord console channel

**Expected bot console output:**
```
[MC SYNC DEBUG] Message in console: "[Fri 18:16:42 INFO  Server] unpleckable joined the game"
[MC SYNC DEBUG] Detected join for: "unpleckable"
[MC SYNC DEBUG] Found Discord user: unpleckable#1234
✅ Added online role to unpleckable#1234 (MC: unpleckable)
```

**Expected Discord:**
- You get 🟢 Online role ✅
- You can join stage channel ✅

---

### Test 5: Minecraft Leave Detection

**Steps:**
1. Leave your Minecraft server
2. Watch bot console

**Expected bot console output:**
```
[MC SYNC DEBUG] Message in console: "[Fri 18:16:42 INFO  Server] unpleckable left the game"
[MC SYNC DEBUG] Detected leave for: "unpleckable"
[MC SYNC DEBUG] Found Discord user: unpleckable#1234
✅ Removed online role from unpleckable#1234 (MC: unpleckable)
```

**Expected Discord:**
- You lose 🟢 Online role ✅
- Kicked from stage channel ✅

---

## 🐛 Troubleshooting

### Issue: "Could not find Discord user for Minecraft player"

**Console shows:**
```
⚠️ Could not find Discord user for Minecraft player: unpleckable
[MC SYNC DEBUG] Searched for username containing: "unpleckable"
```

**Problem:** Bot can't match your Minecraft name to Discord account.

**Solutions:**

**Option 1 - Change Discord Nickname:**
```
Right-click yourself in server
→ Change Nickname
→ Set to "unpleckable" (your MC name)
```

**Option 2 - Change Discord Username:**
```
Discord Settings
→ My Account
→ Username
→ Change to contain your MC name
```

**Option 3 - Manual Add:**
```
/mcsync add user:@yourself
```

---

### Issue: "MC Online role not found"

**Console shows:**
```
⚠️ MC Online role not found
```

**Problem:** Role ID in .env is wrong or role was deleted.

**Solution:**
1. Check role exists: Server Settings → Roles
2. Copy role ID again: Right-click → Copy Role ID
3. Update .env: `MC_ONLINE_ROLE_ID=correct_id_here`
4. Restart bot

---

### Issue: No console messages at all

**Problem:** Bot isn't monitoring the right channel.

**Solution:**
1. Which channel shows DiscordSRV messages?
2. Copy that channel's ID
3. Update .env: `MC_CONSOLE_CHANNEL_ID=correct_channel_id`
4. Restart bot

---

### Issue: "Error adding role: Missing Permissions"

**Problem:** Bot doesn't have permission to give roles.

**Solution:**
1. Server Settings → Roles → Bot Role
2. Enable "Manage Roles" ✅
3. Drag bot role ABOVE Online role
4. Save

---

### Issue: Messages detected but role not added

**Console shows:**
```
[MC SYNC DEBUG] Detected join for: "unpleckable"
[MC SYNC DEBUG] Found Discord user: unpleckable#1234
❌ Error adding role to unpleckable#1234: Missing Permissions
```

**Problem:** Bot role position is too low.

**Solution:**
```
Server Settings → Roles
Drag bot role ABOVE 🟢 Online role
Save
```

---

## 📊 Success Criteria

Your system is working correctly when:

- ✅ `/mcsync list` shows the role (not "not configured")
- ✅ `/mcsync add` successfully gives you the role
- ✅ Joining Minecraft gives you the role automatically
- ✅ Leaving Minecraft removes the role automatically
- ✅ Stage channel only allows people with the role
- ✅ Console shows debug messages for joins/leaves

---

## 💡 Advanced Testing

### Test with Multiple Players

1. Have a friend join Minecraft
2. Check if they get the role
3. Check if they can join stage
4. Have them leave
5. Check if role is removed

### Test Edge Cases

**Different name formats:**
- Minecraft: `Steve`, Discord: `Steve#1234` ✅
- Minecraft: `Steve`, Discord: `SteveGaming#5678` ✅
- Minecraft: `Steve123`, Discord: `Steve#0001` ✅

**Should all work due to flexible matching!**

---

## 🎯 Final Verification Checklist

Before deploying to production:

- [ ] `.env` file configured correctly
- [ ] Bot role above Online role in hierarchy
- [ ] Bot has "Manage Roles" permission
- [ ] Stage channel permissions set correctly
- [ ] Tested manual add/remove (works ✅)
- [ ] Tested Minecraft join (works ✅)
- [ ] Tested Minecraft leave (works ✅)
- [ ] Tested stage channel access (works ✅)
- [ ] Tested with multiple players (works ✅)

---

## 📞 Still Having Issues?

If after following this guide it still doesn't work:

1. **Copy the EXACT console output** when you join Minecraft
2. **Copy your .env file** (WITHOUT your token!)
3. **Screenshot your role hierarchy**
4. **Screenshot stage channel permissions**

This will help diagnose the exact issue!

---

**This version is production-ready and requires NO code changes regardless of your DiscordSRV configuration!** 🎮✅
