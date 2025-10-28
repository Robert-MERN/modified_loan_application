import connectMongo from "@/utils/functions/connectMongo"
import Settings from "@/models/settingsModel";
import Myloans from "@/models/myloansModel";

/**
 * 
 * @param {import('next').NextApiRequest} req 
 * @param {import('next').NextApiResponse} res 
 */



export default async function handler(req, res) {
    try {

        const { id } = req.query;
        await connectMongo();

        await Settings.findByIdAndDelete(id);

        const all_loans = await Myloans.find({ customer_id: id });

        if (all_loans.length) {
            await Promise.all(
                all_loans.map((each) => {
                    return Myloans.findByIdAndDelete(each._id);
                })
            );
        }

        return res.status(200).json({ status: true, message: "Customer is deleted!" });


    } catch (err) {
        const net_err_msg = "querySrv ENODATA _mongodb._tcp.application.bjwgp.mongodb.net"
        const no_internet = "querySrv ETIMEOUT _mongodb._tcp.application.bjwgp.mongodb.net"
        const slow_internet = "Operation `settings.findOne()` buffering timed out after"
        if (err.message.includes(net_err_msg)) {
            return res.status(501).json({ status: false, message: "No Internet Connection!" });

        } else if (err.message.includes(slow_internet)) {
            return res.status(501).json({ status: false, message: "Unstable Network!" });

        } else if (err.message.includes(no_internet)) {
            return res.status(501).json({ status: false, message: "No Internet!" });

        } else {
            return res.status(501).json({ status: false, message: err.message });

        }
    }
};