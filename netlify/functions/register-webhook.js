exports.handler = async () => {
    try {
        const response = await fetch("https://payments.yoco.com/api/webhooks", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.YOCO_SECRET_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: "bankrollfx-webhook",
                url: "https://bankrollfx.com/.netlify/functions/yoco-webhook",
            }),
        });

        const data = await response.json();

        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: error.message,
        };
    }
};