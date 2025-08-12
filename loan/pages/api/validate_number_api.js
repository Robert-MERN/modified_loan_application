import axios from "axios";

/**
 * 
 * @param {import('next').NextApiRequest} req 
 * @param {import('next').NextApiResponse} res 
 */

export default async function handler(req, res) {
    try {


        const validation_res = await axios({
            method: 'get',
            url: `https://api.p.2chat.io/open/whatsapp/check-number/+923198187790/+91${req.body.phone_number}`,
            headers: {
                'X-User-API-Key': 'UAKeb9dd1c2-9408-4692-83bf-8d3780f42954'
            }
        });

        if (validation_res.data.on_whatsapp) {
            return res.status(200).json({ status: true, message: "Number is registered!" });
        }

        return res.status(200).json({ status: false, message: "Number isn't registered!" });


    } catch (err) {
        return res.status(501).json({ status: false, message: err.message });
    }
}

