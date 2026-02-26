const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

/* ---Button Styling Must be above  template function --- */
const buttonStyle = "display:inline-block;padding:12px 20px;margin:10px 0;background-color:#000;color:#fff;text-decoration:none;border-radius:6px;font-weight:bold;";

/* --- Email Template Generator --- */
function generateEmailTemplate(name, packageType) {

    const isLifetime = packageType === "Lifetime Access";

    const renewalSection = isLifetime
    ? `
    <hr/>
    <h3>Server Hosting Fee Renewal</h3>
    <p>Your Lifetime Access includes <strong>1 month free hosting.</strong></p>
    <p>Thereafter, a <strong>monthly R187 hosting fee</strong> applies to keep your system connected.</p>
    <p>If a payment is missed, your server will automatically disconnect until renewal is completed. You can pause anytime, and renew once ready to <strong>using the button below.</strong></p>
    <a href="https://pay.yoco.com/r/mO5yLK" style="${buttonStyle}">
    Pay Monthly Server Fee (R187)
    </a>
    `
    : `
    <hr/>

    <h3>Monthly Access Renewal</h3>
    <p>System hosting fees are already included in your monthly subscription.</p>
    <p>You will receive a renewal link each month should you wish to continue access.</p>
    <p>If renewal is not completed, system access will pause until payment is made.</p>
    <a href="https://pay.yoco.com/r/703dpW" style="${buttonStyle}">
    Renew Monthly Access
    </a>
    `;

    return `
    <div style="font-family: Arial, sans-serif; max-width: 650px; margin: auto; line-height:1.6; color:#222;">

    <div style="text-align:center; margin:10px 0 5px 0;">
    <img src="https://bankrollfx.com/images/bankrollfxlogo.JPG"
    style="width:110px; height:auto; display:block; margin:0 auto;" />
    </div>

    <h2>Welcome ${name || ""},</h2>

    <p>Your <strong>${packageType}</strong> has been Successfully Confirmed - Let's Get You Live. You now have permenant access to the Bankroll Trading System.</p>

    <hr/>

    ${isLifetime ? `
        <h3>What "Lifetime" Means</h3>
        
        <p>
        ✔️ No monthly subscription fee<br/>
        ✔️ Ongoing system updates included<br/>
        ✔️ Access to all supported symbols<br/>
        ✔️ Human-supervised rule-based execution
        </p>
        
        <br/>
        
        <p><strong>The system trades:</strong></p>
        
        <p>
        • US30<br/>
        • NAS100<br/>
        • XAUUSD
        </p>

        <p><strong>All from one trading account.</strong></p>

        <hr/>
        ` : ""}

    <h3>Step 1 - Open a Space Markets Account</h3>
    <a href="https://my.spacemarkets.io/auth/register?partner_code=6199647" style="${buttonStyle}">
    Open Space Markets Account
    </a>

    <p>If you already have a Space Markets Account, email:</p>
    <p><strong>Partners@spacemarkets.io</strong> and request to be moved to Clarence Wiliams Book ID 6199647.</p>

    <hr/>

    <h3>Step 2 - Download MetaTrader 5</h3>

    <a href="https://www.metatrader5.com/en/download" style="${buttonStyle}">
    Download MetaTrader 5
    </a>

    <p>Once installed, log in using the trading account credentials sent to your email by Space Markets. Contact our admin for assistance if you need.</p>

    <hr/>

    <h3>Step 3 - Contact Admin & Download the required attached documents below, complete, sign, and return by replying to this email. Once peramteters have been confirmed, we will link you to the System.</h3>
    <a href="https://t.me/Bankroll_Forex_Admin" style="${buttonStyle}">
    Contact Admin on Telegram
    </a>

    <p>Please Send Admin:</p>
    <ul>
    <li>Your Name and email used on purchase</li>
    <li>Your Space Markets trading account number</li>
    <li>Your MetaTrader password sent via email from Space Markets (read-only access only)</li>
    <li>Your Signed Agreements confirming selected risk parameters (via email only).</li>
    </ul>

    <p><strong>Important:</strong> These credentials only allow MetaTrader 5 terminal access. We have no access to your funds/deposits or withdrawals. Clients retain full control of their brokerage accounts at all times.</p>

    <hr/>

    <h3>Step 4 - Fund Your Space Markets Account</h3>
    <p>You may fund your brokerage account with any amount you are comfortable to risk.</p>
    <p>For margin efficiency on US30, NAS100, and XAUUSD, balances below R2000 on a Standard Account are not recommended. A Micro/Cent account may be more suitable for smaller capital allocations.</p>

    <hr/>

    ${renewalSection}

    <hr/>

    <h3>Important Disclaimer</h3>
    <p>By completing your purchase, you confirmed acceptance of our Terms & Conditions available on our website.</p>
    <p>This service consists of non-discretionary intermediary execution of derivative trades under a predefined strategy model & client-selected risk parameters. It does not constitute portfolio management or discretionary investment management.</p>
    <p>Trading leveraged derivative instruments carries significant risk and may result in partial or total loss of capital.</p>
    <p>You are fully responsible for your trading decisions and capital allocation. Bankroll FX and its representatives shall not be held liable for losses arising from market conditions or client-selected parameters, subject to applicable law.</p>
    <p>Nothing in this clause nor our Terms and Conditions excludes liability arising from fraud, wilful misconduct or gross negligence.</p>
    <p>Client data is processed in accordance with applicable data protection legislation and retained for regulatory compliance purposes.</p>

    <hr/>

    <p><strong>Required Onboarding Documents</strong></p>

    <p>Please download, complete and return the following documents before system activation:</p>

    <p style="margin:20px 0;">
        <a href="https://bankrollfx.com/docs/intermediary-mandate.pdf"
        target="_blank"
        style="display:inline-block;padding:14px 24px;background-color:#00b248;color:#ffffff;text-decoration:none;font-weight:600;border-radius:8px;font-size:16px;">
        Download Intermediary Mandate
        </a>
    </p>

    <p style="margin:20px 0;">
        <a href="https://bankrollfx.com/docs/risk-declaration.pdf"
        target="_blank"
        style="display:inline-block;padding:14px 24px;background-color:#00b248;color:#ffffff;text-decoration:none;font-weight:600;border-radius:8px;font-size:16px;">
        Download Risk Declaration
        </a>
    </p>

    <p>Reply to this email with the signed documents attached. Activation proceeds once parameters are confirmed.</p>

    <hr/>

    <p>Welcome to Bankroll FX.</p>

    </div>
    `;
}

/* ----- Netlify Handler ----- */
exports.handler = async (event) => {
    try {
        const { email, name, packageType } = JSON.parse(event.body);

        console.log("Sending email to:", email);

        await resend.emails.send({
            from: "Bankroll FX <info@bankrollfx.com>",
            to: email,
            subject: `Payment Received - Welcome to Bankroll ${packageType} Confirmed`,
            html: generateEmailTemplate(name, packageType),
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true}),
        };

    } catch (error) {
        console.error("Email error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
