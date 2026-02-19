import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const handler = async (event) => {
    try {
        const { email, name } = JSON.parse(event.body);

        await resend.emails.send({
            from: 'Bankroll FX Education <info@bankrollfx.com>',
            to: email,
            subject: 'Payment Received - Welcome to Bankroll',
            html: `
            <h2>Welcome ${name || ''}</h2>
            <p>Your payment has been received successfully.</p>
            <p>You now have access to the trading system.</p>
            `,
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};