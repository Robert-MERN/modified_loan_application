import connectMongo from "@/utils/functions/connectMongo"
import Settings from "@/models/settingsModel";

/**
 * 
 * @param {import('next').NextApiRequest} req 
 * @param {import('next').NextApiResponse} res 
 */

export default async function handler(req, res) {
    try {

        await connectMongo();

        const { id } = req.query;
        const setting = await Settings.findById(id);

        
        if (setting) {
            await Settings.findByIdAndUpdate(id, req.body);
        }

        return res.status(200).json({ status: true, message: "App settings are updated" });

    } catch (err) {
        const net_err_msg = "querySrv ENODATA _mongodb._tcp.application.bjwgp.mongodb.net"
        const slow_internet = "Operation `settings.findOne()` buffering timed out after 10000ms"
        if (err.message === net_err_msg) {
            return res.status(501).json({ status: false, message: "No Internet Connection!" });

        } else if (err.message === slow_internet) {
            return res.status(501).json({ status: false, message: "Unstable Network!" });
        } else {
            return res.status(501).json({ status: false, message: err.message });

        }
    }
}

