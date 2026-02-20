# Ticket System Troubleshooting

If you're getting "Interaction Failed" when clicking the ticket button, here's how to fix it:

## ✅ Quick Fixes

### 1. **Check Bot Permissions** (Most Common Issue)

The bot needs these permissions:

**Server-wide permissions:**
- ✅ **Manage Channels** ← CRITICAL for tickets!
- ✅ View Channels
- ✅ Send Messages
- ✅ Manage Messages
- ✅ Embed Links
- ✅ Read Message History

**How to give permissions:**
1. Server Settings → Roles
2. Find your bot's role
3. Enable **"Manage Channels"**
4. Click "Save Changes"

### 2. **Bot Role Position**

The bot's role must be:
- **Above** the roles of users creating tickets
- **Below** your admin role is fine

**Fix:**
1. Server Settings → Roles
2. Drag bot role **higher up** in the list
3. Should be near the top (below admin/mod roles is ok)

### 3. **Remove TICKET_CATEGORY_ID (If Not Set)**

If you haven't created a category for tickets:

**Option A - No Category (Easiest):**
```env
# Comment out or remove this line:
# TICKET_CATEGORY_ID=

# Or leave it empty
TICKET_CATEGORY_ID=
```

**Option B - Create Category:**
1. Create a new category in Discord (right-click server → Create Category)
2. Name it "Tickets" or "Support"
3. Right-click category → Copy Category ID
4. Add to `.env`:
```env
TICKET_CATEGORY_ID=your_category_id_here
```

### 4. **Restart Bot**

After making changes:
```bash
# Stop the bot (Ctrl+C)
npm start
```

### 5. **Check Console for Errors**

When you click the button, look at your bot's console:
- If it shows errors, read them carefully
- Common errors:
  - "Missing Permissions" → Bot needs Manage Channels
  - "Unknown Channel" → Category ID is wrong
  - "Missing Access" → Bot role too low

---

## 🧪 **Test the Fix**

### Before Testing:
1. ✅ Bot has "Manage Channels" permission
2. ✅ Bot role is high enough
3. ✅ TICKET_CATEGORY_ID is either empty or valid
4. ✅ Bot is restarted

### Test:
1. Run `/ticket setup channel:#general` (or any channel)
2. Click the "📩 Create Ticket" button
3. Should create a ticket channel immediately!

---

## 🔧 **Common Issues & Solutions**

### Issue: "Interaction Failed"
**Causes:**
- Bot missing "Manage Channels" permission
- Bot took too long to respond (>3 seconds)
- Bot role hierarchy is too low

**Solutions:**
- Give bot "Manage Channels" permission
- Make sure bot isn't being rate-limited
- Move bot role higher in role list

### Issue: Ticket creates but immediately errors
**Cause:** SUPPORT_ROLE_ID is invalid

**Solution:**
```env
# Remove or comment out:
# SUPPORT_ROLE_ID=

# Or fix the role ID:
SUPPORT_ROLE_ID=correct_role_id_here
```

### Issue: Can't see the ticket channel
**Cause:** Bot didn't give you permissions

**Solution:**
- Check bot console for errors
- Make sure bot has "Manage Channels" permission
- Try creating ticket again

### Issue: Multiple tickets with same name
**Fixed in new version!** Now tracks by user ID in channel topic.

---

## 📋 **Complete Setup Checklist**

Before tickets will work, verify ALL of these:

### Bot Setup:
- [ ] Bot is online and in your server
- [ ] Bot has "Manage Channels" permission
- [ ] Bot role is high in the role list
- [ ] Commands are deployed (`npm run deploy`)

### Environment Variables:
- [ ] `DISCORD_TOKEN` is set and correct
- [ ] `CLIENT_ID` is set
- [ ] `GUILD_ID` is set
- [ ] `TICKET_CATEGORY_ID` is either empty OR valid category ID
- [ ] `SUPPORT_ROLE_ID` is either empty OR valid role ID (optional)

### Discord Settings:
- [ ] Bot has necessary permissions (see list above)
- [ ] If using category: category exists and bot can access it
- [ ] If using support role: role exists

### Code:
- [ ] Bot is running without errors
- [ ] You ran `/ticket setup` successfully
- [ ] Ticket panel appears with button

---

## 🐛 **Still Not Working?**

### Debug Mode:

1. **Check bot console when clicking button**
   - You should see: "Creating ticket for [username]..."
   - Followed by: "✅ Ticket channel created: ticket-username"

2. **If you see errors**, common ones:

   **"Missing Permissions":**
   ```
   Solution: Give bot "Manage Channels" in Server Settings → Roles
   ```

   **"Unknown Category":**
   ```
   Solution: Remove TICKET_CATEGORY_ID from .env or use valid ID
   ```

   **"Interaction timeout":**
   ```
   Solution: Bot is taking too long - check internet/hosting
   ```

3. **Test with different user**
   - Try with an alt account
   - Try in a test server

4. **Verify bot intents**
   - Discord Developer Portal → Bot tab
   - Make sure these are enabled:
     - ✅ Server Members Intent
     - ✅ Message Content Intent (for auto-delete feature)
     - ✅ Presence Intent

---

## ✅ **Working Configuration Example**

Here's a minimal `.env` that works:

```env
DISCORD_TOKEN=your_bot_token
CLIENT_ID=your_client_id
GUILD_ID=your_server_id

# Leave these empty if not using
TICKET_CATEGORY_ID=
SUPPORT_ROLE_ID=

# Other optional settings
PROTECTED_CHANNELS=
REQUIRED_ROLE_ID=
```

**Permissions bot needs:**
- Manage Channels
- View Channels  
- Send Messages
- Manage Messages
- Embed Links
- Read Message History

**That's it!** With just these settings, tickets should work.

---

## 💡 **Pro Tips**

1. **Test in a new category first** before using in main server
2. **Create a "Tickets" category** to keep things organized
3. **Set permissions on category** → they inherit to new tickets
4. **Use SUPPORT_ROLE_ID** to ping your staff automatically
5. **Check bot logs** whenever something goes wrong

---

**Need more help?** Check the console output when you click the button - it will tell you exactly what's wrong!
