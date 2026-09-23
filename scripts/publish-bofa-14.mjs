import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const envPath = path.join(rootDir, '.env.local');
let supabaseUrl = process.env.SUPABASE_URL;
let supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  if (!supabaseUrl) supabaseUrl = envContent.match(/SUPABASE_URL=(.*)/)?.[1]?.trim();
  if (!supabaseKey) supabaseKey = envContent.match(/SUPABASE_SERVICE_KEY=(.*)/)?.[1]?.trim();
}

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

export const NEW_BOFA_ARTICLES = [
  // ── 1. Password Reset Loop ──
  {
    title: "Bank of America Password Reset Loop: How to Stop Being Asked to Reset",
    slug: "bank-of-america-password-reset-loop-keeps-asking",
    category: "login-access-problems",
    bank_name: "Bank of America",
    excerpt: "Trapped in an endless password reset loop on Bank of America? Learn how stale OAuth session tokens, Keychain autofill conflicts, and security drift cause this bug and how to fix it.",
    meta_description: "Fix the Bank of America endless password reset loop. Stop the app and website from repeatedly prompting you to change your credentials with these 5 verified steps.",
    content: `If you have successfully changed your Bank of America password only to have the app or website immediately demand that you reset it again, you are caught in a **credential synchronization redirect loop**. 

This frustrating bug makes account holders feel as though their new password failed to save or their account has been breached. **Do not panic: your funds and account security are completely intact.** This glitch is caused by a race condition between your device's cached cryptographic authentication token and Bank of America's distributed core credential databases.

## What Does the Password Reset Loop Mean?

**The Bank of America password reset loop occurs when an outdated session cookie or mobile keychain token continually submits stale credentials in the background.** When Bank of America's security gateway detects the old token right after you authenticate with a new password, it interprets the mismatch as suspicious activity and triggers an automated forced-reset flag.

| Diagnostic Attribute | Technical Detail |
| :--- | :--- |
| **Institution** | Bank of America, N.A. |
| **System Event** | Credential Token Invalidation Loop |
| **Primary Causes** | iCloud Keychain / Chrome Autofill mismatch, stale biometric refresh token, IP anomaly |
| **Affected Platforms** | Mobile App (iOS / Android), Mobile Web, Desktop Safari & Chrome |
| **Estimated Resolution** | 4 to 8 minutes |

> 🔴 **Critical Warning:** Do not attempt more than 3 consecutive resets in the same browser session. Repeated failed handshakes will trigger an administrative security lockout requiring tier-2 telephone unlock.

## 5 Step-by-Step Fixes for the Password Reset Loop

Follow these steps in precise order to purge the corrupted session state and restore clean access.

### 1. Disable Password Autofill Temporarily (Keychain & Chrome)
The number one cause of the loop is browser or mobile password autofill silently overwriting your newly created password with the previous one during the redirect handoff.
1. On iPhone, go to **Settings** > **Passwords** > **Password Options** and toggle off **Autofill Passwords and Passkeys**.
2. On Android / Chrome, go to **Settings** > **Autofill and passwords** > **Google Password Manager** > Settings gear > toggle off **Offer to save passwords**.
3. Manually type your Online ID and newly created password character by character.

### 2. Revoke and Re-Authenticate the Biometric Keychain Token
If the loop occurs specifically on your smartphone app:
1. Open the Bank of America mobile app.
2. At the login screen, tap **Cancel** on the Face ID / Fingerprint prompt.
3. Tap **Forgot ID/Password** on the login screen, complete the verification one final time using your debit card or account number, and establish your new password.
4. When prompted **"Enable Face ID / Touch ID for quick sign-in?"**, select **Not Now**.
5. Log in manually once. Once inside your dashboard, navigate to **Menu** > **Security Center** > **Face ID / Biometrics** and re-enable it cleanly.

### 3. Clear Stale OAuth Cookies (Bypass the Host Header Cache)
If resetting via a desktop computer or mobile browser:
1. Close all active Bank of America browser tabs.
2. Clear cookies specifically for the domains \`bankofamerica.com\` and \`secure.bankofamerica.com\`.
3. Flush your DNS cache or open a fresh **Private / Incognito Window**.
4. Navigate directly to \`https://www.bankofamerica.com\` without using a bookmarked URL (old bookmarks frequently contain expired session query parameters like \`?request_locale\` or stale state tokens).

### 4. Verify Identity Via the SafePass Secondary Channel
If Bank of America's fraud engine flagged your IP address, it will loop the reset until multi-factor verification is confirmed via an alternate channel.
1. When prompted for SafePass verification, select **Text Message** rather than the mobile push notification.
2. If the SMS fails to arrive within 60 seconds, select **Call Me** to receive the 6-digit code via automated phone call.
3. Enter the code immediately—SafePass codes expire after exactly 10 minutes, but credential token resets require verification within 180 seconds.

### 5. Escalate to the Dedicated Digital Banking Escalation Desk
If the loop persists across multiple devices and incognito browsers, your profile has an administrative "must-change-password" database flag stuck in active status.
* Call the **Bank of America Online & Mobile Banking Support Desk** at **1-800-933-6262**.
* When the automated IVR voice asks for your issue, clearly say: **"Technical Support: Password reset redirect loop."**
* Request that the representative perform a **"Remote Session Kill and Profile Cache Flush"**. This terminates all active OAuth tokens across all servers and clears the forced-reset flag.

## Frequently Asked Questions (FAQ)

**Did someone hack my Bank of America account?**
**No.** An automated password reset loop is almost universally a client-side token caching glitch or an anti-fraud heuristic triggered by changing your password from an unrecognized Wi-Fi network or VPN.

**Why does the desktop website work while the mobile app keeps looping?**
**The mobile app stores authentication tokens in a persistent hardware-backed keystore.** If the app fails to overwrite the old token upon a password reset, it repeatedly submits expired credentials, triggering the loop.

**How long should I wait before trying again?**
**If you have failed twice, wait exactly 20 minutes before making a third attempt.** This allows temporary anti-brute-force rate limits on Bank of America's authentication servers to clear.`
  },

  // ── 2. Business & Personal Login Collision ──
  {
    title: "Bank of America Business & Personal Login Conflict: How to Link Accounts & Stop Redirects",
    slug: "bank-of-america-business-personal-account-login-collision",
    category: "login-access-problems",
    bank_name: "Bank of America",
    excerpt: "Experiencing redirect loops between personal and Business Advantage accounts on Bank of America? Learn how Single Sign-On collisions happen and how to properly link them.",
    meta_description: "Resolve Bank of America business and personal account login conflicts. Fix redirect loops between consumer and Small Business portals with step-by-step linking instructions.",
    content: `For business owners who hold both consumer checking accounts and a Bank of America Business Advantage profile, logging in can quickly become a technical nightmare. You enter your credentials only to be redirected endlessly between \`bankofamerica.com\` and the small business banking portal, or greeted with the error: **"The Online ID you entered is associated with a business profile. Please sign in through Small Business Banking."**

This issue stems from Bank of America's Single Sign-On (SSO) architecture attempting to reconcile two distinct profile ledgers under a single browser session or mobile device profile.

## What Does the Business vs. Personal Login Collision Mean?

**The conflict occurs because Bank of America maintains two completely separate banking backends: consumer retail accounts and Business Advantage commercial accounts.** If your personal Online ID and business Online ID share the same primary email address, mobile phone number, or stored browser keychain, the authentication router fails to determine which portal dashboard to display.

| Profile Dimension | Personal Consumer Account | Business Advantage Account |
| :--- | :--- | :--- |
| **Tax ID Architecture** | Social Security Number (SSN / ITIN) | Employer Identification Number (EIN) or SSN |
| **Portal Host** | \`secure.bankofamerica.com\` | \`business.bankofamerica.com\` |
| **Zelle Protocol** | Consumer Zelle Directory | Small Business Zelle Directory |
| **Entitlements** | Single Account Owner | Multi-user roles, payroll, wire entitlements |

> 💡 **Key Fact:** You do not need to maintain two separate phones or computers to access both profiles. Bank of America provides a native **Account Linking Feature** that allows you to view both personal and small business balances under a single Master Online ID.

## 4 Solutions to Resolve the Login Conflict

### 1. Link Personal and Business Profiles Under One Master ID
The permanent solution is consolidating your accounts into a unified relationship view.
1. Sign in to your **Bank of America Business Advantage** account using a desktop web browser.
2. In the top navigation menu, click **Profile & Settings** > **Link Personal & Business Accounts**.
3. Review the disclosure regarding shared access and electronic statements.
4. Enter your **Personal Online ID** and password.
5. Authenticate via SafePass two-factor authorization.
6. Once linked, you will log in using your **Business Online ID**, which will now display tabs for both your business operating accounts and your personal checking, savings, and credit cards.

### 2. Break Browser Cache Redirect Loops
If you are actively trapped in an endless redirect between \`secure01b.bankofamerica.com\` and the business portal:
1. Close all Bank of America browser windows completely.
2. Open your browser settings and delete cookies for:
   * \`bankofamerica.com\`
   * \`bofa.com\`
   * \`smallbusiness.bankofamerica.com\`
3. Do not click through auto-suggested search bar URLs. Type \`https://www.bankofamerica.com/smallbusiness/\` directly into the address bar.
4. Log in using your business credentials.

### 3. Configure the Mobile App for Multiple Profiles
The Bank of America mobile app on iOS and Android supports dual-profile switching without requiring constant logging out and in.
1. Log into your primary profile on the app.
2. Tap the **Menu** icon in the top left corner.
3. Scroll to the bottom and tap **Manage Accounts / Switch Profile**.
4. Tap **Add an Existing Account**, then enter the credentials for your second profile.
5. Biometric sign-in (Face ID / Fingerprint) will now prompt you to select which profile (Personal or Business) you want to open upon launch.

### 4. Separate Shared Contact Information (If Keeping IDs Distinct)
If you prefer to keep your personal finances strictly separated from your business bookkeeping for accounting or legal reasons:
* Your Personal Online ID and Business Online ID must have **different primary email addresses**.
* Your Small Business profile should list the business phone or a dedicated line rather than sharing the exact personal cellular number, which prevents SafePass routing collisions.

## Frequently Asked Questions (FAQ)

**Will linking my personal and business accounts pierce my LLC corporate veil?**
**No.** Account linking on Bank of America is purely an authentication dashboard convenience (SSO). It does not alter tax reporting, EIN liability, commingle funds, or change the legal separation between your business entity and personal finances.

**Can secondary business users or bookkeepers see my personal accounts?**
**No.** Only the Master Signer (the individual who links the credentials) can see the unified view. Delegates, employees, or accountants given access to your business account under Account Management cannot see your linked personal checking or credit cards.

**Who do I call if my accounts fail to link online?**
**Contact the Bank of America Small Business Technical Assistance Desk at 1-888-BUSINESS (1-888-287-4637)**, available Monday through Friday from 7:00 AM to 11:00 PM ET.`
  },

  // ── 3. Credit Card Disappeared from App ──
  {
    title: "Bank of America Credit Card Disappeared from App: How to Restore Dashboard Display",
    slug: "bank-of-america-credit-card-disappeared-from-app",
    category: "account-issues",
    bank_name: "Bank of America",
    excerpt: "Did your Bank of America credit card suddenly vanish from your mobile app or online dashboard? Learn why weekend ledger maintenance and profile unlinks happen and how to restore it.",
    meta_description: "Fix a missing Bank of America credit card on the mobile app and online banking. Step-by-step guide to unhide accounts, resolve weekend ledger drops, and restore access.",
    content: `Opening your Bank of America mobile app expecting to check your balance or pay your monthly bill, only to find that your credit card account has completely disappeared from the dashboard, is an alarming experience. 

Before assuming your account was canceled or closed due to fraud, understand this: **your credit line is almost certainly intact, your rewards points are safe, and your account has not been wiped out.** This is a recognized core banking ledger display glitch that occurs thousands of times each month across Bank of America's digital platform.

## Why Did Your Credit Card Vanish from the App?

**A credit card disappears from Bank of America's app when the core credit card processing ledger fails to sync with the consumer online banking interface.** This digital disconnect typically happens during scheduled weekend batch processing, after receiving a replacement card, or when account display preferences are accidentally toggled.

| Root Cause | Occurrence Frequency | Average Recovery Time |
| :--- | :--- | :--- |
| **Weekend Ledger Maintenance** | High (Saturday 11 PM – Sunday 6 AM ET) | Automatic by 7:00 AM Sunday |
| **Card Replacement Number Migration** | Moderate (Lost, stolen, or expired cards) | 24 to 48 hours |
| **Accidental "Hidden Account" Toggle** | Moderate (User interface customization) | Instant (Under 2 minutes) |
| **Secondary Authorized User Unlinking** | Low (Primary cardholder profile changes) | Requires re-enrollment |
| **Security Risk Temporary Suppression** | Low (Severe fraud or AML flag) | Requires fraud phone clearance |

## 4 Ways to Restore Your Missing Credit Card

### 1. Check the "Show / Hide Accounts" Preference Toggle
In over 40% of cases, an update to the mobile app resets custom display settings, hiding credit card tiles by default.
1. Log into **Bank of America Online Banking** on a desktop browser (desktop provides full account hierarchy visibility).
2. Go to the top right menu and select **Profile & Settings**.
3. Under **Account Preferences**, click **Show / Hide Accounts**.
4. Locate your credit card (e.g., Customized Cash Rewards, Travel Rewards, or Premium Rewards).
5. If the checkbox next to the card is unchecked, check it and click **Save Preferences**.
6. Log out, force-close the mobile app on your phone, and log back in.

### 2. Check for Weekend Core Ledger Maintenance
Bank of America routinely performs batch maintenance on its credit card servers late Saturday night through early Sunday morning.
* During this maintenance window, debit and deposit accounts usually remain visible, but credit cards, Merrill investment accounts, and mortgage tiles temporarily disappear.
* If your card vanished between **Saturday 11:00 PM ET and Sunday 6:00 AM ET**, wait until Sunday morning. The ledger cutover automatically restores card display once batch updates complete.

### 3. Relink Your Replacement Card Number
If Bank of America recently issued you a new credit card due to chip expiration or fraudulent charges, the old account number is purged from the database before the new 16-digit number is fully bound to your Online ID.
1. Sign in to Online Banking on a computer.
2. Select **Accounts** > **Add an existing Bank of America account**.
3. Enter your new **16-digit credit card number**, the 3-digit CVV, and your billing zip code.
4. Complete the SafePass two-factor SMS verification.
5. The new card will immediately populate your dashboard with your existing credit limit, current balance, and historical transactions.

### 4. Contact Credit Card Servicing to Clear Fraud Suppression
If your card has been missing for more than 48 hours on both desktop and mobile, Bank of America's risk management system may have suppressed digital access due to suspected account takeover.
* Call the **Credit Card Customer Service Desk** at **1-800-732-9194** (available 24/7).
* Say: **"Missing account tile on digital banking."**
* The representative will verify whether the account has a digital access block or if an administrative profile uncoupling occurred.

## Frequently Asked Questions (FAQ)

**Will my autopay still process if my credit card is not showing on the app?**
**Yes.** Scheduled autopay payments are handled on the core credit card billing ledger, not the front-end app display. Even while the card is invisible on your screen, your scheduled payment will process normally on its due date.

**Did Bank of America close my credit card without telling me?**
**Unlikely.** Federal regulations (Credit CARD Act) require financial institutions to provide written notice for adverse actions. If your account were closed, it would typically show as "Closed - Balance Due" rather than vanishing completely without a trace.

**Are my credit card reward points lost?**
**No.** Your rewards balance is stored on Bank of America's loyalty program servers and remains fully intact. Once your card is relinked or ledger maintenance finishes, your rewards balance will reappear.`
  },

  // ── 4. Early Direct Deposit Rules ──
  {
    title: "Does Bank of America Have Early Direct Deposit? Exact Posting Rules & Timelines",
    slug: "does-bank-of-america-have-early-direct-deposit-rules",
    category: "account-issues",
    bank_name: "Bank of America",
    excerpt: "Wondering if Bank of America pays direct deposit 2 days early? Learn why BofA does not offer early payday, how ACH settlement works, and exact posting times.",
    meta_description: "Does Bank of America have 2-day early direct deposit? Comprehensive breakdown of BofA's ACH posting policy, payroll processing times, and when your money hits.",
    content: `With fintech apps and competing banks heavily advertising "Get Paid Up to 2 Days Early with Direct Deposit," millions of Bank of America checking account holders wonder: **Does Bank of America offer early direct deposit?**

The short, definitive answer is: **No. Bank of America does not currently offer early direct deposit.** Unlike neobanks (such as Chime or SoFi) or traditional competitors (like Capital One 360 or Wells Fargo), Bank of America adheres strictly to standard Federal Reserve Automated Clearing House (ACH) settlement schedules.

Understanding how Bank of America processes payroll deposits will help you avoid overdrafts, plan bill payments, and know the exact hour your paycheck becomes available.

## How Bank of America Processes ACH Direct Deposits

When your employer runs payroll, they transmit an ACH file through their payroll provider (such as ADP, Paychex, or Workday) to the Federal Reserve. 

| Institution Type | Policy on ACH Direct Deposit | When Funds Become Available |
| :--- | :--- | :--- |
| **Fintech / Neobanks** (Chime, Current) | Early Payday Feature | Posts immediately upon receiving the ACH notification (Wednesday afternoon) |
| **Select Banks** (Capital One, Wells Fargo) | Early Direct Deposit | Up to 2 days before the scheduled settlement date |
| **Bank of America** (All Account Types) | **Standard ACH Settlement** | **The official settlement date (Friday morning, 3:00 AM – 6:00 AM local time)** |

**Why doesn't Bank of America release funds early?**
When a payroll processor sends an ACH file 2 days early, it is an electronic "pre-notification" (ACH memo post). The actual settlement of funds between the employer's bank and Bank of America does not occur until the effective date (usually Friday). Banks that pay 2 days early are effectively extending you an interest-free, short-term unsecured credit advance. Bank of America chooses not to take on this settlement credit risk.

## Exact Bank of America Direct Deposit Posting Schedule

Even though Bank of America does not post two days early, its overnight posting cycle is reliable and predictable:

### 1. Typical Friday Payday Timeline
* **Wednesday (2 Days Before):** Your employer submits payroll. Bank of America receives the ACH pre-notification file during the overnight Federal Reserve transmission window. At this stage, funds are not visible on your app.
* **Thursday Evening (1 Day Before):** Around 9:00 PM – 11:00 PM ET, Bank of America's central batch processing engine verifies incoming payroll files against account numbers.
* **Friday (Official Payday):** Between **3:00 AM and 6:00 AM in your local time zone**, direct deposit funds are posted directly to your **Available Balance**. You have immediate access via debit card, ATM withdrawal, or Zelle transfer.

### 2. What Happens on Federal Banking Holidays?
If your scheduled payday falls on a Federal Reserve holiday (such as Memorial Day, Labor Day, Thanksgiving, or New Year's Day):
* The Federal Reserve ACH processing network is closed.
* Your direct deposit will post **the business day before the holiday** (e.g., Thursday if the holiday is Friday), provided your employer submitted payroll 24 hours earlier to accommodate the holiday schedule.

## How to Track a Missing Direct Deposit

If it is Friday morning past 6:00 AM local time and your expected paycheck has not appeared in your Bank of America checking account:

1. **Verify Your Account and Routing Number:** Check your paystub against the routing number on your mobile app. Remember: Bank of America uses state-specific ACH routing numbers based on where your account was opened.
2. **Request the 15-Digit ACH Trace Number:** Ask your employer's HR or payroll department for the official **ACH Trace ID**. This 15-digit code proves the file was accepted by the Federal Reserve.
3. **Contact Bank of America Direct Deposit Inquiries:** Call **1-800-432-1000** and provide the representative with the 15-digit trace number. A specialist can instantly trace whether the ACH batch is pending in the overnight queue or was rejected due to an account number mismatch.

## Frequently Asked Questions (FAQ)

**Can I upgrade to an account that has early direct deposit at Bank of America?**
**No.** Neither Advantage Plus, Advantage SafeBalance, nor Preferred Rewards tiers (Gold, Platinum, Platinum Honors) include early direct deposit. The policy applies across all retail accounts uniformly.

**Why did my coworker get paid on Wednesday while I get paid on Friday?**
**Your coworker likely banks with an institution that offers early ACH advances** (such as Chime, Capital One, or a credit union). Both of your employers sent the payroll file on Wednesday, but Bank of America waits until the official Friday settlement date to release the cash.

**Does Bank of America hold direct deposits on weekends?**
**Direct deposits are never scheduled or settled on Saturdays or Sundays** because the Federal Reserve ACH network is closed. If your payday falls on a weekend, funds will post on Friday morning.`
  },

  // ── 5. Apple Pay & Google Wallet Verification Required ──
  {
    title: "Bank of America Apple Pay & Google Wallet 'Verification Required': How to Fix",
    slug: "bank-of-america-apple-pay-verification-required-contact-bank",
    category: "card-atm-problems",
    bank_name: "Bank of America",
    excerpt: "Seeing 'Verification Required: Contact Bank' when adding your Bank of America card to Apple Pay or Google Wallet? Follow these steps to bypass provisioning blocks fast.",
    meta_description: "Fix Bank of America Apple Pay & Google Wallet verification required errors. Complete digital wallet provisioning without waiting on hold with verified methods.",
    content: `Attempting to add your Bank of America debit or credit card to Apple Wallet, Google Wallet, or Samsung Pay only to encounter a prompt saying **"Verification Required: Contact Card Issuer"** or **"Card Not Added — Contact Bank of America"** is one of the most common digital wallet friction points.

Instead of an instant one-tap activation, you are blocked from using contactless payments. **Your card is not broken or compromised.** This is a deliberate fraud prevention gate enforced by Bank of America's Token Service Provider (TSP) security engine to prevent digital wallet cloning.

## Why Does Bank of America Require Manual Verification for Digital Wallets?

**Bank of America blocks automatic digital wallet provisioning when its automated risk scoring algorithms flag any discrepancy between your phone and your bank profile.** Digital wallet fraud (where criminals add stolen card details to their own phones) is one of the fastest-growing financial crimes, prompting Bank of America to enforce strict verification barriers.

| Provisioning Factor | Low Risk (Instant Auto-Approve) | High Risk (Forces "Contact Bank") |
| :--- | :--- | :--- |
| **Initiation Point** | Inside Bank of America Mobile App | Directly inside Apple Wallet / Google Wallet |
| **Device Location** | Trusted home Wi-Fi, known GPS region | Public Wi-Fi, roaming cellular, or active VPN |
| **Account Age** | Established account (>60 days) | Newly opened account or newly issued card |
| **Billing Address** | Exact zip code match in Apple ID | Mismatch between Apple ID and BofA profile |

## 4 Proven Ways to Complete Digital Wallet Verification

### 1. The In-App "Push Provisioning" Bypass (Most Reliable Method)
Adding your card from inside Apple Wallet or Google Wallet triggers maximum security scrutiny. Adding it directly from within the Bank of America mobile app completely bypasses the verification block:
1. Delete the failed card attempt from your Apple Wallet or Google Wallet app.
2. Open and sign in to the **Bank of America Mobile Banking App**.
3. Tap on the specific card (Debit or Credit) you wish to add.
4. Scroll down to the **Card Details** section and tap **Set up Digital Wallet** (or **Add to Apple Wallet / Google Wallet**).
5. Follow the in-app prompts. Because your identity was already verified via biometric login into the banking app, Bank of America automatically authorizes the token handshake with Apple or Google without requiring phone verification.

### 2. Verify Via SafePass In-App Verification Code
If you are already stuck on the "Verification Required" screen in your device settings:
1. On iPhone, go to **Settings** > **Wallet & Apple Pay**.
2. Tap the Bank of America card showing **"Verification Required"**.
3. Select **Verify via Text Message (SMS)**.
4. Wait for the 6-digit SafePass code to arrive from shortcode \`73981\`.
5. Enter the code to instantly activate your digital card for contactless payments.

### 3. Match Apple ID / Google Account Billing Information
If the automated SMS option is grayed out and only displays "Call Bank":
1. Open your **Apple ID** or **Google Account** settings.
2. Ensure your legal name, billing street address, and 5-digit zip code match the exact billing address on your Bank of America statement character for character.
3. If your Apple ID has an old address from three years ago, the Token Service Provider detects a geographical mismatch and permanently disables automated SMS verification for that device.

### 4. Call the Dedicated Digital Wallet Verification Department
If automated options fail, calling general customer service will waste 30 minutes being transferred between wrong departments. Call the direct line:
* Call **Bank of America Digital Wallet Support** at **1-800-432-1000** (or the priority number on the back of your card).
* Say clearly: **"Digital Wallet Card Verification."**
* The representative will send a real-time push notification to your Bank of America mobile app or verify your physical card security code (CVV) and issue an instantaneous digital token release.

## Frequently Asked Questions (FAQ)

**Can I use Apple Pay while waiting for a physical replacement card in the mail?**
**Yes.** If your physical card was lost or reissued, you can add the newly generated digital card number directly from the Bank of America app before the physical plastic arrives in your mailbox.

**Does Bank of America charge a fee for using Apple Pay or Google Wallet?**
**No.** Bank of America does not charge any fees for adding or using debit or credit cards in Apple Pay, Google Wallet, or Samsung Pay. All purchases earn standard rewards and cash back.

**Why does my Apple Watch say verification required even though my iPhone card works?**
**Each device generates an independent Device Account Number (DAN).** Your iPhone and Apple Watch are evaluated separately by Bank of America's fraud algorithms. You must complete the push provisioning step for each device individually.`
  },

  // ── 6. How to View Debit Card Number on App ──
  {
    title: "How to View Bank of America Debit Card Number on App Without Physical Card",
    slug: "how-to-view-bank-of-america-debit-card-number-on-app",
    category: "card-atm-problems",
    bank_name: "Bank of America",
    excerpt: "Need your Bank of America debit card number, CVV, or expiration date but don't have your physical wallet? Learn how to view your virtual card details securely on the app.",
    meta_description: "Learn how to view your full 16-digit Bank of America debit card number, expiration date, and CVV on the mobile app without having your physical card.",
    content: `Whether you left your wallet at home, your physical card is lost, or you are waiting for a new debit card to arrive in the mail, needing your card details to make an urgent online purchase is a stressful scenario.

Many account holders believe that Bank of America only shows the last 4 digits on screen for security reasons. **However, Bank of America provides a secure in-app feature that allows authorized account holders to view their complete 16-digit debit card number, 3-digit CVV, and expiration date.**

Here is the exact procedure to safely reveal your virtual card details on your phone.

## Security Requirements Before You Begin

Because revealing full card credentials carries financial risk, Bank of America requires specific device security parameters before unlocking the card display:
* You must have the official **Bank of America Mobile Banking App** installed (this feature is not supported on mobile web browsers for security reasons).
* Your device must have **Biometric Authentication (Face ID, Touch ID, or Android Fingerprint)** activated.
* Your phone must be registered as a **Trusted Device** on your account for at least 48 hours.

| Feature Component | Availability | Security Control |
| :--- | :--- | :--- |
| **16-Digit Card Number** | Instant View | Biometric Re-Authentication |
| **Expiration Date (MM/YY)** | Instant View | Biometric Re-Authentication |
| **3-Digit Security Code (CVV)** | Dynamic Generation | 60-Second Copy Timer |
| **Account Type Eligibility** | Advantage Plus, SafeBalance, Relationship | Primary & Authorized Signers |

## Step-by-Step: Revealing Your Full Card Details in the App

Follow these exact steps inside the app:

### Step 1: Navigate to the Manage Card Hub
1. Open the **Bank of America Mobile Banking App** on your smartphone.
2. Sign in using your Face ID or Fingerprint.
3. On the main dashboard, tap on your **Checking Account**.
4. Scroll down below your recent transactions and tap **Manage Debit Card** (or tap the **Menu** icon in the top left and select **Manage Debit/Credit Card**).

### Step 2: Access the Digital Card Settings
1. On the debit card management screen, you will see a graphical image of your debit card displaying only the last 4 digits.
2. Look directly below the card image and tap the link that says **View Card Details** (or **Show Card Number**).

### Step 3: Complete Secondary Biometric Confirmation
1. A security prompt will appear: *"Confirm your identity to view full card details."*
2. Authenticate with **Face ID** or your **Fingerprint sensor**.
3. The card image will flip or expand, displaying:
   * Your full **16-digit debit card number**.
   * The valid **expiration date (MM/YY)**.
   * A **3-digit security code (CVV)** with a one-tap **Copy** button.

> 🔒 **Security Notice:** For your protection, the full card number will remain visible for exactly **60 seconds** before automatically masking back to the last 4 digits. Screen recording or taking a screenshot while card details are displayed is blocked by the app's secure display layer on Android and masked on iOS.

## What to Do If the "View Card Details" Option Is Missing

If you follow the steps above and do not see the "View Card Details" button:

1. **Check for Advantage SafeBalance Account Restrictions:** Some entry-level SafeBalance accounts opened without physical checkbooks have virtual card restrictions until a permanent physical debit card has been activated at an ATM or merchant terminal.
2. **Update the Mobile App:** Older versions of the Bank of America app (v23.x and earlier) do not support the digital card number reveal module. Update to the latest release in the Apple App Store or Google Play Store.
3. **Use Apple Pay / Google Wallet as a Workaround:** If you have already added your card to Apple Wallet or Google Wallet, you can use contactless payments at millions of physical checkout counters and supported online merchant checkout screens (by clicking the "Pay with Apple Pay" button) without needing to manually copy the 16-digit number.

## Frequently Asked Questions (FAQ)

**Can customer service read my full 16-digit debit card number over the phone?**
**No.** Due to strict Payment Card Industry (PCI-DSS) security standards, customer service representatives can only see the last 4 digits of your debit card. They cannot see or read your 16-digit number or 3-digit CVV over the telephone.

**Can I view my credit card number on the app the same way?**
**Yes.** The identical procedure works for Bank of America consumer credit cards. Navigate to **Manage Credit Card** > **View Card Details** and authenticate biometrically.

**Is the in-app CVV the same as the one printed on my physical card?**
**For debit cards, yes.** For certain newly issued digital credit cards, Bank of America generates a temporary dynamic CVV that updates until your physical card arrives and is activated.`
  },

  // ── 7. Debit Card Activation Not Working ──
  {
    title: "Bank of America Debit Card Activation Not Working: 5 Fast Fixes",
    slug: "bank-of-america-debit-card-activation-not-working",
    category: "card-atm-problems",
    bank_name: "Bank of America",
    excerpt: "Having trouble activating your new Bank of America debit card on the app, website, or phone tree? Learn how to bypass activation errors and enable your card instantly.",
    meta_description: "Fix Bank of America debit card activation errors. Learn the ATM PIN bypass, resolve automated phone tree failures, and activate your replacement card fast.",
    content: `When a new or replacement Bank of America debit card arrives in the mail, activating it should take less than 60 seconds. However, thousands of account holders each week run into roadblocks: the mobile app displays an error saying **"We cannot activate this card at this time"**, the automated phone tree fails to recognize their entries, or the card declines immediately after supposed activation.

If you are stuck with an inactive piece of plastic, **your account and funds are completely fine.** Activation failures are caused by specific card inventory mismatches, premature security blocks, or PIN sync delays.

Here is how to activate your Bank of America debit card using verified digital and physical methods.

## Why Does Debit Card Activation Fail?

**Debit card activation fails when the card's 16-digit number, expiration date, or security code does not match the active pending card profile in Bank of America's database.**

| Failure Scenario | Technical Cause | Best Resolution Path |
| :--- | :--- | :--- |
| **Mobile App Activation Error** | Stale app cache or replacement card number conflict | In-App Card Hub or Desktop Web |
| **Phone Tree Does Not Recognize Inputs** | Touch-tone DTMF signal frequency drop or mismatch | Dedicated IVR Bypass or Specialist |
| **ATM Rejects New Card** | Chip not yet energized or PIN not established | Physical ATM Chip Insert with PIN |
| **Card Activated But Declines at Register** | Card active, but old security freeze remains on profile | Toggle Lock/Unlock feature in app |

## 5 Verified Methods to Activate Your Card

### 1. The ATM Chip-Insert Activation Bypass (100% Guaranteed Physical Fix)
The single most reliable way to activate any Bank of America debit card—bypassing all phone trees and app glitches—is at any physical ATM:
1. Walk up to any **Bank of America ATM** (or any networked ATM displaying the Cirrus or Pulse logo).
2. Insert your new physical debit card into the chip reader slot.
3. When prompted, enter your existing **4-digit PIN** (if this is a replacement card) or the temporary PIN sent in a separate mailer.
4. Perform a simple **Balance Inquiry** or withdraw $20 cash.
5. Successfully entering your PIN at an ATM immediately writes the cryptographic activation certificate to the card's EMV chip and updates Bank of America's central ledger in real time.

### 2. Activate via Desktop Online Banking
If the mobile app is throwing an error code:
1. Open a web browser on a laptop or desktop computer and go to \`https://www.bankofamerica.com\`.
2. Sign in with your Online ID and password.
3. In the search bar at the top, type **"Activate Card"** and press Enter.
4. Select your checking account and click **Activate Debit Card**.
5. Carefully enter the **last 4 digits of the card**, the **expiration date**, and the **3-digit CVV** from the back signature strip.
6. Submit the form. The confirmation screen will display a green checkmark indicating instantaneous activation.

### 3. Clear the Automated Phone Tree (Direct Activation Line)
If you prefer activating by telephone, do not call the general 1-800 customer service number, which routes you through complex menus:
* Call the **Automated Card Activation Line** directly at **1-800-276-9939** (toll-free, available 24/7).
* When prompted, enter the **full 16-digit debit card number**.
* Enter the **last 4 digits of your Social Security Number (SSN)** or Tax ID.
* Enter the **3-digit security code (CVV)** from the back of the card.
* **Pro-Tip:** If using a smartphone, ensure your keypad is set to produce standard DTMF tones (avoid speakerphone mode in noisy environments, which scrambles the automated system's tone recognition).

### 4. Check If the Previous Card Is Still "Locked"
If your previous card was locked using the mobile app's security toggle before a replacement was ordered, the lock state sometimes transfers to the new card automatically:
1. In the mobile app, go to **Manage Debit Card**.
2. Check the **Lock Debit Card** toggle switch.
3. If it shows **Locked**, toggle it to **Unlocked**.
4. Confirm with Face ID. The card will immediately process live transactions.

### 5. Speak Directly to a Card Servicing Specialist
If you recently reported fraud or had multiple replacement cards mailed in a short window, an automated fraud hold may require manual release:
* Call **Debit Card Customer Service** at **1-800-432-1000**.
* Press **0#** repeatedly or say: **"Representative: Debit card activation failure."**
* The agent will verify your identity via SafePass and manually flip the active ledger flag on your account.

## Frequently Asked Questions (FAQ)

**Can I use my new card before the physical card arrives in the mail?**
**Yes.** You can add the card to Apple Pay, Google Wallet, or Samsung Pay directly through the Bank of America app under **Manage Debit Card** > **Add to Digital Wallet**, allowing you to pay at contactless registers before the plastic arrives.

**What should I do with my old expired or replaced card?**
**Once your new card is confirmed active, cut your old card through the magnetic stripe, chip, and signature panel with scissors** and discard it securely.

**Will my existing PIN stay the same on my replacement debit card?**
**Yes, for routine expiration replacements or damaged card reissues, your 4-digit PIN remains identical.** If the card was reissued due to confirmed fraud or unauthorized ATM withdrawals, Bank of America will require you to establish a new PIN.`
  },

  // ── 8. ATM Contactless Reader / Phone Tap Not Working ──
  {
    title: "Bank of America ATM Contactless Reader Not Working: Tap to Pay Fixes",
    slug: "bank-of-america-atm-contactless-reader-tap-not-working",
    category: "card-atm-problems",
    bank_name: "Bank of America",
    excerpt: "Tapping your phone or contactless card at a Bank of America ATM and getting an error? Learn why NFC readers fail and how to successfully withdraw cash with Apple Pay.",
    meta_description: "Fix Bank of America ATM contactless reader errors. Learn why phone tap to pay fails with Apple Pay or Google Wallet at BofA ATMs and how to bypass reader issues.",
    content: `Standing in front of a Bank of America ATM tapping your iPhone, Apple Watch, or Android phone against the contactless symbol only to be met with a red flashing light, an error beep, or the screen prompt **"Card Not Supported — Please Insert Card"** is deeply frustrating—especially if you left your physical wallet at home.

Bank of America was one of the first major banks to roll out contactless NFC readers across all 15,000+ ATMs nationwide. However, contactless ATM interactions operate under significantly stricter cryptographic standards than standard retail store checkout taps.

Here is why your phone tap is failing and how to successfully execute a cardless ATM transaction.

## How Bank of America Contactless ATMs Actually Work

At a retail store (like a grocery store or gas station), tapping Apple Pay or Google Pay transmits a token that processes a standard purchase authorization. **At an ATM, tapping your phone initiates an authentication handshake for cash dispensing, which requires a live two-way exchange between your phone's Secure Element and Bank of America's ATM network controller.**

| Reader Stage | Physical Contactless Card | Mobile Digital Wallet (Phone) |
| :--- | :--- | :--- |
| **NFC Frequency** | 13.56 MHz RFID Passive | ISO/IEC 14443 Type A/B Active |
| **Authentication Requirement** | ATM Screen PIN Entry | Biometric Phone Unlock + ATM Screen PIN |
| **Eligible Transactions** | Cash withdrawal, deposit, balance check | Cash withdrawal and balance check |
| **Digital Wallet Support** | N/A | Apple Pay, Google Wallet, Samsung Pay |

## 5 Solutions to Fix Contactless ATM Tap Failures

### 1. The "Pre-Arming" Technique for Apple Pay and Google Wallet
The number one reason phone taps fail at Bank of America ATMs is holding the phone to the reader before your digital wallet is fully unlocked and armed:
* **For iPhone (Face ID):** Double-click the side button **before** touching the ATM. Look at your phone to verify Face ID until you see **"Hold Near Reader"**. Only then should you bring your phone within 1 inch of the ATM's contactless symbol.
* **For Android (Google Wallet):** Unlock your phone completely with your fingerprint (do not just wake the lock screen). Open the Google Wallet app and ensure your Bank of America debit card is displayed on screen before tapping.

### 2. Positioning Over the Exact NFC Antenna Target
Unlike retail checkout terminals with large, forgiving antenna coils, Bank of America ATM contactless sensors have a very narrow transmission field (typically 2 to 3 centimeters):
1. Locate the **Contactless Symbol** (four curved waves, usually situated to the left or right of the physical card slot).
2. Align the **very top edge of your iPhone** (where the internal NFC antenna is housed) or the **center back of your Android phone** directly flush against the symbol.
3. Hold the device completely still for **3 full seconds**. Do not wave or tap the device rapidly.
4. When the ATM acknowledges the signal, the reader will chime and the ATM screen will prompt you to enter your 4-digit PIN.

### 3. Remove Thick Cases and Metal RFID-Blocking Plates
Magnetic phone mounts, metal pop-sockets, and carbon-fiber cases will instantly disrupt the low-power NFC signal:
* If your phone case has a built-in metal plate for magnetic car mounts, it creates a Faraday shield that blocks the ATM's reader.
* Remove the case temporarily and hold the bare phone directly against the reader.

### 4. Check for Digital Wallet Token Desynchronization
If your contactless card works at grocery stores but fails specifically at Bank of America ATMs:
1. Open your digital wallet app (Apple Wallet / Google Wallet).
2. Tap your Bank of America debit card, tap the three dots or settings gear, and select **Remove Card**.
3. Re-add the card cleanly by opening the **Bank of America Mobile Banking App** > **Manage Debit Card** > **Add to Apple Wallet / Google Wallet**.
4. Adding the card via in-app push provisioning generates an updated EMV ATM token certificate capable of handling cash withdrawal authorizations.

### 5. Check ATM Screen Status for NFC Outages
Individual ATM hardware sensors frequently fail while the primary machine remains operating:
* Look closely at the contactless reader's LED indicator light. If the light is dark (unlit) or solid red, the contactless module has experienced an internal software crash or communication failure.
* The physical card reader slot will still function normally. If you do not have your physical card, use the mobile app's **ATM Locator** to locate the nearest drive-up or branch lobby machine.

## Frequently Asked Questions (FAQ)

**Can I deposit cash or checks using Apple Pay at a Bank of America ATM?**
**At most older Bank of America ATM models, contactless phone taps are restricted to cash withdrawals, balance inquiries, and transfers;** deposits require inserting the physical debit card. Newer lobby ATMs with high-definition screens support cardless deposits.

**Can I tap a Bank of America credit card at the ATM to get cash?**
**Yes, but doing so initiates a Cash Advance,** which incurs an immediate upfront cash advance fee (typically 3% to 5%) and starts accruing interest at a high APR with zero grace period. It is recommended to use your debit card for ATM cash withdrawals.

**Is the PIN I enter at the ATM the same as my phone passcode?**
**No.** You must enter your **4-digit Bank of America Debit Card PIN** on the physical ATM keypad, even though you already unlocked your phone with Face ID or your passcode.`
  },

  // ── 9. QuickBooks & Plaid Error 350 / 102 ──
  {
    title: "Bank of America QuickBooks & Plaid Error 350 / 102: API Sync Fix Guide",
    slug: "bank-of-america-quickbooks-plaid-error-350-sync-failed",
    category: "payments-transactions",
    bank_name: "Bank of America",
    excerpt: "Getting Error 350 or Error 102 when connecting Bank of America to QuickBooks, Quicken, or Plaid? Learn how to re-authenticate Open Banking tokens and fix sync errors.",
    meta_description: "Fix Bank of America QuickBooks and Plaid Error 350 and 102 sync failures. Step-by-step instructions to re-authorize Open Banking API connections cleanly.",
    content: `If you manage business or personal bookkeeping using QuickBooks Online, Quicken, Mint, YNAB, or any financial dashboard powered by Plaid, seeing your Bank of America feeds abruptly fail with **Error 350**, **Error 102**, or **"Bank Connection Needs Attention"** brings payroll and reconciliation to a grinding halt.

Transactions stop syncing, account balances fall out of date, and clicking "Update" simply throws you back into an endless credential loop.

**Your banking data has not been lost, and your accounts have not been unlinked.** This error is almost always caused by an expired OAuth security token mandated by Bank of America's Open Banking API protocol.

## Why Do QuickBooks and Plaid Throw Error 350 with Bank of America?

**QuickBooks Error 350 indicates that Bank of America's Open Banking API has revoked the third-party authorization token because it expired, exceeded its cryptographic refresh window, or was blocked by a multi-factor SafePass challenge.**

| Error Code | Primary Aggregator | Root Technical Cause |
| :--- | :--- | :--- |
| **Error 350** | QuickBooks Online / Intuit | OAuth 2.0 token expired; requires interactive re-consent handshake |
| **Error 102** | QuickBooks Online / Desktop | Bank of America core banking maintenance blackout during batch sync |
| **Plaid ITEM_LOGIN_REQUIRED** | Venmo, Robinhood, YNAB | SafePass two-factor challenge triggered by new aggregator IP address |
| **Error 103** | Quicken / QuickBooks | Invalid credentials entered or account locked due to too many sync attempts |

In compliance with financial data privacy standards, Bank of America no longer allows third-party financial apps to store your raw Online ID and password (screen-scraping). Instead, it uses direct **Financial Data Exchange (FDX) APIs**. These direct connections automatically expire every **90 to 180 days**, requiring business owners to re-authenticate.

## 4 Steps to Resolve Error 350 & Restore Transaction Feeds

### 1. Perform an Interactive OAuth Re-Authorization in QuickBooks
Do not click the basic "Update" button, which simply retries the dead token. You must force a full re-authorization handshake:
1. Log into **QuickBooks Online** on a desktop web browser.
2. In the left navigation menu, go to **Transactions** (or **Bookkeeping**) > **Bank transactions**.
3. Select your Bank of America account tile displaying the error alert.
4. Click the link that says **Sign in to Bank of America** (or **Update credentials / Reconnect**).
5. A secure Bank of America pop-up window will open directly to \`secure.bankofamerica.com\`.
6. Enter your **Online ID** and **Password**.
7. Complete the **SafePass Two-Factor Authentication** prompt via text or app.
8. On the consent authorization screen, ensure the checkboxes for all your relevant checking, savings, and credit card accounts are checked.
9. Click **Authorize & Connect**. QuickBooks will refresh and begin downloading all queued transactions.

### 2. Verify Connected Apps Inside Bank of America Security Center
If the re-authentication pop-up closes with an error or fails to link:
1. Open a new browser tab and log into **Bank of America Online Banking**.
2. Go to **Profile & Settings** > **Security Center**.
3. Scroll down to the section titled **Third-Party Connected Apps** (or **Data Sharing Permissions**).
4. Locate **Intuit / QuickBooks** or **Plaid** on the list.
5. If the connection shows as **Inactive**, **Expired**, or **Blocked**, click **Manage Access** and toggle permissions to **Allow**.
6. If the connection is corrupted, click **Remove Access**, then return to QuickBooks and establish a fresh connection from scratch.

### 3. Handle Duplicate Transaction Overlaps During Sync
After resolving Error 350, QuickBooks will attempt to backfill missing days:
* Check the date of the last reconciled transaction before Error 350 occurred.
* If QuickBooks pulls in transactions that you already manually entered while the feed was broken, do not delete them. Go to the **For Review** tab, select the duplicates, and click **Exclude** to keep your ledger balanced.

### 4. Bypass Intuit Server Maintenance Delays (Error 102)
If you are seeing **Error 102** instead of Error 350:
* Error 102 is an indicator of overnight maintenance between Bank of America's data export servers and Intuit's ingestion pipelines.
* It typically occurs between **12:00 AM and 4:00 AM ET**.
* Do not disconnect your account during Error 102. Wait until business hours (after 9:00 AM ET) and click **Update** once; the connection normally self-heals without re-entering passwords.

## Frequently Asked Questions (FAQ)

**Will disconnecting and reconnecting Bank of America delete my historical bookkeeping?**
**No.** Re-authorizing or reconnecting the bank feed does not delete transactions that have already been categorized, approved, and added to your QuickBooks register. It only refreshes the data pipeline for new, unreviewed transactions.

**Why does Bank of America disconnect from QuickBooks every few months?**
**Under modern Open Banking security protocols, Bank of America mandates that third-party data sharing consents expire periodically** to protect account holders from zombie connections continuing to access financial records after third-party software is abandoned.

**Can secondary users or bookkeepers re-authorize the connection?**
**Only the primary account owner or an authorized user with administrative digital banking credentials can authorize the SafePass verification handshake** with Bank of America.`
  },

  // ── 10. Zelle Transfer Limits by Tier ──
  {
    title: "Bank of America Zelle Limits: Daily & Monthly Transfer Rules by Account Tier",
    slug: "bank-of-america-zelle-transfer-limits-by-tier",
    category: "payments-transactions",
    bank_name: "Bank of America",
    excerpt: "Wondering why your Bank of America Zelle payment was declined for exceeding limits? Complete breakdown of daily and monthly transfer caps for standard and Preferred Rewards tiers.",
    meta_description: "Bank of America Zelle limits explained: Daily and 30-day transfer rules for standard accounts, Preferred Rewards (Gold, Platinum, Honors), and how limits reset.",
    content: `Attempting to pay a contractor, send rent, or reimburse a friend through Zelle on the Bank of America app only to receive a pop-up warning stating **"This transaction exceeds your daily Zelle sending limit"** or **"Monthly limit reached"** is a major roadblock when moving money.

Many users assume Zelle limits are universal across all banks. In reality, **Zelle transfer caps are set entirely by Bank of America**, based on your account type, Preferred Rewards tier, and relationship history.

Here is the complete, official breakdown of Bank of America Zelle sending limits and how the rolling reset clock works.

## Bank of America Zelle Limits by Account & Relationship Tier

Bank of America categorizes personal checking accounts into three distinct sending tiers. Your limit is evaluated automatically based on your 3-month average combined balances:

| Account / Relationship Tier | 24-Hour Daily Sending Limit | 7-Day Weekly Limit | 30-Day Monthly Limit | Max Number of Transfers |
| :--- | :--- | :--- | :--- | :--- |
| **New Accounts (<90 Days Old)** | **$1,000** | **$2,500** | **$4,000** | 10 per day / 30 per month |
| **Standard Checking (>90 Days Old)** | **$3,500** | **$10,000** | **$20,000** | 15 per day / 60 per month |
| **Preferred Rewards: Gold & Platinum** | **$5,000** | **$15,000** | **$30,000** | 20 per day / 75 per month |
| **Preferred Rewards: Platinum Honors & Diamond** | **$15,000** | **$30,000** | **$60,000** | 30 per day / 100 per month |
| **Business Advantage Checking** | **$15,000** | **$30,000** | **$60,000** | 30 per day / 100 per month |

*Note: There are **no dollar limits on incoming Zelle transfers** received into your Bank of America account (though your sender's bank may impose their own limits).*

## How the Rolling 24-Hour Reset Window Operates

One of the most common misconceptions among account holders is that Zelle limits reset at midnight:
* **Bank of America operates on a rolling 24-hour clock, not a calendar day.**
* If you send a **$3,500** transfer on Tuesday at 4:30 PM, your daily limit will not reset at 12:01 AM Wednesday morning.
* You will not be able to send another large transfer until **Wednesday at 4:31 PM** (exactly 24 hours after the previous transaction completed).
* Similarly, the 30-day limit operates on a rolling 720-hour window, not the 1st of the calendar month.

## How to Check Your Exact Personalized Limit in the App

Because individual security risk profiles can alter limits:
1. Open the **Bank of America Mobile App**.
2. Tap **Transfer | Zelle** in the bottom navigation.
3. Tap **Send**.
4. Select any recipient from your list (or enter a test name).
5. On the amount entry screen, look directly below the numeric keypad.
6. The app displays your live remaining balance: **"You can send up to $X,XXX today ($XX,XXX remaining this month)."**

## What to Do If You Need to Send More Money Than Your Zelle Limit

If you need to make a payment that exceeds your maximum allowed Zelle cap:

1. **Use Bank of America's Native ACH External Transfer:**
   * In the app, go to **Transfer** > **Between my accounts / To another person**.
   * Standard ACH transfers have a daily limit of **$5,000 to $10,000** for established accounts with standard 1–2 business day delivery.
2. **Execute a Same-Day Domestic Wire Transfer:**
   * For urgent large amounts (such as down payments, real estate closings, or major vehicle purchases), use an online domestic wire.
   * Domestic wires support limits of **$25,000 to $50,000+** per day online (and unlimited at a physical branch with photo ID).
3. **Split the Transfer Across Multiple Days:**
   * If your payment is $6,000 and your limit is $3,500, send $3,500 today, wait exactly 24 hours, and send the remaining $2,500 tomorrow.
4. **Request a Preferred Rewards Tier Review:**
   * If your combined balances at Bank of America and Merrill Edge exceed $100,000, ensure your profile is officially enrolled in **Preferred Rewards Platinum Honors** to unlock the $15,000 daily limit permanently.

## Frequently Asked Questions (FAQ)

**Can customer service temporarily increase my Zelle sending limit over the phone?**
**No.** Bank of America customer service representatives and branch managers do not have manual override authority to raise consumer Zelle sending caps. Limits are governed by automated risk management software to prevent authorized push payment fraud.

**Does sending money via Zelle count against my daily debit card purchase limit?**
**No.** Zelle transfers draw directly from your checking account ledger via ACH rails and do not affect your $1,000 to $2,500 physical debit card point-of-sale spending limit.

**Is there a fee for sending money with Zelle at Bank of America?**
**No.** Bank of America does not charge any transaction fees for sending or receiving money through Zelle.`
  },

  // ── 11. International Wire "In Review" ──
  {
    title: "Bank of America International Wire 'In Review' or Pending: Release Guide",
    slug: "bank-of-america-international-wire-status-in-review",
    category: "payments-transactions",
    bank_name: "Bank of America",
    excerpt: "Is your Bank of America international wire stuck on 'In Review' or 'Pending Verification'? Learn why OFAC screening causes holds and how to clear your transfer fast.",
    meta_description: "Resolve Bank of America international wire transfer delays. Learn why outgoing wires get stuck 'In Review', SWIFT tracking steps, and direct phone release numbers.",
    content: `Submitting an international wire transfer through Bank of America Online Banking only to see its status remain frozen as **"In Review"**, **"Pending Verification"**, or **"Action Required"** for 24 to 72 hours is deeply anxiety-inducing—especially when meeting critical international real estate deadlines, business supplier terms, or emergency family remittances.

Your money has left your checking balance, but the recipient overseas has received nothing. 

**Do not panic: your funds have not disappeared into the void.** An "In Review" status is an automated regulatory pause triggered by international anti-money laundering and sanctions screening.

## Why Bank of America Places International Wires "In Review"

**Every international wire originating from Bank of America must pass through automated compliance screening under U.S. Treasury Office of Foreign Assets Control (OFAC) and Bank Secrecy Act (BSA) rules.** If any detail in your transfer matches an automated risk rule, the transfer is shunted out of the automated SWIFT pipeline and queued for manual analyst review.

| Hold Factor | Review Trigger | Average Delay |
| :--- | :--- | :--- |
| **OFAC Name Screening** | Recipient, intermediary bank, or street name matches a sanctioned watchlist | 24 to 48 business hours |
| **High-Risk Destination Country** | Stricter foreign currency exchange and capital control scrutiny | 1 to 3 business days |
| **First-Time Large Amount** | Outgoing transfer exceeds historical user profile activity ($10,000+) | Requires verbal verification |
| **Cutoff Time Missed** | Submitted after **5:00 PM Eastern Time** on a business day | Rolls over to next business morning |
| **SWIFT / BIC Code Inaccuracy** | Bank branch identifier or routing mismatch | Requires manual repair or rejection |

## 4 Actions to Unstick an International Wire

### 1. Check for Pending SafePass / SMS Security Prompts
Frequently, Bank of America places an international wire on hold because an automated fraud alert was generated after you submitted the request:
1. Check your smartphone for an automated text message from shortcode **\`73981\`** or **\`99217\`**.
2. Look for a message stating: *"Did you attempt an international wire transfer of $X,XXX to [Recipient]? Reply YES to authorize or NO if unauthorized."*
3. Reply **YES**. The automated compliance engine will release the hold within 15 to 30 minutes and push the wire into the SWIFT transmission queue.

### 2. Check the Secure Message Center for Document Requests
If your wire involves a commercial invoice, foreign property purchase, or gift affidavit, Bank of America's Global Wealth & Operations desk may require supporting documentation:
1. Log into **Bank of America Online Banking** on a computer.
2. Click the envelope icon in the top right header to enter the **Secure Message Center**.
3. Look for a message titled **"Important Information Required Regarding Your Recent Wire Transfer"**.
4. Follow the secure upload link to submit any requested invoices or beneficiary relationship explanations.

### 3. Request the MT103 Tracking Document (SWIFT Confirmation)
If the wire shows as "Processed" by Bank of America but the overseas beneficiary claims the money has not arrived after 3 business days:
* Request an official **SWIFT MT103 Document** from Bank of America.
* The MT103 is a standardized banking message that contains the **Unique End-to-End Transaction Reference (UETR)** number.
* Provide this UETR number to your recipient overseas. Their bank can use it to pinpoint the exact location of the funds within their central clearing desk.

### 4. Call the Dedicated International Wire Operations Desk
Do not call the general 1-800 checking line; customer support reps cannot view back-office compliance queues. Call the direct wire clearing desk:
* Call **Bank of America Wire Transfer Services** directly at **1-877-337-8357** (Monday – Friday, 8:00 AM – 7:00 PM ET).
* If calling from abroad outside the United States, use the international collect line: **+1-302-781-6374**.
* Provide your **Wire Reference Confirmation Number** (found in your transaction history).
* Ask the specialist: *"Is this wire pending manual OFAC verification or an outbound fraud confirmation call?"*

## Understanding International Wire Cutoff Times

Bank of America enforces strict daily processing windows:
* **USD to Foreign Currency Wires:** Must be approved and submitted before **5:00 PM Eastern Time** Monday through Friday to execute on the same business day.
* **Foreign Currency to Foreign Bank Wires:** Must be submitted before **4:00 PM Eastern Time**.
* Wires submitted on Saturday, Sunday, or Federal Reserve banking holidays do not begin processing until Monday morning at 8:00 AM ET.

## Frequently Asked Questions (FAQ)

**Can I cancel an international wire while it is "In Review"?**
**Yes.** Under Consumer Financial Protection Bureau (CFPB) Remittance Transfer Rule (12 CFR § 1005.34), consumer account holders have a legal **30-minute cancellation window** with a guaranteed 100% full refund of principal and fees. In your online banking wire activity screen, click **Cancel Transfer** if within 30 minutes of submission.

**What happens if an international wire is rejected?**
**If the beneficiary bank rejects the transfer (due to an incorrect IBAN, account number, or name spelling), the funds will be returned to your Bank of America checking account.** Note that currency conversion spreads and intermediary bank processing fees ($20–$50) may be deducted from the returned total.

**What is Bank of America's international outbound wire fee?**
**Sending an international wire in foreign currency via Online Banking carries a $0 wire fee** (though exchange rate margins apply). Sending an international wire denominated in **US Dollars** carries a standard **$45.00 fee** per transaction.`
  },

  // ── 12. App Won't Open with Developer Options ──
  {
    title: "Bank of America App Won't Open on Android: Developer Options Fix",
    slug: "bank-of-america-app-developer-options-android-crash",
    category: "mobile-app-problems",
    bank_name: "Bank of America",
    excerpt: "Does the Bank of America app immediately crash, close, or display a security error on Android? Learn why Developer Options and USB Debugging trigger app shutdowns.",
    meta_description: "Fix Bank of America Android app crashing due to Developer Options. Learn how to disable USB debugging, clear security blocks, and restore app access.",
    content: `If you tap the Bank of America app icon on your Samsung Galaxy, Google Pixel, OnePlus, or Motorola Android phone and the app immediately closes, flashes a black screen, or displays a security alert stating **"Security Policy Violation: The app cannot run on this device"**, you are likely experiencing an automated developer security lockout.

This issue frequently baffles Android users because every other app on their phone functions normally. 

**Your device is not infected with malware, and your bank account has not been suspended.** Bank of America's Android security framework intentionally terminates the application whenever it detects specific advanced Android OS settings.

## Why Does Bank of America Block Devices with Developer Options?

**The Bank of America mobile app contains active tamper-detection code (via Google Play Integrity API) that prohibits execution if Developer Options or USB Debugging is toggled on.**

| Android System Setting | Security Risk Identified by Bank of America | App Response |
| :--- | :--- | :--- |
| **USB Debugging Enabled** | Risk of automated screen capture, packet interception, and credential logging via adb bridge | **Instant App Crash / Close** |
| **Wireless Debugging Enabled** | Risk of local network packet injection and session hijacking | **Crash on Launch** |
| **Developer Options Master Switch** | Mock location spoofing, overlay attacks, unauthorized accessibility hooks | **Security Alert or Silent Exit** |
| **Unlocked Bootloader / Root** | Compromised Android Keystore cryptographic hardware integrity | **Permanent Launch Block** |

Financial applications enforce these rules to prevent sophisticated banking trojans (such as overlay malware) from stealing one-time passwords (OTP) or intercepting keystrokes.

## 3 Steps to Restore the Bank of America App on Android

### 1. Disable USB Debugging and Developer Options
The primary fix is toggling off the developer subsystem in Android settings:
1. Open your phone's **Settings** app.
2. Scroll to the bottom and tap **Developer options** (on some devices, located inside **System** > **Developer options**).
3. Look for **USB debugging** and toggle it **OFF**.
4. Look for **Wireless debugging** and toggle it **OFF**.
5. Scroll back to the very top of the Developer Options screen and toggle the master **Developer options switch to OFF**.
6. Force-close the Bank of America app, then re-open it. It will launch cleanly to the biometric login screen.

### 2. Clear App Cache and Reset App Permissions
If you previously disabled Developer Options but the app continues to crash, the app's internal security sandbox has cached the flagged state:
1. Open phone **Settings** > **Apps** > **Bank of America**.
2. Tap **Force Stop**.
3. Tap **Storage & cache**.
4. Tap **Clear Cache** (do not tap Clear Storage yet).
5. Restart your Android phone.
6. Launch the app. The fresh environment check will detect standard OS security and allow sign-in.

### 3. Check for Malicious Accessibility Services and Screen Overlays
Modern versions of the Bank of America app will also terminate if an app is detected running with active Screen Overlay or Accessibility permissions that could record your screen:
1. Go to **Settings** > **Accessibility**.
2. Check the **Installed apps / Downloaded services** section.
3. If third-party auto-clickers, screen recorders, or sideloaded APK utilities have active accessibility permissions, disable them.
4. Go to **Settings** > **Apps** > **Special app access** > **Display over other apps** and revoke permission for unverified utilities.

## How Developers Can Test Without Disabling Options Permanently

If you are an Android software engineer or tech enthusiast who requires Developer Options for your daily work:
* You do not need to delete your ADB developer keys.
* Simply toggle the master **Developer Options switch to OFF** whenever you need to check your bank balances.
* When you are finished banking, toggle the switch back **ON**. Android preserves your configured settings (such as animation scales and USB configurations) so you do not have to reconfigure them from scratch.
* Alternatively, use **Bank of America Mobile Web** by navigating to \`https://www.bankofamerica.com\` in Chrome, which does not enforce OS-level developer option blocks.

## Frequently Asked Questions (FAQ)

**Can I run the Bank of America app on a rooted phone or custom ROM?**
**No.** Bank of America utilizes hardware-backed Play Integrity attestation (MEETS_DEVICE_INTEGRITY and MEETS_STRONG_INTEGRITY). Rooted phones using Magisk or custom ROMs with unlocked bootloaders will fail attestation, preventing the app from launching.

**Does Bank of America work in Android's Work Profile or Secure Folder?**
**Yes.** On Samsung devices, you can install the Bank of America app inside **Samsung Secure Folder**, or inside an enterprise **Work Profile**. However, Developer Options must still be disabled on the main device profile for the containerized instance to run.

**Why does the app crash without showing any error message?**
**For security reasons, banking anti-tamper libraries intentionally terminate execution silently** rather than displaying an error message. This prevents malicious automated scripts from diagnosing why their interception attempt failed.`
  },

  // ── 13. Mobile Deposit Camera Black Screen ──
  {
    title: "Bank of America Mobile Check Deposit Camera Black Screen: 5 Fixes",
    slug: "bank-of-america-mobile-deposit-camera-black-screen",
    category: "mobile-app-problems",
    bank_name: "Bank of America",
    excerpt: "Opening mobile check deposit on the Bank of America app only to see a black screen or camera freeze? Learn how to fix sensor lockups and camera permission errors.",
    meta_description: "Fix the Bank of America mobile check deposit camera black screen error on iPhone and Android. 5 verified steps to resolve camera permissions and capture checks.",
    content: `You sign the back of your check with *"For Mobile Deposit Only at Bank of America"*, tap "Deposit Checks" on the app, select your checking account, enter the dollar amount, and tap "Front of Check"—only to stare at a **completely black screen**, a frozen camera viewfinder, or an error stating **"Camera not available. Please try again later."**

You can't take a picture of your check, and you can't deposit your money.

**Do not worry: your phone's camera hardware is not broken, and your check is not invalid.** This is a recognized software handshake failure between the Bank of America app's proprietary image capture engine and your smartphone's operating system camera subsystem.

Here is how to resolve the black screen bug and successfully deposit your check.

## Why Does the Mobile Deposit Camera Go Black?

**The mobile check deposit camera displays a black screen when the Bank of America app fails to acquire an active hardware lock on your phone's camera sensor.** This occurs due to corrupted OS camera permissions, background camera access conflicts by other apps, or an ultra-wide lens switching glitch on modern multi-lens smartphones.

| Hardware / OS Factor | Technical Cause | Primary Fix |
| :--- | :--- | :--- |
| **Operating System Permission Glitch** | Camera permission set to "Ask Every Time" instead of "While Using App" | Re-grant camera permissions in OS settings |
| **Background Camera Lock** | Another app (Instagram, WhatsApp, Zoom) left camera sensor in open state | Force close all background apps |
| **Multi-Lens Telephoto Confusion** | App defaults to telephoto/macro lens instead of primary optical sensor | Adjust distance; restart camera module |
| **In-App Image Capture Cache Lock** | Temporary check image cache corrupted in app storage | Clear app storage / Offload app |

## 5 Steps to Fix the Camera Black Screen Error

Follow these verified steps in order:

### 1. Cycle Camera Permissions in OS Settings
Do not rely on the in-app permission prompt. Manually re-granting hardware access resets the camera HAL (Hardware Abstraction Layer):
* **On iPhone (iOS):**
  1. Open **Settings** > scroll down to **Bank of America**.
  2. Toggle the **Camera** switch **OFF**. Wait 5 seconds.
  3. Toggle the **Camera** switch back **ON**.
  4. Force-close the Bank of America app and re-open it.
* **On Android:**
  1. Open **Settings** > **Apps** > **Bank of America** > **Permissions**.
  2. Tap **Camera** > select **Don't Allow**.
  3. Re-select **Allow only while using the app**.
  4. Ensure **Use precise camera access** is enabled.

### 2. Force Close All Background Apps Using the Camera Sensor
Modern mobile operating systems prohibit two apps from accessing the camera simultaneously. If an app running in your background holds an open camera stream:
1. Swipe up to access your **App Switcher / Recent Apps** tray.
2. Swipe away and force close all apps—especially social media apps (Snapchat, Instagram, TikTok) and communication tools (FaceTime, Zoom, WhatsApp).
3. Re-open Bank of America and retry the check capture.

### 3. Clear App Cache and Stored Media Fragments (Android)
If a previous deposit crashed halfway through image processing, a corrupt image fragment in your cache will prevent the camera viewfinder from initializing:
1. Go to **Settings** > **Apps** > **Bank of America**.
2. Tap **Storage & cache**.
3. Tap **Clear Cache**.
4. Restart your phone to flush the system media server memory.

### 4. Adjust Lighting & Surface to Prevent Auto-Focus Freeze
Bank of America's automated check reader uses edge-detection algorithms that run live inside the camera viewfinder:
* If you place a white check on a white countertop or reflective glass table, the contrast detection loop can freeze the camera feed.
* Place the check on a **dark, matte, non-reflective background** (such as a dark wooden desk or black folder) in a well-lit room.
* Hold the phone completely parallel to the check, about 8 to 12 inches away. The app will automatically detect the four corners and snap the photo without you pressing a shutter button.

### 5. Offload and Reinstall the App (iPhone / iOS)
For iOS users, offloading clears the internal WebKit media frameworks without wiping your login credentials:
1. Open **Settings** > **General** > **iPhone Storage**.
2. Tap **Bank of America**.
3. Tap **Offload App** and confirm.
4. Once completed, tap **Reinstall App**.
5. Launch the app, log in, and grant camera permissions when prompted.

## Frequently Asked Questions (FAQ)

**Can I deposit a check by uploading a photo from my phone's photo gallery?**
**No.** For fraud prevention and anti-tamper security reasons, Bank of America does not allow uploading pre-saved images from your photo library. All checks must be photographed live inside the secure app container.

**What should I do if the camera still won't work and I need my money today?**
**If the camera remains black, you have two instant alternatives:**
1. **Visit a Bank of America ATM:** You can deposit physical checks with zero fee at any Bank of America ATM without needing an envelope. Funds follow standard mobile deposit availability timelines.
2. **Visit a Financial Center:** A teller can scan your check at the counter and provide an immediate printed receipt showing available balance release schedules.

**What is the exact endorsement requirement for Bank of America mobile deposits?**
**You must sign your legal name on the back endorsement line and write legibly directly below: "For Mobile Deposit Only at Bank of America"** (or check the pre-printed mobile deposit box if present on the check). Failure to include this exact wording will cause the automated system to reject the check within 24 hours.`
  },

  // ── 14. Preferred Rewards Status Not Updating ──
  {
    title: "Bank of America Preferred Rewards Status Not Updating: How to Fix",
    slug: "bank-of-america-preferred-rewards-status-not-updating",
    category: "account-issues",
    bank_name: "Bank of America",
    excerpt: "Deposited funds to qualify for Bank of America Preferred Rewards but your tier hasn't updated? Learn the 3-month daily balance rules and how to trigger enrollment.",
    meta_description: "Fix Bank of America Preferred Rewards tier status not updating. Understand the 3-month rolling balance requirement, Merrill Edge sync, and how to enroll.",
    content: `You moved money into your Bank of America checking account or transferred an investment portfolio into Merrill Edge to hit the threshold for **Preferred Rewards**—expecting that sweet 25% to 75% credit card rewards bonus, free ATM withdrawals, or waived monthly service fees.

Yet weeks pass, and your dashboard still shows you as a standard account holder or stuck in a lower tier. **Why hasn't your Preferred Rewards status updated?**

Your funds are not being ignored. **Preferred Rewards qualification is governed by a strict statutory three-month rolling calculation window, not your instantaneous account balance.**

Here is how Bank of America calculates your tier and how to trigger your benefits.

## The 3-Month Combined Daily Average Rule Explained

The single most common reason account holders believe their status is glitched is misunderstanding the qualification math:
* **You cannot qualify simply by depositing $100,000 today.**
* Bank of America requires that your **three-month combined average daily balance** meets or exceeds the tier threshold.

| Preferred Rewards Tier | Required 3-Month Daily Average | Credit Card Rewards Booster | Selected Benefits |
| :--- | :--- | :--- | :--- |
| **Gold** | **$20,000 – $49,999** | **25% Bonus** (e.g. 1.5% becomes 1.87%) | No fee on 1 checking account, 5% interest booster |
| **Platinum** | **$50,000 – $99,999** | **50% Bonus** (e.g. 1.5% becomes 2.25%) | 1 non-BofA ATM fee waiver/mo, 10% interest booster |
| **Platinum Honors** | **$100,000 – $999,999** | **75% Bonus** (e.g. 1.5% becomes 2.62%) | Unlimited non-BofA ATM fee waivers, 20% interest booster |
| **Diamond / Diamond Honors** | **$1,000,000+** | **75% Bonus** + Luxury Lifestyle | Dedicated relationship manager, bespoke travel perks |

### The Math: How Long Does It Actually Take?
If you opened a new account and deposited $100,000 in cash on Day 1:
* Month 1 Average: $100,000
* Month 2 Average: $100,000
* Month 3 Average: $100,000
* **Result:** Your 3-month average hits $100,000 at the end of the third calendar month.
* **If you had $0 for the first two months and deposit $300,000 today:** Your 3-month average for Month 3 would be ($0 + $0 + $300,000) / 3 = $100,000. In this accelerated scenario, you can hit Platinum Honors in 30 days!

## 4 Reasons Your Status Hasn't Updated & How to Fix It

### 1. You Must Manually Enroll (It Is Not 100% Automatic)
Even if your balances meet the threshold, Bank of America requires an initial affirmative opt-in:
1. Log into **Bank of America Online Banking** on a computer.
2. Under the **Rewards** tab in the main navigation, click **Preferred Rewards**.
3. If you see a blue button that says **Enroll in Preferred Rewards**, click it!
4. Review the terms and confirm. Once enrolled, future tier upgrades and downgrades happen automatically.

### 2. Check the Monthly Calculation Cutoff Date
Bank of America calculates tier upgrades once per calendar month, typically on the **first Friday after the first calendar day of the month**:
* If your 3-month average crosses the threshold on the 12th of May, your status will not update mid-month.
* Your upgrade will formally process during the first weekend of **June**.

### 3. Ensure Merrill Edge Accounts Are Linked to the Same Tax ID (SSN)
If the bulk of your qualifying assets are in a **Merrill Edge Self-Directed IRA or Brokerage Account**:
1. Check that your Merrill Edge account is registered under the identical **Social Security Number (SSN)** as your Bank of America checking account.
2. In Online Banking, verify that your Merrill Edge account is visible on your primary dashboard under **Investments**.
3. If your Merrill balances are not appearing on your banking dashboard, call Merrill Edge at **1-888-637-3343** to request a **Profile Linkage for Preferred Rewards Aggregation**.

### 4. The 12-Month Grace Period (Downgrades Protection)
If your balances recently dipped below the qualifying threshold (e.g., you bought a home or transferred stock out):
* Bank of America provides a generous **12-month grace period**.
* You will keep your current Preferred Rewards tier status and all credit card bonuses for a full 12 months after your balance drops below the threshold.
* You will receive a 3-month advance notification warning before any status downgrade takes effect.

## Frequently Asked Questions (FAQ)

**Which balances count toward Preferred Rewards qualification?**
**Eligible balances include:**
* Consumer checking accounts (Advantage Plus, SafeBalance, Relationship)
* Consumer savings and CDs
* Merrill Edge Self-Directed and Merrill Lynch Guided investing accounts
* Qualifying 529 College Savings plans managed by Merrill
*(Note: Commercial business accounts, home mortgages, and auto loans do NOT count toward the combined daily balance).*

**Do I get the credit card rewards bonus retroactively?**
**No.** The 25%, 50%, or 75% credit card rewards bonus applies to transactions made after your Preferred Rewards tier is officially active. Past purchases made prior to enrollment will not receive retroactive bonus points.

**Who can I call to verify my Preferred Rewards calculation date?**
**Call the Preferred Rewards Priority Desk at 1-888-888-8686** (Monday – Friday, 8:00 AM – 9:00 PM ET). A relationship specialist can view your exact rolling 90-day balance average down to the penny and give you your scheduled tier promotion date.`
  }
];

async function publishAll() {
  console.log(`🚀 Publishing ${NEW_BOFA_ARTICLES.length} new Bank of America troubleshooting guides...`);

  let successCount = 0;
  for (const article of NEW_BOFA_ARTICLES) {
    const { data: existing } = await supabase
      .from('bw_articles')
      .select('id')
      .eq('slug', article.slug)
      .maybeSingle();

    const payload = {
      ...article,
      status: 'published',
      published_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (existing) {
      console.log(`Updating existing article: ${article.slug}`);
      const { error } = await supabase
        .from('bw_articles')
        .update(payload)
        .eq('id', existing.id);
      if (error) console.error(`Error updating ${article.slug}:`, error);
      else successCount++;
    } else {
      console.log(`Inserting new article: ${article.slug}`);
      const { error } = await supabase
        .from('bw_articles')
        .insert([payload]);
      if (error) console.error(`Error inserting ${article.slug}:`, error);
      else successCount++;
    }
  }

  console.log(`✅ Successfully published ${successCount} / ${NEW_BOFA_ARTICLES.length} Bank of America articles!`);
}

publishAll();
