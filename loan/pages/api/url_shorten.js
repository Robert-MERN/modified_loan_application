import axios from "axios";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ success: false, message: "Method not allowed" });
    }

    try {
        const { url } = req.body;

        if (!url || !url.startsWith("http")) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid URL starting with http or https",
            });
        }

        const response = await axios.post(
            "https://cleanuri.com/api/v1/shorten",
            new URLSearchParams({ url }).toString(),
            {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            }
        );

        return res.status(200).json(response.data.result_url);

    } catch (err) {
        console.error("Shorten error:", err.response?.data || err.message);
        return res.status(500).json({
            success: false,
            message: err.response?.data?.error || err.message,
        });
    }
}
