exports.handler = async (event) => {
    try {
        console.log("RAW EVENT BODY:", event.body);

        const body = JSON.parse(event.body);
        console.log("PARSED BODY:", body);
        
        //Adjust this depending on your payment provider structure
        const paymentId = body.payload?.metadata?.checkoutId;
        const paymentStatus = body.payload?.status; // "succeeded", "failed", "pending".

        if (!paymentId) {
            return {
                statusCode: 400,
                body: "Missing payment ID",
            };
        }

        //Update Airtable
        await updateAirtable(paymentId, paymentStatus);

        //Only send email if payment succeeded
        if (paymentStatus === "succeeded") {

            const customerEmail = body.payload?.customer?.email;
            const customerName = body.payload?.customer?.name;

            if (customerEmail) {
                await fetch(`/.netlify/functions/send-confirmation`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                    email: customerEmail,
                    name: customerName
                })
            });
        }
    }
        return {
            statusCode: 200,
            body: "Webhook received",
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: error.message,
        };
    }
};

    async function updateAirtable(paymentId,paymentStatus) {

        const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
        const BASE_ID = process.env.AIRTABLE_BASE_ID;
        const TABLE_NAME = "Payments"; // <-- CHANGE THIS TO ACTUAL TABLE NAME

        // 1. Find record by Payment ID
        const formula = encodeURIComponent(`{Payment ID}='${paymentId}'`);

        const findResponse = await fetch(
            `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}?filterByFormula=${formula}`,
            {
                headers: {
                    Authorization: `Bearer ${AIRTABLE_API_KEY}`,
                },
            }
        );

        const findData = await findResponse.json();

        if (!findData.records.length) return;

        const recordId = findData.records[0].id;

        //2. Update Payment Status
        await fetch(
            `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}/${recordId}`,
            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${AIRTABLE_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fields: {
                        "Payment Status":
                        paymentStatus === "succeeded"
                        ? "succeeded"
                        : paymentStatus === "pending"
                        ? "pending"
                        : "failed",
                    },
                }),
            }
        );
    }
