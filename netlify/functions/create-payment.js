const fetch = globalThis.fetch;

exports.handler = async (event) => {
    try {
        const { amount, email, name } = JSON.parse(event.body);

        if (!amount || amount < 200) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Invalid amount" }),
                };
                }

                const YOCO_SECRET_KEY = process.env.YOCO_SECRET_KEY;

                if (!YOCO_SECRET_KEY) {
                    throw new Error("YOCO_SECRET_KEY is missing");
                    }

                    const response = await fetch("https://online.yoco.com/v1/charges/", {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${YOCO_SECRET_KEY}`,
                            "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                amount: amount *100, //cents
                                currency: "ZAR",
                                metadata: {
                                    customer_name: name,
                                    customer_email: email,
                                    source: "BankrollFX Website",
                                    },
                                }),
                            });

                            const data = await response.json();

                            return {
                                statusCode: 200,
                                body: JSON.stringify(data),
                                };

                                } catch (err) {
                                    return {
                                        statusCode: 500,
                                        body: JSON.stringify({ error: err.message }),
                                        };
                                        }
                                        };



                            
                    