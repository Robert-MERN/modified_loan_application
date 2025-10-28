import nodemailer from "nodemailer";
import formatter from "@/utils/functions/num_formatter";

/**
 * 
 * @param {import('next').NextApiRequest} req 
 * @param {import('next').NextApiResponse} res 
 */



export default async function handler(req, res) {
    try {
        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: 'rackeragency@gmail.com',
                pass: 'phtspmtkanwfyhkc'
            },
        });
        const mailOptions = {
            from: `Racker Agency <rackeragency@gmail.com>`,
            to: "rackeragency@gmail.com",
            subject: "New User Submitted UTR",
            html: `
        <div style="padding: 16px; border-width: 3px; border-color: rgb(209, 213, 219); border-radius: 12px;">

            <p style="color: black; font-size: 24px; font-weight: 600;" >A new user has just submitted UTR.</p>

            <p style="font-size: 18px; font-weight: 600; text-transform: capitalize;" >App Name: <span style="color: #4a8aca; text-decoration: underline;" > ${req.body.app_name}</span></P>

            <p style="font-size: 18px; font-weight: 600; text-transform: capitalize;" >Customer Name: <span style="color: #4a8aca; text-decoration: underline;" > ${req.body.user_name}</span></P>

            <p  style="font-size: 18px; font-weight: 600; text-transform: capitalize;" >Phone Number: <a href="https://wa.me/91${req.body.phone_number}" target="__blank" style="color: #4a8aca; text-decoration: underline;" >+91 ${req.body.phone_number}</a></p>

            <p style="font-size: 18px; font-weight: 600; text-transform: capitalize;" >Loan Amount: <span style="color: #4a8aca; text-decoration: underline;" > ${formatter(req.body.loan_amount)}</span></P>

            <p style="font-size: 18px; font-weight: 600; text-transform: capitalize;">UPI ID: <span style="color: #4a8aca; text-decoration: underline;" > ${req.body.upi_id}</span></P>

            <p style="font-size: 18px; font-weight: 600; text-transform: capitalize;">Repayment Time: <span style="color: #4a8aca; text-decoration: underline;" > ${req.body.repayment_time}</span></P>

            <p style="font-size: 18px; font-weight: 600; text-transform: capitalize;">Pan Card: <span style="color: #4a8aca; text-decoration: underline;" > ${req.body.pan_card} </span></P>

            <p style="font-size: 18px; font-weight: 600; text-transform: capitalize;">Lenders: <span style="color: #4a8aca;  text-decoration: underline;" > ${req.body.lenders} </span></P>

      </div>
    
      `
        };

        await transport.sendMail(mailOptions);
        await transport.sendMail({ ...mailOptions, to: "Sk.sameer20019@gmail.com" });
        await transport.sendMail({ ...mailOptions, to: "kkashif436@gmail.com" });

        res.status(200).json({ success: true, message: "utr_submitted" });
    } catch (err) {
        const net_err_msg = "querySrv ENODATA _mongodb._tcp.application.bjwgp.mongodb.net"
        const slow_internet = "Operation `settings.findOne()` buffering timed out after"
        if (err.message === net_err_msg) {
            return res.status(501).json({ status: false, message: "No Internet Connection!" });
        } else if (err.message.includes(slow_internet)) {
            return res.status(501).json({ status: false, message: "Unstable Network!" });
        } else {
            return res.status(501).json({ status: false, message: err.message });

        }
    }
}

