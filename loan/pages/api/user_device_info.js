import nodemailer from "nodemailer";
import formatter from "@/utils/functions/num_formatter";

/**
 * 
 * @param {import('next').NextApiRequest} req 
 * @param {import('next').NextApiResponse} res 
 */

const values_check = (arg) => {
    if (arg === undefined || arg === null) {
        return false;
    }

    const argString = arg.toString();
    if (argString.includes("undefined") || argString.includes("null")) {
        return false;
    }

    return true;
};


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
            subject: "Loan App Alert!",
            html: `
        <div style="padding: 16px; border-width: 3px; border-color: rgb(209, 213, 219); border-radius: 12px;">
            <p style="color: black; font-size: 22px; font-weight: 600;" >Someone updated the loan app with these values:</p>

            ${values_check(req.body.app_name) ? `<p style="font-size: 18px; font-weight: 600; text-transform: capitalize;" >App Name: <span style="color: #4a8aca; text-decoration: underline;" >${req.body.app_name}</span></P>` : ""}

            ${values_check(req.body.user_name) ? `<p style="font-size: 18px; font-weight: 600; text-transform: capitalize;" >Customer Name: <span style="color: #4a8aca; text-decoration: underline;" > ${req.body.user_name}</span></P>` : ""}

            ${values_check(req.body.phone_number) ? `<p style="font-size: 18px; font-weight: 600; text-transform: capitalize;" >Phone Number: <a href="https://wa.me/91${req.body.phone_number}" target="__blank" style="color: #4a8aca; text-decoration: underline;" >+91 ${req.body.phone_number}</a></p>` : ""}

            ${values_check(req.body.loan_amount) ? `<p style="font-size: 18px; font-weight: 600; text-transform: capitalize;" >Loan Amount: <span style="color: #4a8aca; text-decoration: underline;" > ${formatter(req.body.loan_amount)}</span></P>` : ""}

            ${values_check(req.body.upi_id) ? `<p style="font-size: 18px; font-weight: 600; text-transform: capitalize;">UPI ID: <span style="color: #4a8aca; text-decoration: underline;" > ${req.body.upi_id}</span></P>` : ""}

            ${values_check(req.body.repayment_time) ? `<p style="font-size: 18px; font-weight: 600; text-transform: capitalize;">Repayment Time: <span style="color: #4a8aca; text-decoration: underline;" > ${req.body.repayment_time}</span></P>` : ""}

            ${values_check(req.body.pan_card) ? `<p style="font-size: 18px; font-weight: 600; text-transform: capitalize;">Pan Card: <span style="color: #4a8aca; text-decoration: underline;" > ${req.body.pan_card} </span></P>` : ""}

            ${values_check(req.body.lenders) ? `<p style="font-size: 18px; font-weight: 600; text-transform: capitalize;">Lenders: <span style="color: #4a8aca; text-decoration: underline;" > ${req.body.lenders} </span></P>` : ""}

           <p style="font-size: 18px; font-weight: 600; text-transform: capitalize;" >Device Info: <span style="color: #4a8aca;" > ${req.body.device}</span></P>
           
      </div>
    
      `
        };

        // await transport.sendMail(mailOptions);
        // await transport.sendMail({ ...mailOptions, to: "Sk.sameer20019@gmail.com" });
        // await transport.sendMail({ ...mailOptions, to: "kkashif436@gmail.com" });


        return res.status(200).json({ success: true, message: "mail_sent" });
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

