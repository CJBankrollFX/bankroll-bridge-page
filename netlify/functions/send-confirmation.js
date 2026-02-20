const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

/* ---Button Stling Must be above  template function --- */
const buttonStyle = `
display:inline-block;
padding:12px 20px;
margin:10px 0;
background-color:#000;
color:#fff;
text-decoration:none;
border-radius:6px;
font-weight:bold;
`;

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
    <a href="https://pay.yoco.com/r/m05yLK" style="${buttonStyle}>
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

    <h3>Step 3 - Fund Your Space Markets Account</h3>
    <p>Minimum R1500 required. R3000+ recommended.</p>

    <hr/>

    <h3>Step 4 - Contact Admin To Link Your Account to the System</h3>
    <a href="https://t.me/Bankroll_Forex_Admin" style="${buttonStyle}">
    Contact Admin on Telegram
    </a>

    <p>Send Admin:</p>
    <ul>
    <li>Your Space Markets account number</li>
    <li>Your MetaTrader auto-generated passcode sent via Space Markets to your email</li>
    </ul>

    <p><strong>Important:</strong> These credentials only allow MetaTrader 5 terminal access. We have no access to your funds.</p>

    ${renewalSection}

    <hr/>

    <h3>Important Disclaimer</h3>
    <p>By completing your purchase, you confirmed acceptance of our Terms & Conditions.</p>
    <p>This service is provided strictly for educational purposes as a tool to assist you when trading, to learn and understand the markets.</p>
    <p>Trading carries risk. You are fully responsible for your capital invested and decision to utilise the system to execute trades.</p>
    <p>You understand that the capital you invest in trading to utilise this system with, can be lost, and you agree to only risk capital you are comfortable with loosing, and Bankroll FX and its parties are not and never will be held liable for any losses incurred whatsoever.</p>

    <hr/>

    <p>Welcome to Bankroll.</p>
    <p><strong> Bankroll FX</strong></p>

    </div>
    `;
}

/* ----- Netlify Handler ----- */
exports.handler = async (event) => {
    try {
        const { email, name, packageType } = JSON.parse(event.body);

        console.log("Sending email to:", email);

        await resend.emails.send({
            from: "Bankroll FX Education <info@bankrollfx.com>",
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
