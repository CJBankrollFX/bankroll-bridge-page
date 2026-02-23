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
    <h3>Server Fee Renewal</h3>
    <p>Your Lifetime package includes <strong>1 month free server fee.</strong></p>
    <p>Thereafter you will receive a monthly R187 renewal link per active trading account connected onto the system.</p>
    <p>If a payment is missed, your server will automatically disconnect until renewal is completed.</p>
    <a href="https://pay.yoco.com/r/mO5yLK" style="${buttonStyle}">
    Pay Monthly Server Fee (R187)
    </a>
    `
    : `
    <hr/>
    <h3>Monthly Subscription Renewal</h3>
    <p>Your Monthly Access includes server fees within your subscription.</p>
    <p>You will receive an automated renewal link each month.</p>
    <p>If payment is missed, access is immediately revoked and deleted off the system until payment is received.</p>
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

    <p>Your <strong>${packageType}</strong> has been successfully activated.</p>

    <hr/>

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

    <h3>Step 3 - Contact Admin Either via this email or Telegram below, to go over Risk Tiers or any assistance needed. Download the required documents below, complete, sign, and return by replying to this email. Once peramteters have been confirmed, we will link you to the System.</h3>
    <a href="https://t.me/Bankroll_Forex_Admin" style="${buttonStyle}">
    Contact Admin on Telegram
    </a>

    <p>Send Admin:</p>
    <ul>
    <li>Your Name and email address associated with the form</li>
    <li>Your Space Markets account number</li>
    <li>Your MetaTrader auto-generated passcode sent via Space Markets to your email</li>
    <li>Your Signed copy of the Mandate with risk tiers and parameters defined and consented by you as the client</li>
    </ul>

    <p><strong>Important:</strong> These credentials only allow MetaTrader 5 terminal access. We have no access to your funds.</p>

    <hr/>

    <h3>Step 4 - Fund Your Space Markets Account</h3>
    <p>Minimum R1500 required for system operation. R3000+ recommended for optimal risk management.</p>

    <hr/>

    ${renewalSection}

    <hr/>

    <h3>Important Disclaimer</h3>
    <p>By completing your purchase, you confirmed acceptance of our Terms & Conditions available on our website.</p>
    <p>This service consists of non-discretionary intermediary execution of derivative trades via a rule based system that operated under direct human supervision. This service does not constitute portfolio management or discretionary investment management. The system does not make independant investment decisions and operates strictly according to predefined parameters selected by the client</p>
    <p>Trading carries risk. You are fully responsible for your capital invested and decision to utilise the system to execute trades.</p>
    <p>You understand that the capital you invest in trading to utilise this system with, can be lost in full, and you agree to only risk capital you are comfortable with loosing, and Bankroll FX and its representatives will not be held liable trading losses arising from market risk or client-selected parameters, subject to the applicable law, as defined in our Terms & Conditions. Nothing in this clause nor our Terms and Conditions excludes liability arising from fraud, wilful misconduct or gross negligence.</p>
    <p>Client data is processed in accordance with applicable data protection legislation and retained for regulatory compliance purposes.</p>

    <hr/>

    <p>Welcome to Bankroll. After completing these short steps you will have access to the tools and systems.</p>
    <p><strong> Bankroll FX</strong></p>

    <hr style="border:0;border-top:1px solid #333;margin:30px 0;"/> 
    
    <h3 style="color:#ffffff;">Required Onboarding Documents</h3> 
    <p style="color:#cccccc;"> 
    Please download, complete and sign the following documents before system activation: 
    </p> 
    
    <p style="margin:20px 0;"> 
    <a href="https://bankrollfx.com/docs/intermediary-mandate.pdf"  
    target="_blank" 
    style="display:inline-block; 
    padding:14px 24px; 
    background-color:#00b248; 
    color:#ffffff; 
    text-decoration:none; 
    font-weight:600; 
    border-radius:8px; 
    font-size:16px;"> 
    Download Intermediary Mandate 
    </a> 
    </p> 
    
    <p style="margin:20px 0;"> 
    <a href="https://bankrollfx.com/docs/risk-declaration.pdf"  
    target="_blank" 
    style="display:inline-block; 
    padding:14px 24px; 
    background-color:#00b248; 
    color:#ffffff; 
    text-decoration:none; 
    font-weight:600; 
    border-radius:8px; 
    font-size:16px;"> 
    Download Risk Declaration 
    </a> 
    </p>
    
    <p style="color:#cccccc;">
    Once completed, reply to this email with the signed documents attached.
    Activation will proceed once parameters are confirmed.
    </p>

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
            subject: `Payment Received - Welcome to Bankroll ${packageType} Activated`,
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
