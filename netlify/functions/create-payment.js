const fetch = globalThis.fetch;

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME;

async function saveToAirtable(record) {
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`;

    const res = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${AIRTABLE_API_KEY}`,
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
                records: [{ fields: record }],
            }),
        });
        
        if (!res.ok) {
            const text = await res.text();
            console.error("Airtable error:", text);
            throw new Error(text);
        }
    }

export async function handler(event) {
    try {
        const { amount, email, name } = JSON.parse(event.body);

        if (!amount || amount < 20) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Invalid amount" }),
                };
                }

                const YOCO_SECRET_KEY = process.env.YOCO_SECRET_KEY;
                if (!YOCO_SECRET_KEY) {
                    throw new Error("YOCO_SECRET_KEY is missing");
                    }

                    const response = await fetch("https://payments.yoco.com/api/checkouts", {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${YOCO_SECRET_KEY}`,
                            "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                amount: amount *100, //cents
                                currency: "ZAR",
                                successUrl: "https://bankrollfx.com/success.html",
                                cancelUrl: "https://bankrollfx.com",
                                customer: {
                                    email,
                                    name,
                                    },
                                    metadata: {
                                        source: "BankrollFX Website",
                                    },
                                }),
                            });

                            const data = await response.json();

                            await saveToAirtable({
                                "Full Name": name,
                                "Email": email,
                                "Telegram / WhatsApp": "",
                                "Package": "Lifetime Access",
                                "Amount (ZAR)": amount,
                                "Payment ID": data.id,
                                "Payment Status": "pending",
                                "Created at": new Date().toISOString(),
                                "Next Billing Date": null,
                                "Source": "Landing Page",
                                });

                            return {
                                statusCode: 200,
                                body: JSON.stringify({ checkoutUrl: data.redirectUrl }),
                                };
                                } catch (err) {
                                    return {
                                        statusCode: 500,
                                        body: JSON.stringify({ error: err.message }),
                                        };
                                        }
                                        }



                            
                    