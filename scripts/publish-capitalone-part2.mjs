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

export const CAPONE_ARTICLES_PART2 = [
  // ── 11. Available Balance Different from Current Balance ──
  {
    title: "Capital One Available Balance Different from Current Balance: Full Explanation",
    slug: "capital-one-available-balance-different-from-current-balance",
    category: "account-issues",
    bank_name: "Capital One",
    excerpt: "Why is your Capital One available balance hundreds of dollars lower than your current or present balance? Learn about pre-authorization holds, pending debit charges, and check holds.",
    meta_description: "Fix Capital One available balance different from current balance. Learn the exact difference between ledger and spendable balance, pending pre-authorizations, and hold release rules.",
    content: `When reviewing your Capital One 360 Checking, Savings, or Credit Card account, you may notice two distinct numbers: your **Current Balance** and your **Available Balance**.

Seeing that your Available Balance is significantly lower than your Current Balance often creates confusion: *Where did the missing money go, and can it still be spent?*

---

## Current Balance vs. Available Balance

| Balance Type | What It Means | Includes Pending Charges? | Spendable Right Now? |
| :--- | :--- | :--- | :--- |
| **Current (Ledger) Balance** | The total amount of money settled in your account at the close of the previous business day | ❌ No | ❌ No (May include money already committed) |
| **Available Balance** | The exact amount of funds you can withdraw, transfer, or spend with your debit card right now | ✅ Yes | ✅ **YES — This is your real spendable balance** |

---

## 3 Reasons for the Discrepancy

### 1. Merchant Pre-Authorization Holds
When you swipe your Capital One debit card at gas pumps, hotels, rental car agencies, or restaurants:
- **Gas Stations:** The pump terminal places a temporary hold between **$50 and $175** on your available balance to ensure funds exist, even if you only pumped $20 of gas.
- **Hotels / Car Rentals:** A deposit hold of $100 to $300 is held until checkout.
- Once the final merchant charge settles (usually 24 to 72 hours), the authorization hold drops off, and your available balance reconciles.

### 2. Check Deposit Availability Holds
Under Federal Reserve Regulation CC, if you deposit a check for $1,000, your *Current Balance* immediately increases by $1,000. However, Capital One may only release $225 to your *Available Balance* immediately, holding the remaining $775 for 2 business days until the payer's bank settles.

### 3. Pending Outbound ACH Transfers or Bill Pay
If you scheduled a credit card payment or utility bill pay, Capital One reserves the funds in your available balance in advance of the settlement date so you cannot accidentally double-spend the money.

---

## How to Calculate Your Real Money
Formula:
$$\\text{Available Balance} = \\text{Current Balance} - \\text{Pending Debits} - \\text{Deposit Holds}$$

If an authorization hold has lingered for more than **7 business days** (common with rental car companies that forget to release secondary pre-authorizations), call Capital One at **1-888-464-0727** to have an agent manually expire the stale merchant hold.`
  },

  // ── 12. Debit Card Declined Even Though Balance is Sufficient ──
  {
    title: "Capital One Debit Card Declined with Sufficient Balance: 5 Causes & Fixes",
    slug: "capital-one-debit-card-declined-balance-sufficient",
    category: "card-atm-problems",
    bank_name: "Capital One",
    excerpt: "Was your Capital One 360 debit card declined at the register even though you have plenty of money in checking? Learn about daily spending caps, card locks, and fraud triggers.",
    meta_description: "Fix Capital One debit card declined even though balance is sufficient. Step-by-step troubleshooting for daily limit ceilings, merchant category blocks, and fraud holds.",
    content: `Standing at a store checkout or trying to pay for dinner, only to have your **Capital One 360 Mastercard debit card declined despite having thousands of dollars available in checking**, is embarrassing and stressful.

If your available balance is well above the transaction total, your card was declined due to a **security rule, technical restriction, or limit ceiling** rather than insufficient funds.

---

## Diagnostic Matrix: Why Cards Decline with Money

| Declining Factor | Technical Trigger | Solution |
| :--- | :--- | :--- |
| **Card Locked in Mobile App** | Security lock feature accidentally toggled ON | Unlock instantly inside Capital One app |
| **Daily Point-of-Sale (POS) Limit Reached** | Default $3,000/day cumulative purchase limit exceeded | Call 360 support to request temporary limit increase |
| **Unusual Location / Fraud Trigger** | First purchase in a new state or country without travel notice | Reply "YES" to fraud text from shortcode 227466 |
| **Damaged EMV Chip** | Physical microscopic crack in card chip contacts | Tap card via Apple Pay or use chip bypass |
| **Restricted Merchant Category (MCC)** | Attempting to purchase cryptocurrency, gambling, or offshore securities | Use alternate payment method (prohibited by bank policy) |

---

## Step-by-Step Resolution Protocol

### Step 1: Check the Card Lock Toggle in the App
Capital One features an instant **"Lock Card"** switch in the mobile app:
1. Open the Capital One Mobile App.
2. Scroll to your 360 Checking account > tap your **Debit Card icon**.
3. Inspect the switch: If it says **"Locked"**, tap it once to switch to **"Unlocked"**. The card becomes active globally within 5 seconds.

### Step 2: Check for Automated Anti-Fraud SMS
Check your SMS messages:
- Capital One will send a text from **227466**: *"Did you attempt a charge of $[Amount] at [Merchant]?"*
- Reply **YES**. Wait 30 seconds for the confirmation text, then ask the cashier to run the transaction a second time.

### Step 3: Check Daily Spending Limit Caps
Capital One 360 Checking accounts carry hard default daily ceilings:
- **Daily POS Purchases (Debit Swipes):** Default **$3,000 per calendar day**.
- **Daily ATM Cash Withdrawals:** Default **$1,000 per calendar day**.
- If you purchased a $2,500 appliance earlier today and are now trying to spend $600 at a grocery store, the second purchase will decline regardless of your balance.
- Call **1-888-464-0727** to request a 24-hour **Temporary Daily Limit Elevation**.`
  },

  // ── 13. ATM Charged Account but Didn't Give Cash ──
  {
    title: "Capital One ATM Charged Account but Didn't Dispense Cash: Dispute Protocol",
    slug: "capital-one-atm-charged-account-didnt-dispense-cash",
    category: "card-atm-problems",
    bank_name: "Capital One",
    excerpt: "Did a Capital One ATM, Allpoint ATM, or MoneyPass terminal debit your checking account but fail to dispense your cash? Complete dispute filing guide and Regulation E refund rules.",
    meta_description: "Fix Capital One ATM charged account but didn't dispense cash. Learn how to document machine jams, file an electronic funds dispute, and claim provisional credit.",
    content: `You insert your Capital One debit card at an ATM, request $200 in cash, hear the mechanical rollers whirring inside the machine, but **no cash comes out of the dispenser door**. A few moments later, your mobile phone buzzes with a notification: *$200 withdrawn from 360 Checking*.

Having your checking balance depleted while standing empty-handed at an ATM terminal is a financial emergency. Follow this protocol immediately to secure your refund.

---

## Why Do ATMs Fail to Dispense Cash?

1. **Mechanical Bill Jam:** A worn or folded banknote catches on the dispensing rollers, blocking the transport path while the internal optical sensor registers that the transaction completed.
2. **Dispenser Shutter Timeout:** If you hesitate for more than 20–30 seconds after the shutter opens, the ATM retracts the bills into a secure internal diversion bin for theft prevention.
3. **Network Gateway Desynchronization:** An electrical or cellular network glitch interrupts the final settlement handshake between the terminal host and Capital One's core banking network.

---

## Immediate Actions at the ATM Terminal

### 1. Document Critical Terminal Information
Before leaving the physical machine:
- **Terminal ID:** Look for a label on the front or top of the ATM containing the Terminal ID (e.g., \`ATM #CA-10492\` or \`Terminal: 884920\`).
- **Location:** Note the exact business name and street address (e.g., Target Store #1204, CVS Pharmacy on Main St).
- **Network Name:** Note whether the machine is an official **Capital One ATM**, an **Allpoint Network ATM**, or a third-party non-affiliated ATM.
- **ATM Receipt:** Take the receipt if printed. If it printed an error slip reading *"Transaction Void"* or *"Hardware Malfunction"*, preserve it carefully.
- Take a photo of the ATM screen if an error code is displayed.

---

## Step-by-Step Dispute & Refund Procedure

### Step 1: Wait 30 Minutes for Automated Reversal
Most modern ATM networks run an automated reconciliation script every 15 to 30 minutes. If the terminal host registers an undispensed bill cassette count, it transmits an automated **Reversal Credit (ACH Credit)** to Capital One. Refresh your app activity after 30 minutes to check if the debit was cancelled.

### Step 2: File an Official Regulation E ATM Dispute
If the charge remains posted:
1. Call Capital One 360 Disputes immediately at **1-888-464-0727**.
2. State clearly: *"I experienced an ATM mechanical dispenser failure. The ATM debited my account $[Amount] but dispensed zero cash. I need to file an Electronic Funds Transfer dispute under Regulation E."*
3. Provide the Terminal ID, location address, and exact time of the transaction.

### Step 3: Provisional Credit Timeline
Under Federal Law (**Regulation E - 12 CFR § 1005.11**):
- Capital One must investigate and resolve your ATM claim within **10 business days**.
- If the investigation requires up to 45 or 90 days (due to auditing physical cash cassettes at a third-party Allpoint or MoneyPass terminal), Capital One **must issue Provisional Credit** to your checking account within **10 business days** of receiving your notice.`
  },

  // ── 14. Cash Deposit Not Showing in 360 Checking ──
  {
    title: "Capital One Cash Deposit Not Showing in 360 Checking: Retail & ATM Delays",
    slug: "capital-one-cash-deposit-not-showing-in-360-checking",
    category: "card-atm-problems",
    bank_name: "Capital One",
    excerpt: "Did you deposit cash at a CVS, Walgreens, or Capital One ATM and the money is not showing in your 360 Checking balance? Learn retail deposit clearing times and how to trace your funds.",
    meta_description: "Fix Capital One cash deposit not showing in 360 checking. Step-by-step resolution for CVS/Walgreens retail barcode deposit delays and Capital One ATM deposit errors.",
    content: `Capital One allows 360 Checking customers to deposit cash using two primary channels:
1. **Capital One ATMs / Capital One Cafés**
2. **Cash at the Register** (via barcode at participating CVS®, Walgreens®, and Duane Reade® locations)

While cash deposits are typically available immediately, delays and system timeouts can cause deposited cash to fail to show up in your available balance.

---

## Standard Cash Deposit Availability Rules

| Deposit Location | Method | Typical Posting Time | Maximum Availability Delay |
| :--- | :--- | :--- | :--- |
| **Capital One ATM / Café** | Insert cash into bill acceptor | **Instant** (Within 60 seconds) | End of business day |
| **CVS / Walgreens Register** | Cashier scans mobile barcode | **10 to 30 minutes** | Up to 2 hours |
| **Third-Party Allpoint+ ATM** | Insert cash at selected Allpoint+ | **2 to 4 hours** | Next business day |

---

## 3 Reasons for Retail Cash Deposit Delays

### 1. Register Batch Transmission Delay
When you hand cash to a cashier at CVS or Walgreens, the store's point-of-sale terminal communicates with the **Green Dot / Vanilla network gateway**, which in turn communicates with Capital One. If the retail store's network is experiencing high latency, the transaction file queues in a delayed batch.

### 2. Barcode Expiration
The cash deposit barcode generated in the Capital One app is single-use and **expires after 30 minutes**. If a cashier takes more than 30 minutes from the time you generated the barcode to scan it and complete the transaction, the API handshake will fail.

### 3. Exceeded Cash Deposit Limits
Capital One enforces strict retail cash limits:
- **Maximum Per Deposit:** $999 per transaction.
- **Daily Limit:** $999 per calendar day.
- **Monthly Limit:** $5,000 per rolling 30-day window.
- If you attempt to deposit amounts exceeding these thresholds, the retail terminal may accept the cash but flag the transaction for compliance review.

---

## What to Do If Your Cash Deposit Is Missing

### Step 1: Retain the Register Paper Receipt
When depositing cash at CVS or Walgreens, the cashier **must hand you a physical register receipt**. This receipt contains the **Green Dot / Merchant Sequence Reference Number** and the exact timestamp. **Do NOT discard this receipt.** Without it, tracking cash given to a retail cashier is extremely difficult.

### Step 2: Check Your App Activity Stream
Force-close your Capital One app and reopen it. Often, push notifications fail to arrive even though the cash has already credited to your spendable balance.

### Step 3: Contact 360 Support with the Store Receipt
If more than 2 hours have passed since your cash was accepted:
- Call Capital One at **1-888-464-0727**.
- Provide the register receipt details: store number, transaction date, time, and the sequence number.
- The representative can run a trace on the retail deposit network to manually credit your account.`
  },

  // ── 15. Credit Card Payment Made but Available Credit Not Updated ──
  {
    title: "Capital One Credit Card Payment Made but Available Credit Not Updated [Fix]",
    slug: "capital-one-credit-card-payment-made-available-credit-not-updated",
    category: "payments-transactions",
    bank_name: "Capital One",
    excerpt: "Did you pay your Capital One credit card bill from your bank, but your available credit line still shows $0 or hasn't updated? Learn why payment hold buffers exist and how to release them.",
    meta_description: "Fix Capital One payment made but available credit not updated. Learn about payment clearing holds, ACH transit buffers, and how to instantly restore your credit line.",
    keywords: JSON.stringify([
      'capital one credit card payment made but available credit not updated',
      'capital one payment posted but available credit zero',
      'how long does capital one take to update available credit',
      'capital one hold on available credit after payment',
      'capital one credit line not refreshing after payment'
    ]),
    content: `You make a payment toward your Capital One credit card (Venture, Quicksilver, Platinum, or Savor) to free up spending power. The app confirms the payment has posted, your balance displays as reduced, but your **Available Credit remains unchanged or reads $0**.

This common frustration is caused by Capital One's internal **Payment Availability Hold Buffer**.

---

## Why Does Capital One Hold Available Credit After Payment?

Even though your payment reflects as "Posted," the money may not have actually settled from your funding bank yet:

\`\`\`
[Payment Submitted in App] ──> [Current Balance Reduced Immediately]
                                              │
                              (ACH Clearing Window: 2–6 Business Days)
                                              │
[Funds Settle from External Bank] ──> 🔓 Available Credit Line Restored
\`\`\`

### Key Triggers for Payment Availability Holds:
1. **Payment from an External Bank Account:** If you pay using a checking account from an outside institution (e.g., Chase, Wells Fargo, local credit union), Capital One does not receive the settled funds for 2 to 3 business days. Until the funds clear, Capital One will not extend additional credit to protect against bounced payments.
2. **Large Payment Approaching the Total Credit Limit:** If you have a $2,000 credit limit and submit a single payment of $1,900, automated risk algorithms hold the credit line for **up to 6 business days**.
3. **Recent History of Returned Payments:** If an ACH payment bounced in the past 12 months, all future payments are subject to a mandatory 5-to-8 business day credit line hold.
4. **New Account Status (First 6 Months):** Newly opened credit cards are subject to conservative risk rules until a reliable payment track record is established.

---

## How to Get Instant Available Credit
To ensure your available credit updates immediately every time you pay:
- **Pay from a Capital One 360 Checking Account:** Payments made internally between Capital One 360 Checking and your Capital One credit card update your available credit line **instantly, 24/7/365**, with zero hold time.
- **Pay via Debit Card (When Eligible):** In certain circumstances, paying via a debit card over the phone or online clears immediately.

---

## How to Expedite an Active Credit Hold
If you need urgent access to your credit line for travel or emergency purchases:
1. Ensure the payment has **completely cleared and debited your external bank account**.
2. Call Capital One Credit Card Services at **1-800-227-4825** (1-800-CAPITAL).
3. Request a **"Three-Way Verification Call"** with your external bank.
4. The Capital One agent will call your funding bank with you on the line to verify that the funds have cleared and cannot be recalled, releasing your available credit line on the spot.`
  },

  // ── 16. App Balance Won't Load / Blank Dashboard ──
  {
    title: "Capital One App Balance Won't Load: White Screen & Spinning Wheel Fix",
    slug: "capital-one-app-balance-wont-load-blank-dashboard",
    category: "mobile-app-problems",
    bank_name: "Capital One",
    excerpt: "Does the Capital One app recognize your face or fingerprint, but the balance card sits on an infinite loading spinner or blank white box? 4 proven technical fixes.",
    meta_description: "Fix Capital One app balance won't load or spinning wheel error. Step-by-step solutions for mobile dashboard freezes, cached auth token corruption, and iOS/Android fixes.",
    keywords: JSON.stringify([
      'capital one app balance wont load',
      'capital one app spinning wheel on balance',
      'capital one mobile app blank dashboard',
      'capital one app recognizes account but balance wont load',
      'capital one app loading freeze'
    ]),
    content: `A specific mobile bug occurs when the Capital One app logs you in cleanly via Face ID or fingerprint, but upon arriving at the dashboard, your checking, savings, or credit card accounts display an **infinite spinning wheel or a blank gray box where the balance should appear**.

This error occurs when the app's biometric authentication thread succeeds, but the second-stage asynchronous REST API call that fetches account balances fails or hangs.

---

## 4 Verified Fixes

### 1. Perform a "Pull-to-Refresh" Gesture
Before troubleshooting hardware:
- Place your finger near the top of the app dashboard screen and drag firmly downward until the circular refresh arrow spins.
- This forces the mobile client to drop the hung API connection and initiate a fresh TLS handshake to Capital One's balance service.

### 2. Force Terminate the App & Toggle Airplane Mode
Stale cellular network sockets frequently cause background data threads to hang:
1. Swipe up from the bottom of your phone to enter the app switcher and **swipe Capital One away completely**.
2. Enable **Airplane Mode** for 10 seconds.
3. Turn Airplane Mode **OFF** and confirm your device establishes a fresh 5G / Wi-Fi connection.
4. Relaunch Capital One.

### 3. Clear App Cache on Android / Reinstall on iOS
Corrupted local app cache is the #1 cause of dashboard widget failures:
- **Android:** Settings > Apps > Capital One > Storage > **Clear Cache**.
- **iPhone:** Delete the app completely, restart your iPhone, and download a fresh copy from the App Store.

### 4. Check for Real-Time Core Banking Outages
If millions of users are experiencing balance widget failures, Capital One's core customer data services are experiencing high server load. Visit Downdetector or sign into **capitalone.com** on a web browser to confirm account balances while app services recover.`
  },

  // ── 17. Verification Code Expired Before Login ──
  {
    title: "Capital One Verification Code Expired Before Login: 5 Fixes for SMS Delays",
    slug: "capital-one-verification-code-expired-before-login",
    category: "security-verification-issues",
    bank_name: "Capital One",
    excerpt: "Are Capital One 2-step verification codes arriving after they have already expired? Learn why carrier SMS gateways delay shortcodes and how to authenticate without lag.",
    meta_description: "Fix Capital One verification code expired before login. Step-by-step solutions for delayed 2FA SMS texts, carrier shortcode filtering, and mobile app push approvals.",
    keywords: JSON.stringify([
      'capital one verification code expired before login',
      'capital one security code arriving late',
      'capital one 2fa code expired',
      'why are capital one verification codes delayed',
      'capital one otp text delay'
    ]),
    content: `Capital One enforces strict **Two-Step Verification (2FA)** to secure customer accounts. When signing in from an unrecognized browser or device, Capital One sends a 6-digit one-time passcode (OTP) via text message or email.

A major problem occurs when the verification code **takes 10 to 15 minutes to arrive on your phone—long after the 5-minute security window has expired**. Entering the code results in an error: *"This code has expired. Please request a new one."*

---

## Why Do Capital One Verification Codes Arrive Late?

1. **Cellular Carrier Shortcode Filtering:** Major carriers (Verizon, AT&T, T-Mobile) prioritize standard person-to-person SMS. Automated high-volume banking shortcodes (like Capital One's **227466**) are routed through aggregators that can bottleneck during peak business hours.
2. **VoIP / Virtual Phone Numbers:** If you use Google Voice, Skype, TextNow, or a prepaid MVNO carrier, automated anti-fraud systems intentionally throttle or delay automated SMS delivery.
3. **Spam Shield / Robocall Blocker Apps:** Apps like RoboKiller, Hiya, or built-in iOS/Android spam filters can hold shortcode messages in temporary quarantine before releasing them to your inbox.

---

## How to Bypass the Delay and Authenticate

### Step 1: Switch to "In-App Push Notification" Verification
If you have the Capital One Mobile App installed on your smartphone:
1. When prompted for 2-step verification on your computer browser, click **"Try another way"** or **"More options"**.
2. Select **"App Notification / Tap Yes on Your Phone"**.
3. Capital One sends a secure push notification directly to your phone via Apple APNs / Google FCM, completely bypassing the cellular SMS network. Tap the notification and press **"Yes, it's me"**.

### Step 2: Request Verification via Voice Call
If push notifications are unavailable:
1. On the verification screen, click **"Call my phone"**.
2. Automated telephone calls use circuit-switched voice channels that connect within **5 to 10 seconds**, avoiding the SMS gateway queue entirely.
3. An automated voice will read the 6-digit code clearly twice.

### Step 3: Text "HELP" to 227466
To unblock any carrier-side routing blocks on your mobile number:
- Open your messaging app and text **HELP** to **227466**.
- If your carrier responds with: *"Capital One alerts: Reply STOP to cancel"*, your shortcode routing is healthy.
- If you receive no response or an error (*"Service access denied"*), your carrier has blocked automated shortcode delivery. Call your mobile carrier and ask to enable **"A2P Shortcode Messaging"** on your line.`
  },

  // ── 18. Password Reset Link Not Working ──
  {
    title: "Capital One Password Reset Link Not Working: Loop & Token Errors Fixed",
    slug: "capital-one-password-reset-link-not-working",
    category: "login-access-problems",
    bank_name: "Capital One",
    excerpt: "Is the Capital One password reset email link looping back to the login page, giving an 'Expired Token' error, or not loading? How to cleanly reset your credentials.",
    meta_description: "Fix Capital One password reset link not working. Resolve email token expiration errors, mobile browser loops, and regain access to your Capital One account.",
    keywords: JSON.stringify([
      'capital one password reset link not working',
      'capital one password reset loop',
      'capital one reset link expired',
      'capital one forgot password link broken',
      'how to reset capital one password when link fails'
    ]),
    content: `When you forget your Capital One password, clicking **"Forgot Username or Password?"** triggers a secure password reset link to your registered email address.

However, many users find that clicking the button in the email results in an **infinite loop back to the blank sign-in screen**, an error stating *"This link is no longer valid,"* or an unresponsive white page.

---

## Why Password Reset Links Break

1. **Email Scanner Pre-Fetching (Outlook & Corporate Inboxes):** Corporate or high-security personal email providers (such as Outlook/Office 365 with Safelinks or ProtonMail) automatically pre-click links to scan for malware. Because Capital One password reset links are **single-use tokens**, the email scanner's pre-click consumes the token, making it appear expired the moment you open it.
2. **In-App Email Browser (Gmail / Yahoo App):** When you tap the link inside the Gmail or Yahoo mobile app, it opens in a restricted internal WebView rather than your primary browser (Safari or Chrome), breaking session cookie continuity.
3. **Strict 15-Minute Expiration Window:** Capital One security links expire exactly 15 minutes after generation.

---

## Step-by-Step Fix Protocol

### Step 1: Long-Press and Copy the Link Directly
Do not simply tap the blue button inside your email:
1. Open the Capital One password reset email.
2. **Press and hold** the *"Reset My Password"* button until a context menu appears.
3. Tap **"Copy Link Address"**.
4. Open a clean **Private / Incognito window** in Safari or Chrome.
5. Paste the link into the URL address bar and press Enter.

### Step 2: Reset Credentials Directly Inside the Mobile App
Bypassing the web link entirely is the most reliable method:
1. Open the official **Capital One Mobile App**.
2. Tap **"Forgot Username or Password?"** directly on the app sign-in screen.
3. Enter your Social Security Number and date of birth.
4. Complete the 2-step SMS verification challenge inside the app.
5. You will be prompted to type a new password directly on the device without ever needing to click an email link.

### Step 3: Contact Online Banking Tech Support
If your profile is locked from repeated reset attempts:
- Call Capital One Technical Support at **1-866-750-0873**.
- A specialist can verify your identity and generate a **One-Time Temporary Access Code (TAC)** over the phone.`
  },

  // ── 19. Account Locked After Too Many Login Attempts ──
  {
    title: "Capital One Account Locked After Too Many Login Attempts: Unlock Guide",
    slug: "capital-one-account-locked-too-many-login-attempts",
    category: "login-access-problems",
    bank_name: "Capital One",
    excerpt: "Locked out of Capital One after entering the wrong password? Learn how long security lockouts last and how to instantly unlock your account online or by phone.",
    meta_description: "Fix Capital One account locked after too many login attempts. Step-by-step unlock instructions, security lockout durations, and phone verification procedures.",
    keywords: JSON.stringify([
      'capital one account locked after too many login attempts',
      'how long does capital one account lock last',
      'unlock capital one account online',
      'capital one locked out of app',
      'capital one temporary security lockout'
    ]),
    content: `Entering an incorrect password **3 consecutive times** on Capital One's mobile app or website triggers an immediate automated security lockout:

> *"Your account has been locked for your security. To regain access, please reset your password or call customer support."*

This protective security measure prevents brute-force password guessing attacks on your financial profiles.

---

## How Long Does a Capital One Account Lockout Last?

| Lockout Type | Cause | Duration | Unlocked By |
| :--- | :--- | :--- | :--- |
| **Soft Lock (Temporary)** | 3 incorrect passwords entered | **24 Hours** | Auto-resets after 24h OR unlocked instantly via identity verification |
| **Hard Lock (Administrative)** | Suspected fraud, VPN abuse, or password reset failures | **Indefinite** | Requires manual agent verification via phone |

---

## Step-by-Step Self-Service Unlock Protocol

In most cases, you do not need to wait 24 hours. You can unlock your account in 3 minutes online:

### Step 1: Initiate Self-Service Identity Verification
1. Navigate to **capitalone.com/sign-in** on a desktop or mobile browser.
2. Click the link that says **"Forgot Username or Password?"** (do not keep trying your old password).
3. Enter your **Legal Last Name**, your **Social Security Number (SSN)**, and your **Date of Birth**.
4. Click **Find Account**.

### Step 2: Complete the Two-Step Verification
Capital One will prompt you to receive a one-time security code via text message or telephone call to your verified mobile number.
- Enter the 6-digit code.
- You will be presented with your verified Username.
- Enter and confirm a **new password** that meets Capital One's complexity requirements (8–32 characters, uppercase, lowercase, number, and special character).

### Step 3: Hard Lock Phone Escalation
If the self-service tool states *"We cannot verify your identity online. Please call customer support"*:
- Call Capital One Account Security at **1-877-383-4802** or **1-866-750-0873**.
- State: *"My account was locked due to incorrect password attempts. I need an agent to assist with an administrative account unlock."*
- Have your 16-digit debit/credit card number and government ID ready for identity verification.`
  },

  // ── 20. Mobile Deposit Rejected After Photo Submission ──
  {
    title: "Capital One Mobile Deposit Rejected After Photo Submission: Fixes & Re-Scanning",
    slug: "capital-one-mobile-deposit-rejected-photo-submission",
    category: "mobile-app-problems",
    bank_name: "Capital One",
    excerpt: "Did your Capital One mobile check deposit get rejected immediately after taking photos? Learn the exact photo requirements, endorsement rules, and how to successfully re-submit.",
    meta_description: "Fix Capital One mobile deposit rejected after photo submission. Solve blurry image errors, MICR line read failures, endorsement errors, and successfully deposit checks.",
    keywords: JSON.stringify([
      'capital one mobile deposit rejected after photo submission',
      'capital one check deposit rejected image quality',
      'why did capital one reject my mobile deposit',
      'capital one mobile deposit endorsement error',
      'capital one check deposit photo error'
    ]),
    content: `Taking photos of a check only to have the Capital One mobile app instantly reject the deposit with an error message like **"Unable to read check details"**, **"Image quality poor"**, or **"Invalid endorsement"** is an annoying obstacle when trying to access your money.

Capital One's automated check ingestion software uses strict Optical Character Recognition (OCR) algorithms to validate check dimensions, magnetic ink routing tracks (MICR), and legal endorsements.

---

## 5 Leading Reasons Mobile Deposits Get Rejected

1. **Missing Restrictive Endorsement:** Capital One strictly enforces federal mobile deposit endorsement guidelines. The back of the check MUST have your signature AND the handwritten phrase: **"For Capital One Mobile Deposit Only"**. If this phrase is missing or if the checkbox for mobile deposit is unticked, automated systems reject the check.
2. **MICR Line Cutoff or Glare:** The row of numbers along the bottom edge of the front of the check (routing number, account number, check number) must be 100% visible against high contrast. A shadow or camera flash glare obscuring even one digit causes immediate rejection.
3. **Background Surface Confusion:** Photographing a check on a patterned countertop (e.g., granite or wood grain) prevents the app's edge-detection algorithm from cropping the check borders.
4. **Third-Party / Payee Name Mismatch:** The name written on the *"Pay to the Order of"* line must match the legal name on your Capital One 360 checking account. Checks made out to cash, business names, or two individuals joined by "and" cannot be deposited via the mobile app.
5. **Folded or Wrinkled Paper:** Severe creases running through the dollar amount box or signature line break the OCR validation scan.

---

## Step-by-Step Re-Scanning Best Practices

### Step 1: Perfect the Restrictive Endorsement
Turn the check over to the endorsement area:
- Sign your name on the top line.
- Directly beneath your signature, write legibly in dark blue or black ink:
  > **For Capital One Mobile Deposit Only**
- Check the box labeled *"Check here if mobile deposit"* if present on the check stock.

### Step 2: Optimize Lighting and Surface Contrast
- Place the check flat on a **solid, dark, matte surface** (a dark wooden desk, dark mousepad, or black placemat).
- Avoid using your camera's flash, which creates hot-spot glares. Instead, use indirect ambient daylight or a nearby desk lamp.
- Smooth out any folds or creases across the bottom MICR numbers.

### Step 3: Align Within the On-Screen Frame
1. Open the Capital One App > select **Deposit Check**.
2. Hold your phone completely parallel to the check (not at an angle).
3. Position all 4 corners of the check cleanly inside the green on-screen guidelines.
4. Let the app's auto-capture feature snap the photo rather than tapping the manual button whenever possible.

---

## What to Do If the Mobile App Repeatedly Rejects the Check
If your check is physically crumpled, faint, or rejected after 3 attempts:
- **Deposit at a Capital One ATM:** Capital One ATM terminals have motorized mechanical bill and check scanners that use magnetic read heads, easily processing checks that smartphone cameras struggle to read.
- **Deposit at a Capital One Café:** Visit a local Capital One Café where an ambassador can assist with high-speed document intake.`
  }
];

async function publishPart2() {
  console.log(`🚀 Publishing Part 2 (10 articles) for Capital One...`);

  for (const article of CAPONE_ARTICLES_PART2) {
    const { data: existing } = await supabase
      .from('bw_articles')
      .select('id')
      .eq('slug', article.slug)
      .maybeSingle();

    if (existing) {
      console.log(`Updating existing article: ${article.slug}`);
      const { error } = await supabase
        .from('bw_articles')
        .update({
          title: article.title,
          category: article.category,
          bank_name: article.bank_name,
          excerpt: article.excerpt,
          meta_description: article.meta_description,
          content: article.content,
          status: 'published',
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id);

      if (error) console.error(`Error updating ${article.slug}:`, error);
    } else {
      console.log(`Inserting new article: ${article.slug}`);
      const { error } = await supabase
        .from('bw_articles')
        .insert({
          title: article.title,
          slug: article.slug,
          category: article.category,
          bank_name: article.bank_name,
          excerpt: article.excerpt,
          meta_description: article.meta_description,
          content: article.content,
          status: 'published',
          created_at: new Date().toISOString(),
          published_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) console.error(`Error inserting ${article.slug}:`, error);
    }
  }

  console.log(`✅ Part 2 complete!`);
}

publishPart2();
