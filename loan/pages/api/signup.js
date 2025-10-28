import Users from '@/models/user_model';
import connectMongo from '@/utils/functions/connectMongo';
import cryptojs from "crypto-js";

/**
 * 
 * @param {import('next').NextApiRequest} req 
 * @param {import('next').NextApiResponse} res 
 */

export default async function handler(req, res) {

    console.log("Connecting with DB")
    try {

        // connecting with monogDB
        await connectMongo();
        console.log("Successfuly conneted with DB");


        // collecting information from request body
        const { password, ...other } = req.body;

        // encrypting password
        const encrypted = cryptojs.AES.encrypt(password, process.env.CJS_KEY).toString();

        // saving user in DB
        const user = new Users({
            ...other,
            password: encrypted,
        });
        await user.save();

        // sending success response to user
        return res.status(200).json({ success: true, message: `Admin account has been created` });


    } catch (err) {

        // if server catches any error
        res.status(501).json({ success: false, message: err.message });
    }

}















