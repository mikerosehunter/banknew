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

export const CAPONE_ARTICLES_PART1 = [
  // ── 1. 360 Checking Disappeared After Zelle ──
  {
    title: "Capital One 360 Checking Account Disappeared After Zelle: Causes & Restoration",
    slug: "capital-one-360-checking-account-disappeared-after-zelle",
    category: "account-issues",
    bank_name: "Capital One",
    excerpt: "Did your Capital One 360 Checking account vanish from your mobile app and online dashboard right after sending or receiving a Zelle payment? Here is why it happens and how to restore access.",
    meta_description: "Fix Capital One 360 checking account disappeared after Zelle transaction. Learn about security suppression freezes, fraud team reviews, and unfreezing your account.",
    content: `Discovering that your **Capital One 360 Checking account has completely disappeared** from your mobile app dashboard immediately after sending or receiving a Zelle transfer is an alarming experience. Where your checking account balance usually sits, only your credit card or auto loan remains visible, or the dashboard simply shows no deposit accounts.

Rest assured: **your money has not vanished**. What has occurred is an automated security suppression triggered by Capital One's fraud mitigation engine.

---

## Why Did Capital One Hide Your 360 Checking Account?

When a Zelle transaction trips internal risk heuristics, Capital One's core banking system executes an immediate **protective suppression**:

\`\`\`
[Zelle Transfer Initiated/Received] ──> [Early Warning Services (EWS) Flag] ──> [Risk Rule Triggered]
                                                                                        │
                                                                           [Account Hidden from Digital View]
                                                                                        │
                                                                           🔒 Risk Operations Review (24-72h)
\`\`\`

### Primary Risk Triggers:
1. **High-Velocity Transfer to a New Recipient:** Sending money to a contact you have never transacted with before, particularly for amounts exceeding $500.
2. **Receiving Funds Flagged as Fraudulent:** If another party sends you money via Zelle and their account was compromised, your receiving account is placed under a precautionary freeze while the transaction is investigated.
3. **Mismatched Device Geolocation / VPN:** Sending a Zelle payment while connected to a commercial VPN or from a new device/IP address.
4. **Sudden Outflow of Recently Deposited Funds:** Depositing a check or receiving an ACH transfer and immediately attempting to Zelle out the entire available amount.

---

## Diagnostic Matrix: Account Visibility vs. Reality

| Symptom | Account Status | Funds Status | Immediate Action |
| :--- | :--- | :--- | :--- |
| **Checking tile vanished from app completely** | Security suppression active | Intact; debits and withdrawals paused | Call Fraud Operations at 1-800-424-7732 |
| **Checking visible on desktop, missing on app** | Mobile token cache desync | 100% accessible | Force close app, clear cache, or log in via browser |
| **"Account Restricted" banner on checking tile** | Compliance / KYC documentation hold | Funds held pending ID verification | Upload requested identity documents |
| **Direct deposits still arriving but app shows nothing** | Backend ledger active, frontend suppressed | Direct deposits post normally | Call 360 Customer Service for manual release |

---

## Step-by-Step Restoration Protocol

### Step 1: Check Your Email & Spam Folders
When an account suppression is enacted, Capital One automatically dispatches a secure notice:
- Search your email inbox and spam folder for messages from \`capitalone@notification.capitalone.com\` or \`abuse@capitalone.com\`.
- Look for subject lines referencing *"Important information regarding your account status"* or *"Action required on your Capital One 360 Checking account"*.
- Take note of any specific **Case Reference Number** provided.

### Step 2: Test Desktop Web Browser Login
Mobile app authentication tokens can cache suppression states longer than desktop sessions:
1. Open a desktop computer browser (Chrome, Firefox, Safari).
2. Go to **capitalone.com** and sign in using your standard username and password.
3. If the checking account appears on desktop with an *"Account Under Review"* banner, the issue is an active fraud review.
4. If the account does not appear on desktop either, the profile has been administratively restricted at the master level.

### Step 3: Contact the Capital One Fraud & Risk Operations Desk Directly
Standard general customer service reps often cannot view suppressed account files. You must reach the dedicated fraud unit:
- **Direct Fraud Line:** **1-800-424-7732** (Mon–Fri 8 AM–9 PM ET, Sat 8 AM–5 PM ET)
- **Alternative 360 Checking Desk:** **1-888-464-0727**
- **What to say:** *"I am calling because my 360 Checking account disappeared from my online profile immediately following a Zelle transfer. I need to be transferred to the Deposit Fraud Operations team to verify my identity and resolve the security suppression."*

### Step 4: Complete Identity Verification
Be prepared to verify:
- Your full Social Security Number and date of birth.
- The exact dollar amount, date, and recipient/sender name of the recent Zelle transaction.
- You may be sent a one-time identity verification link to upload photos of your valid driver's license or passport along with a live selfie.

Once cleared by an analyst, digital visibility is typically restored within **2 to 4 hours**.

---

## Frequently Asked Questions

### Will my scheduled bills and direct deposits bounce while my account is disappeared?
In most cases of automated Zelle suppression, automated direct deposits (ACH credits) will still post to your ledger. However, outgoing ACH debits, scheduled bill payments, and debit card transactions are temporarily paused to protect the account from potential unauthorized drainage.

### Can I still withdraw cash at an ATM?
No. During a security suppression, your linked 360 Mastercard debit card is placed on a temporary administrative freeze. Attempting to use the card at an ATM will result in a *"Card Declined / Contact Financial Institution"* response.`
  },

  // ── 2. Checking Disappeared but Credit Card Still Showing ──
  {
    title: "Capital One Checking Account Disappeared but Credit Card Still Showing [Fix]",
    slug: "capital-one-checking-account-disappeared-credit-card-still-showing",
    category: "account-issues",
    bank_name: "Capital One",
    excerpt: "Can you see your Capital One Quicksilver or Venture credit card in the app, but your 360 Checking account is completely missing? Learn why customer profiles desynchronize and how to merge your accounts.",
    meta_description: "Fix Capital One checking account disappeared while credit card is still showing. Learn how to merge dual customer profiles, resolve ECM desyncs, and restore checking access.",
    content: `A frequent and confusing issue encountered by Capital One customers occurs when logging into the mobile app or web portal and finding that their **credit card (Venture, Quicksilver, Savor) appears normally, but their 360 Checking or Savings account has vanished from the dashboard**.

This specific symptom—where credit card accounts remain operational while deposit accounts disappear—almost always points to a **customer profile desynchronization** or an administrative separation within Capital One's core customer database.

---

## Root Cause: The Dual Customer Profile Problem

Capital One operates its credit card products and deposit banking products (360 Checking and Savings) on distinct core database architectures. To provide a single unified login, Capital One uses an **Enterprise Customer Master (ECM)** system.

\`\`\`
[Your Single Login ID]
         │
         ├──> [Credit Card Master File: Cardholder Profile #A] ──> ✅ Visible
         │
         └──> [Deposit Banking Master File: 360 Profile #B]   ──> ❌ Desynchronized / Unlinked
\`\`\`

When an ECM desync occurs:
1. **Name or Address Discrepancy:** If you updated your address or legal name on your credit card account but not your 360 checking account (or vice versa), the system splits your single digital identity into two separate profiles.
2. **SSN Typo / Verification Mismatch:** A minor discrepancy in how middle initials, suffixes (Jr., III), or phone numbers were recorded.
3. **Multiple Digital User IDs Created:** If you registered a new username when opening your checking account instead of linking it to your existing credit card login, the systems conflict.
4. **Maintenance Batch Desync:** Capital One's weekend batch reconciliations occasionally cause temporary linking breaks between card and banking databases.

---

## Step-by-Step Resolution Protocol

### Step 1: Check Account Linking Settings
1. Log into your account at **capitalone.com** on a desktop browser.
2. Click your name or profile picture in the top-right corner.
3. Select **Security & Settings** > **Linked Accounts**.
4. Check if your 360 Checking account is listed as *"Unlinked"* or *"Hidden"*.
5. If you see an option to **"Link an Account"**, follow the prompts to enter your checking account number and SSN to force an instant merge.

### Step 2: Verify Multiple Username Collisions
If you have used Capital One for several years, you may have an older secondary User ID:
1. Go to the sign-in screen and click **"Forgot Username or Password?"**.
2. Enter your Social Security Number and date of birth.
3. Capital One will display or email all active Usernames associated with your SSN.
4. If you discover two distinct usernames (e.g., one created for your 2018 credit card and one for your 2022 checking account), log into each one separately to confirm where the deposit accounts are residing.

### Step 3: Request an ECM Profile Merge
If both accounts exist under your SSN but cannot be viewed under a single login:
- Call Capital One 360 Customer Service at **1-888-464-0727**.
- Ask for a **"Customer Profile Consolidation"** (ECM Profile Merge).
- The agent will verify your identity across both accounts, submit a backend merge request, and link both accounts under your preferred primary User ID.
- ECM merges generally take **24 to 48 business hours** to reflect across mobile apps.

---

## Frequently Asked Questions

### Can I still use my 360 debit card while it's unlinked from my app?
Yes! If the issue is simply an Enterprise Customer Master profile desync (and not a fraud freeze), your physical debit card, automatic bill pays, and direct deposits continue functioning without interruption.

### How do I ensure my accounts never split again?
Ensure that your legal name, mailing address, primary email, and mobile phone number match identically across both your credit card profile and your deposit banking profile. Whenever moving or changing phone numbers, update both accounts simultaneously.`
  },

  // ── 3. App Says Unable to Retrieve Account Details ──
  {
    title: "Capital One App 'Unable to Retrieve Account Details': 5 Step Fix Guide",
    slug: "capital-one-app-unable-to-retrieve-account-details",
    category: "mobile-app-problems",
    bank_name: "Capital One",
    excerpt: "Getting the 'We're unable to retrieve your account details right now' error on the Capital One mobile app? Learn why the mobile API times out and how to restore access immediately.",
    meta_description: "Fix Capital One app unable to retrieve account details error. Step-by-step solutions for mobile API gateway timeouts, corrupted app cache, and network filtering.",
    keywords: JSON.stringify([
      'capital one app unable to retrieve account details',
      'capital one unable to retrieve account details right now',
      'capital one app loading error account details',
      'capital one mobile app error unable to retrieve',
      'capital one app error code details'
    ]),
    content: `When opening the Capital One Mobile App on iPhone or Android, encountering the screen stating **"We're unable to retrieve your account details right now. Please try again later"** completely prevents you from checking balances, making transfers, or locking cards.

This error is fundamentally a **client-to-cloud API gateway failure**, where the app successfully passes biometric or password authentication, but the backend microservices fail to deliver your account balance payload within the allotted timeout window.

---

## Diagnostic Matrix

| Error Trigger | Platform Affected | Root Cause | Fix |
| :--- | :--- | :--- | :--- |
| **Wi-Fi DNS / Ad-Blocker** | iOS & Android | Local DNS blocking Capital One telemetry or API domains | Switch from Wi-Fi to Cellular 5G |
| **Outdated App Version** | Older iOS/Android builds | Deprecated API endpoint retired by Capital One engineers | Update app via App Store / Google Play |
| **Corrupted Local App Cache** | Primarily Android | Stale OAuth tokens colliding with fresh session requests | Clear App Storage & Cache |
| **Backend System Maintenance** | All platforms | Scheduled server maintenance (typically Sundays 1–5 AM ET) | Check DownDetector or wait 1–2 hours |

---

## Step-by-Step Fix Protocol

### Step 1: Switch Immediately to Cellular Data
Many modern home Wi-Fi routers (such as eero, ASUS AiProtection, or Pi-hole) utilize automated security filters that intermittently block API domains used by Capital One (such as \`api.capitalone.com\` or \`mobile.capitalone.com\`):
1. Swipe down your control center and toggle **Wi-Fi OFF**.
2. Disconnect any active VPN services (iCloud Private Relay, Google One VPN, NordVPN).
3. Ensure your phone displays **LTE or 5G**.
4. Force-close the Capital One app and reopen it.

### Step 2: Clear Application Cache & Storage
- **On Android:** Go to **Settings** > **Apps** > **Capital One** > **Storage & Cache** > tap **Clear Cache**. Next, tap **Clear Storage** (this will reset your app preferences and require re-logging in).
- **On iPhone:** iOS does not offer a standalone "Clear Cache" button for apps. Open **Settings** > **General** > **iPhone Storage** > **Capital One** > tap **Offload App** and then tap **Reinstall App**. This clears corrupted temp files while preserving your credentials.

### Step 3: Test Web Portal Login via Mobile Safari / Chrome
To quickly confirm whether the issue is app-specific or account-wide:
1. Open your mobile browser and navigate to **capitalone.com**.
2. Sign in with your username and password.
3. If the web portal displays your accounts with no errors, the issue is 100% localized to your mobile app installation. If the web portal also fails, Capital One's core banking servers are currently experiencing an unscheduled outage.

### Step 4: Reinstall the Capital One App
If clearing cache does not resolve the error:
1. Delete the Capital One app completely from your device.
2. Restart your smartphone to flush active memory pools.
3. Re-download the official **Capital One Mobile** app from the App Store or Google Play Store.
4. Log in and re-enroll in Face ID / Touch ID.`
  },

  // ── 4. Mobile Deposit Stuck on Processing ──
  {
    title: "Capital One Mobile Deposit Stuck on Processing: Hold Times & Funds Release",
    slug: "capital-one-mobile-deposit-stuck-on-processing",
    category: "mobile-app-problems",
    bank_name: "Capital One",
    excerpt: "Has your Capital One mobile check deposit been stuck on 'Processing' for multiple business days? Learn standard funds availability timelines, check hold rules, and how to verify clearance.",
    meta_description: "Fix Capital One mobile deposit stuck on processing. Learn about check hold timelines, Regulation CC availability rules, and how to release pending deposit funds.",
    keywords: JSON.stringify([
      'capital one mobile deposit stuck on processing',
      'capital one check deposit processing for days',
      'capital one mobile deposit hold time',
      'how long does capital one mobile deposit process',
      'capital one check deposit pending'
    ]),
    content: `Submitting a check via the Capital One mobile app is convenient, but seeing the transaction status remain **"Processing"** or **"Funds on Hold"** for days can cause severe cash flow anxiety.

Understanding Capital One's specific deposit hold policies, cut-off hours, and verification pipelines will help you determine whether your deposit is simply progressing through standard clearing or is trapped in a manual fraud review.

---

## Capital One Mobile Deposit Availability Schedule

Under Federal Reserve **Regulation CC**, Capital One implements the following baseline availability schedule for mobile check deposits:

| Account Standing | Deposit Amount | Business Days to Availability | Notes |
| :--- | :--- | :--- | :--- |
| **Standard Account (>30 days open)** | First $225 | Next Business Day | Available by 9:00 AM ET |
| **Standard Account** | Up to $5,525 | 2 to 3 Business Days | Subject to automated maker bank verification |
| **Standard Account** | Amounts exceeding $5,525 | 5 to 7 Business Days | Large deposit exception hold applies |
| **New Account (<30 days open)** | All check amounts | Up to 5 Business Days | Stricter probationary availability rules |

> [!NOTE]
> **Business Day Cut-Off Time:** Capital One's daily cut-off time for mobile check deposits is **9:00 PM Eastern Time (ET)** on business days (Monday through Friday, excluding federal holidays). Any check scanned after 9:00 PM ET on a Friday is considered deposited on Monday morning.

---

## Why Is Your Deposit Stuck Longer Than Usual?

1. **Third-Party Check Endorsement:** If the check was made out to someone else and signed over to you, automated OCR will reject it, routing it to a manual analyst queue.
2. **Account Maker History:** If the issuing bank or payer's account has a history of returned checks, stop payments, or insufficient funds, Capital One places an **extended risk hold**.
3. **Illegible Front or Back Image:** Glare, shadows, or faint ink over the MICR numbers (routing and account digits at the bottom of the check) prevent high-speed optical clearing.
4. **Missing Restrictive Endorsement:** Failure to write *"For Capital One Mobile Deposit Only"* below your signature triggers manual compliance review.

---

## Action Plan: What to Do While Stuck

### Step 1: Verify the Check Status in Account Details
1. Open the Capital One Mobile App.
2. Select your **360 Checking** or **360 Performance Savings** account.
3. Tap on the pending check deposit transaction.
4. Look for the line labeled **"Estimated Availability Date"**. Capital One displays the exact date and time funds are scheduled to become spendable.

### Step 2: Do NOT Re-Deposit the Physical Check
Never attempt to deposit the physical check at an ATM or another bank while the status says *"Processing"*. Doing so will trigger an automatic **duplicate presentment alert**, leading to account freezes and potential check return fees. Keep the physical paper check stored securely for at least **14 business days** after funds clear.

### Step 3: Call 360 Deposit Services
If the deposit has remained stuck past the scheduled availability date:
- Call **1-888-464-0727** and request to speak with a **Deposit Holds Specialist**.
- Provide the check amount, check number, and deposit date.
- The agent can confirm whether the check has cleared the Federal Reserve clearinghouse and can manually release funds if the hold was triggered by an algorithmic delay.`
  },

  // ── 5. Direct Deposit Not Showing on Payday ──
  {
    title: "Capital One Direct Deposit Not Showing on Payday: Trace & Timing Rules",
    slug: "capital-one-direct-deposit-not-showing-on-payday",
    category: "account-issues",
    bank_name: "Capital One",
    excerpt: "Is it payday morning and your direct deposit is nowhere to be found in your Capital One 360 account? Learn how the ACH clearing cycle works and how to track down your paycheck.",
    meta_description: "Fix Capital One direct deposit not showing on payday. Learn ACH settlement windows, employer payroll deadlines, and Nacha trace number lookups.",
    keywords: JSON.stringify([
      'capital one direct deposit not showing on payday',
      'capital one paycheck late',
      'what time does capital one direct deposit hit',
      'capital one direct deposit missing payday',
      'capital one direct deposit delay'
    ]),
    content: `Waking up on your official payday to find that your **direct deposit has not posted to your Capital One 360 account** is deeply stressful. You have bills to pay, mortgages due, or debit charges waiting.

Before assuming your money has been lost, it is critical to understand the exact mechanics of the **Automated Clearing House (ACH)** network and how Capital One processes incoming payroll files.

---

## What Time Does Capital One Post Direct Deposits?

Capital One processes incoming direct deposits in multiple batch waves throughout the night and early morning:

| ACH Processing Wave | Typical Posting Window | Description |
| :--- | :--- | :--- |
| **Wave 1 (Overnight)** | 12:00 AM – 3:30 AM ET | Primary batch for employers who submit payroll 48 hours in advance |
| **Wave 2 (Early Morning)** | 5:00 AM – 7:30 AM ET | Secondary clearing wave for late-night Federal Reserve files |
| **Wave 3 (Mid-Day)** | 11:00 AM – 1:00 PM ET | Same-Day ACH batch for emergency or expedited payroll runs |

If your direct deposit normally arrives at 3:00 AM and it is currently 6:30 AM, it may simply be queueing in Wave 2.

---

## 4 Common Reasons for Payday Deposit Delays

\`\`\`
[Employer Payroll Dept] ──> [Originating Bank (ODFI)] ──> [Federal Reserve ACH] ──> [Capital One (RDFI)]
            │
(Late Submission / Holiday) ──> Delay propagates through entire network
\`\`\`

1. **Late Payroll Submission by Employer:** For funds to arrive on Friday morning, your employer's payroll department must submit the ACH file to their bank by Wednesday evening. If submitted late Thursday, the deposit will not arrive until Friday afternoon or Monday morning.
2. **Federal Reserve Bank Holidays:** The ACH network does not operate on federal holidays (such as Labor Day, Memorial Day, Juneteenth, Columbus Day, or Veterans Day). If a holiday falls on Monday or Thursday, all processing pushes back by one full business day.
3. **Incorrect Routing or Account Number:** Double check whether you provided the correct routing number. Capital One 360 checking accounts use routing number **031176110** (or **051405515** depending on regional state assignment).
4. **First-Time Payroll Verification:** If this is your first paycheck from a new employer, payroll systems frequently run a pre-notification zero-dollar test transaction (pre-note) before sending live funds.

---

## Step-by-Step Troubleshooting Protocol

### Step 1: Check with Your Coworkers
Ask colleagues who share your employer whether their direct deposit has posted today. If coworkers banking with other institutions also have not been paid, the delay is 100% on your employer's payroll processing end (e.g., ADP, Paychex, or Gusto batch delay).

### Step 2: Request the 15-Digit ACH Trace Number
If coworkers have been paid but you have not:
1. Contact your employer's HR or Payroll department immediately.
2. Ask: *"Can you confirm that my direct deposit file was sent, and can you provide the **15-digit ACH Trace Number** for today's payment?"*
3. A valid trace number proves the file was transmitted through the Federal Reserve system.

### Step 3: Contact Capital One with the Trace Number
Once you have the ACH trace number:
- Call Capital One 360 Support at **1-888-464-0727**.
- Inform the representative: *"My payroll has not posted today. I have the Nacha ACH trace number from my employer."*
- Capital One back-office specialists can enter the trace number into their incoming Fedwire/ACH queue to locate the trapped funds and manually release them to your available balance.`
  },

  // ── 6. Early Paycheck Stopped Showing ──
  {
    title: "Capital One Early Paycheck Stopped Showing: 2 Days Early Deposit Explained",
    slug: "capital-one-early-paycheck-stopped-showing",
    category: "account-issues",
    bank_name: "Capital One",
    excerpt: "Did you rely on getting paid on Wednesday instead of Friday, but your Capital One Early Paycheck feature suddenly stopped working? Here is how early direct deposit works and why it lapses.",
    meta_description: "Fix Capital One early paycheck stopped showing. Learn why Early Pay Direct Deposit is not guaranteed, employer transmission timing, and holiday schedule impacts.",
    keywords: JSON.stringify([
      'capital one early paycheck stopped showing',
      'capital one early direct deposit not working',
      'capital one 2 days early paycheck delay',
      'why did capital one stop paying early',
      'capital one early pay day missing'
    ]),
    faq_schema: JSON.stringify([
      {
        question: 'Is Capital One Early Paycheck guaranteed every pay period?',
        answer: 'No. Capital One terms explicitly state that Early Pay Direct Deposit is not guaranteed. It is completely dependent on when your employer transmits the official ACH payroll notification file to the Federal Reserve.'
      },
      {
        question: 'Does Capital One charge a fee for early direct deposit?',
        answer: 'No, Capital One offers early direct deposit completely free on all eligible 360 Checking accounts.'
      }
    ]),
    content: `Capital One's **Early Pay Direct Deposit** feature allows 360 Checking customers to access their paycheck **up to 2 days early**. For thousands of workers who normally get paid on Friday, having funds available on Wednesday afternoon has become standard.

When an early paycheck suddenly fails to arrive on Wednesday or Thursday, panic sets in. However, in almost every scenario, **your early pay feature has not been disabled**—the underlying timing of the payroll transmission simply changed.

---

## How Early Pay Direct Deposit Actually Works

\`\`\`
Standard Bank:  [Employer sends ACH file] ────> [Waits for Friday Settlement] ────> Funds Available Friday
Capital One:    [Employer sends ACH file] ────> [Validates Notification] ───────> ⚡ Funds Released Immediately (Wed/Thu)
\`\`\`

1. Your employer submits their payroll file to their payroll bank (ODFI).
2. The payroll bank transmits an advance ACH notification to the Federal Reserve.
3. When Capital One receives this preliminary notice, they credit your account **in advance of actually receiving the funds from the Fed**.
4. **The Catch:** If your employer submits their payroll file just 2 hours later than usual, the notice arrives past Capital One's early processing window, meaning your deposit reverts to your **official contracted payday (Friday)**.

---

## Why Early Direct Deposit Lapses

### 1. The Federal Holiday Shift
If a federal holiday falls anywhere during the pay week (Monday through Thursday), payroll departments frequently shift their approval cycles, causing the ACH notice to land on Thursday or Friday morning instead of Wednesday.

### 2. Employer Switch in Payroll Software
If your company switched from Gusto to ADP, or from Paychex to Workday, the new processor may transmit payroll files on a standard 1-day turnaround rather than a 2-day advance window.

### 3. Manager Approval Delays
If a supervisor approves team timesheets on Tuesday morning instead of Monday afternoon, the entire batch sequence slips by 24 hours.

---

## What to Do When Early Pay Fails
- **Do not submit stop-payments or panic:** Remember that your legal payday is Friday. Capital One cannot force an early release if they have not yet received the ACH file from the Federal Reserve.
- Check with your employer's payroll desk to confirm when the batch was submitted.
- Your funds will post no later than **Friday morning by 6:00 AM ET**.`
  },

  // ── 7. Zelle Payment Pending Under Review ──
  {
    title: "Capital One Zelle Payment Pending Under Review: How Long & How to Clear",
    slug: "capital-one-zelle-payment-pending-under-review",
    category: "payments-transactions",
    bank_name: "Capital One",
    excerpt: "Is your Capital One Zelle transaction stuck on 'Pending' or 'Under Review'? Learn how long security reviews take, when funds are returned, and how to verify recipients.",
    meta_description: "Fix Capital One Zelle payment pending under review. Step-by-step resolution for fraud screening holds, transaction cancellation rules, and release timelines.",
    keywords: JSON.stringify([
      'capital one zelle payment pending under review',
      'how long does capital one zelle review take',
      'capital one zelle pending transfer',
      'why is my zelle pending capital one',
      'cancel pending zelle capital one'
    ]),
    content: `While Zelle is designed for instant peer-to-peer transfers, Capital One transactions occasionally halt with a status reading **"Pending - Under Review"**.

Instead of reaching the recipient in minutes, the funds are deducted from your balance, but the recipient sees nothing, and the transaction details state that Capital One is reviewing the payment for security.

---

## Why Capital One Holds Zelle Transactions

Capital One uses real-time behavioral analytics provided by **Early Warning Services (EWS)** to combat payment fraud and social engineering scams. Payments are placed under review if:

1. **First-Time Transfer to a Fresh Contact:** Sending a payment over $250 to a mobile number or email address you have never previously transacted with.
2. **Flagged Recipient Profile:** If the recipient's phone number was recently registered on Zelle with a different banking institution within the past 7 days.
3. **Daily / Weekly Velocity Limits:** You have initiated multiple transfers in rapid succession approaching your account limits (typically $2,500/day for 360 Checking).
4. **Scam Pattern Detection:** Sending money following keywords in memo lines (e.g., "deposit," "puppy," "concert tickets," "escrow") that match known peer-to-peer scam databases.

---

## Review Timelines & Outcomes

| Review Outcome | Timeline | Result |
| :--- | :--- | :--- |
| **Automated Clear** | 1 to 4 hours | Funds delivered directly to recipient bank account |
| **Secondary Verification** | Up to 24 hours | Capital One sends SMS or push prompt requesting confirmation |
| **Transaction Cancelled** | End of 24-hour window | Transfer rejected; funds credited back to your 360 checking balance |

---

## Step-by-Step Protocol to Expedite Clearance

### Step 1: Check for a Security Text Verification
Capital One frequently sends an automated SMS prompt to your registered mobile phone:
- Check for texts from shortcode **227466** (CAPONE).
- The text will state: *"Did you attempt to send $[Amount] to [Recipient] via Zelle? Reply YES to approve or NO to block."*
- Replying **YES** immediately satisfies the automated security challenge and releases the pending hold.

### Step 2: Can You Cancel a Pending Zelle Payment?
- If the transaction is marked **"Pending"** because the recipient has **not yet enrolled in Zelle**, you can cancel it:
  1. Open the Capital One app > select **Zelle**.
  2. Tap **Activity** > locate the pending transfer.
  3. If eligible, a red **"Cancel Payment"** button will be displayed.
- If the payment is under **Internal Fraud Review**, the cancel button is disabled while the security desk examines the transaction.

### Step 3: Call Capital One Fraud Support
If the payment has been under review for longer than 6 hours and is urgent:
- Call **1-800-424-7732** (Fraud Operations).
- Explain that you are the verified account holder and explicitly authorize the transaction.`
  },

  // ── 8. Zelle Recipient Not Receiving Money ──
  {
    title: "Capital One Zelle Sent but Recipient Not Receiving Money [Solved]",
    slug: "capital-one-zelle-recipient-not-receiving-money",
    category: "payments-transactions",
    bank_name: "Capital One",
    excerpt: "Did money leave your Capital One account via Zelle, but the recipient still has zero funds? Step-by-step diagnostic guide to trace missing peer-to-peer payments.",
    meta_description: "Fix Capital One Zelle sent but recipient not receiving money. Learn how to verify enrollment tokens, trace missing funds, and resolve receiving bank delays.",
    keywords: JSON.stringify([
      'capital one zelle sent but recipient not receiving money',
      'zelle money taken from capital one but recipient didnt get it',
      'capital one zelle completed but no money',
      'how to track missing zelle payment capital one',
      'capital one zelle recipient delay'
    ]),
    content: `A distressing situation occurs when Capital One indicates that your Zelle payment is **"Completed"**, the money has been debited from your 360 checking balance, but the recipient insists they have received nothing.

Before assuming the money is lost, work through this definitive diagnostic checklist.

---

## 4 Reasons Why Zelle Shows Completed but Recipient Has Nothing

### 1. Token Mismatch (Wrong Email or Phone Number)
Zelle routes money based on **Tokens** (either a U.S. mobile phone number or an email address). If the recipient has their phone number registered at Chase, but you sent the funds to their Gmail address which is unregistered, the money sits in a digital escrow limbo.

### 2. Recipient Changed Banks Without Updating Zelle
If your recipient used to bank with Wells Fargo and recently switched to Bank of America, their phone number may still be linked to their old, closed bank account in the central Zelle directory.

### 3. Receiving Bank Inbound Security Hold
Even after Capital One releases the funds, the recipient's bank (e.g., Citi, PNC, TD Bank) may place an internal 24-hour inbound anti-money laundering hold on the deposit.

### 4. Recipient Has Not Completed Zelle Registration
If the recipient has never used Zelle before, they have **14 calendar days** to enroll their phone or email at their own bank to claim the funds.

---

## Step-by-Step Resolution Protocol

### Step 1: Check the Exact Transfer Receipt in Capital One
1. Open the Capital One App > tap **Zelle** > select **Activity**.
2. Tap the specific transaction to inspect the full receipt.
3. Verify every single digit of the phone number or every letter of the email address.
4. If there is a typo of even one character, the money was sent to an unregistered token or another individual.

### Step 2: Have the Recipient Check Their Zelle Directory Enrollment
Ask your recipient to open their own banking app:
1. Navigate to their bank's Zelle settings.
2. Confirm which exact email and phone number are displayed as **"Enrolled"**.
3. If the recipient receives an email from \`support@zellepay.com\` notifying them of incoming funds, they must click the link to claim the payment.

### Step 3: Obtain the Zelle Transaction Reference ID
If the token is 100% verified, your recipient is registered, and funds have not arrived after 2 hours:
- Call Capital One at **1-888-464-0727**.
- Request the **Zelle Network Confirmation Reference Number** (an alphanumeric string formatted like \`C1-ZEL-XXXXXXXX\`).
- Provide this code to your recipient. Their bank's customer service can use this reference to pull up the trapped payment directly in the clearing network.`
  },

  // ── 9. External Account Verification Failed ──
  {
    title: "Capital One External Account Verification Failed: Plaid & Trial Deposits Fix",
    slug: "capital-one-external-account-verification-failed",
    category: "payments-transactions",
    bank_name: "Capital One",
    excerpt: "Cannot link your external bank account to Capital One 360? Fix Plaid instant verification errors, micro trial deposit failures, and account name mismatches.",
    meta_description: "Fix Capital One external account verification failed. Step-by-step troubleshooting for Plaid connection errors, trial micro-deposit mismatches, and ACH linking blocks.",
    keywords: JSON.stringify([
      'capital one external account verification failed',
      'capital one cannot link external bank',
      'capital one plaid connection error',
      'capital one trial deposits failed',
      'capital one link bank account error'
    ]),
    content: `Linking an outside checking or savings account (from Chase, Bank of America, Navy Federal, etc.) to your Capital One 360 account is necessary for moving funds via ACH.

When the linking process errors with **"Account Verification Failed"** or trial micro-deposits fail to post, automated money movement is completely blocked.

---

## Root Causes of External Account Linking Failures

1. **Legal Name Mismatch:** Capital One requires that the legal first and last name on your external bank account match your Capital One profile identically. You cannot link an account in a spouse's name, parent's name, or business entity name to an individual 360 checking account.
2. **Third-Party Open Banking API (Plaid) Desync:** Capital One uses instant verification APIs that frequently fail if the external bank enforces mandatory hardware security keys or broken OAuth handshakes.
3. **Trial Deposit Expiration:** If using micro-deposits, Capital One sends two deposits under $1.00. If you do not verify the exact amounts within **10 business days**, the verification token permanently expires.
4. **External Bank Restricts ACH Debits:** Certain high-yield savings accounts or credit union share accounts do not permit external third-party automated debits.

---

## Step-by-Step Linking Protocol

### Step 1: Switch from Instant Verification to Manual Micro-Deposits
If Plaid or instant online verification keeps throwing error screens:
1. Log into **capitalone.com** on a desktop computer.
2. Navigate to **Transfers** > **External Accounts** > **Add an Account**.
3. When prompted to select your bank, deliberately search for a fake bank name or click **"I can't find my bank"** or **"Verify manually with account numbers"**.
4. Enter your external institution's **Routing Number** and **Account Number** manually.

### Step 2: Monitoring the 2 Micro-Deposits
1. Allow **2 to 3 business days** for Capital One to transmit two small deposits (e.g., $0.14 and $0.38) and one offsetting withdrawal.
2. Log into your external bank and note the exact cent amounts.
3. Return to Capital One > **Transfers** > **Verify External Account**.
4. Enter the two exact numbers. Do not guess—entering incorrect amounts 3 times will permanently black-list that external account from linking.`
  },

  // ── 10. Transfer Pending for Days ──
  {
    title: "Capital One Transfer Pending for Days: ACH Timelines & Release Rules",
    slug: "capital-one-transfer-pending-for-days",
    category: "payments-transactions",
    bank_name: "Capital One",
    excerpt: "Is your Capital One external transfer or internal transfer stuck in pending status for 3 to 5 business days? Learn standard ACH hold periods and how to speed up transfers.",
    meta_description: "Fix Capital One transfer pending for days. Complete guide to ACH clearing times, hold policies on incoming funds, and how to verify transfer completion.",
    keywords: JSON.stringify([
      'capital one transfer pending for days',
      'how long does capital one transfer take',
      'capital one external transfer stuck pending',
      'capital one funds transfer hold',
      'why is my capital one transfer taking so long'
    ]),
    content: `When transferring funds between your external bank and Capital One 360 (or moving funds between 360 Checking and 360 Performance Savings), having the transaction display **"Pending"** for days is frustrating.

Understanding the difference between **ACH transit time** and **funds availability holds** will clarify exactly when your money can be spent.

---

## Standard Capital One Transfer Timelines

| Transfer Direction | Initiated Via | Total Business Days | Notes |
| :--- | :--- | :--- | :--- |
| **Internal (Checking to Savings)** | App / Web | **Instant** | Available immediately 24/7/365 |
| **Outbound (Capital One to Outside Bank)** | App / Web | **1 to 2 Business Days** | Cut-off time is 8:00 PM ET |
| **Inbound (Pulled into Capital One from Outside Bank)** | App / Web | **3 to 5 Business Days** | Subject to fraud clearing hold |
| **External Wire Transfer** | Wire Desk | **Same Day** | Cut-off time is 2:00 PM ET; $30 outgoing fee |

---

## Why Inbound Transfers Take Longer (The "Pull" vs. "Push" Rule)

If you log into Capital One and **PULL** $5,000 from your external Wells Fargo account:
- Capital One does not receive the funds from Wells Fargo until Day 2 or 3.
- To protect against overdrafts or reversed transfers, Capital One places a **fraud hold of up to 4 business days** on the incoming funds.
- **The Pro Tip ("Push"):** If you log into Wells Fargo and **PUSH** the money to Capital One, the funds arrive via direct ACH credit and become available **the next business day** without a multi-day hold.

---

## How to Check Transfer Status
1. Open the Capital One App.
2. Select the account > tap the pending transfer line item.
3. Read the **"Expected Completion Date"**.
4. If that date passes and funds are still not usable, call Capital One 360 Banking Support at **1-888-464-0727** to check for compliance review flags.`
  }
];

async function publishPart1() {
  console.log(`🚀 Publishing Part 1 (10 articles) for Capital One...`);

  for (const article of CAPONE_ARTICLES_PART1) {
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

  console.log(`✅ Part 1 complete!`);
}

publishPart1();
