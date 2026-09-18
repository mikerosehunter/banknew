import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const content = `If you are staring at a screen that says **"Error Code 99"** while trying to access your Chase Bank account, you are experiencing a known authentication timeout failure. This error prevents you from viewing your dashboard, transferring funds, or paying bills. 

Do not panic. Your funds are secure. This is strictly a digital handshake failure between your device and Chase's secure servers, and it can usually be resolved in a few minutes.

## What Does Chase Error Code 99 Mean?

**Chase Error Code 99 indicates a session timeout or a corrupted authentication token during the login process.** It means the server took too long to verify your credentials, or the secure connection was interrupted before it could complete.

| Diagnostic Detail | Information |
| :--- | :--- |
| **Bank** | Chase Bank |
| **Error Code** | \`99\` |
| **Meaning** | Authentication Timeout / Corrupted Token |
| **Affected Platforms** | Mobile App (iOS/Android) & Web Browser |
| **Average Fix Time** | 3 - 5 Minutes |

> 🔴 **Status Update:** While Error 99 is usually a local device issue, it can occasionally spike during massive Chase server outages (such as on the 1st or 15th of the month when direct deposits hit). 

## 6 Step-by-Step Fixes for Error Code 99

Follow these steps in order. Most users resolve this issue within the first two steps.

### 1. Toggle Airplane Mode (Reset Network Connection)
Because Error 99 is a timeout issue, a stale or weak cellular connection is the most common culprit.
1. Swipe down to open your phone's **Control Center**.
2. Tap the **Airplane Mode** icon to turn it on. Wait exactly 10 seconds.
3. Tap it again to turn it off.
4. Re-open the Chase app and attempt to log in.

### 2. Clear Chase App Cache (Android Only)
If you are on an Android device, a corrupted cached login token will repeatedly trigger Error 99.
1. Open your phone's **Settings**.
2. Navigate to **Apps** > **Chase**.
3. Tap **Storage & cache**.
4. Tap **Clear Cache** (Do not tap Clear Data yet).
5. Restart your phone and try logging in.

### 3. Offload and Reinstall the App (iOS / iPhone)
For iPhone users, offloading the app removes the core code (which might be glitched) while keeping your settings intact.
1. Go to **Settings** > **General** > **iPhone Storage**.
2. Scroll down and tap on **Chase**.
3. Tap **Offload App** and confirm.
4. Once finished, tap **Reinstall App**. 

### 4. Switch from Wi-Fi to Cellular Data (or Vice Versa)
Public Wi-Fi networks (and some home networks with strict firewalls) can block the secure ports Chase requires for authentication.
* If you are on Wi-Fi, turn it off and force the app to use your cellular data.
* If you are on cellular data, connect to a trusted, secure home Wi-Fi network.

### 5. Disable VPNs and Ad Blockers
Chase’s fraud prevention algorithms will instantly block login attempts that appear to come from disguised IP addresses.
* If you use a VPN (like NordVPN or ExpressVPN), **turn it off completely**.
* If you use a system-wide ad blocker (like AdGuard), disable it temporarily.
* Close the Chase app entirely, and try logging in again with a raw connection.

### 6. Log in via Mobile Web Browser (The Bypass Method)
If the mobile app is completely broken, you can bypass the app architecture entirely.
1. Open **Safari** or **Chrome** on your phone.
2. Tap the menu icon and select **New Incognito / Private Window**.
3. Go directly to \`chase.com\` and log in.
*If this works, the problem is 100% isolated to the mobile app installation.*

## How to Check Official Chase Server Status

If you have tried all 6 steps and are still getting Error 99, the Chase authentication servers might be down globally.
* **Twitter / X:** Check the official [@ChaseSupport](https://twitter.com/ChaseSupport) account for announcements regarding known outages.
* **Downdetector:** Visit Downdetector.com and search for Chase to see if thousands of other users are reporting login failures at this exact moment.

> ⚠️ **Security Warning:** Never tweet your account numbers, phone numbers, or passwords to Chase support on social media. Scammers actively monitor these hashtags.

## Prevention Tips

To minimize the chances of hitting Error Code 99 in the future:
* **Enable Auto-Updates:** Ensure your app store is set to automatically update the Chase app. Outdated security certificates trigger this error.
* **Avoid Public Wi-Fi for Banking:** Always use a secure, private network when authenticating your bank account.
* **Don't Leave the App Suspended:** Force-close the app when you are done banking rather than leaving it suspended in the background for days.

## Frequently Asked Questions (FAQ)

**Is my money safe if I get Error Code 99?**
**Yes.** Error 99 is simply a login connection failure. It has absolutely no impact on your actual bank account balances, pending transactions, or security. Your funds remain safely secured by Chase.

**Why does this error only happen on my phone, but my computer works fine?**
**This indicates that the session token specifically stored on your phone's app has become corrupted.** Reinstalling the app or clearing the app cache will fix this discrepancy.

**Will Chase lock my account if I keep trying to log in?**
**Yes.** If you repeatedly attempt to log in while the server is throwing Error 99, Chase's automated security systems may flag the activity as suspicious and temporarily lock your account. Wait 15 minutes before trying again.

**Who do I call if I urgently need to move money during this error?**
**If you cannot wait for the app to function, call the number on the back of your Chase debit or credit card.** Phone support representatives can process urgent transfers or payments for you.
`;

const title = "Chase Error Code 99 Login Failed: Complete Fix Guide [2026]";
const excerpt = "Are you getting Error Code 99 when logging into the Chase mobile app? This authentication timeout error can be fixed fast. Here are the 6 proven solutions.";

async function run() {
  const { error } = await supabase.from('bw_articles').insert({
    title: title,
    slug: 'chase-error-code-99-login-failed',
    content: content,
    excerpt: excerpt,
    meta_description: excerpt,
    category: 'login-access-problems',
    bank_name: 'Chase Bank',
    status: 'published',
    published_at: new Date().toISOString()
  });

  if (error) console.error("Error inserting:", error);
  else console.log("Article perfectly inserted!");
}

run();
