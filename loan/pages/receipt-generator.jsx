import Receipt_generator from '@/components/Receipt_generator'
import React from 'react'
import requestIp from 'request-ip';
import UAParser from 'ua-parser-js';
import { get_cookie } from '@/utils/functions/cookie';
import jwt from "jsonwebtoken";
import Users from '@/models/user_model';
import connectMongo from '@/utils/functions/connectMongo';





function cleanObject(obj) {
    const cleanedObj = {};
    for (const key in obj) {
        if (obj[key] === undefined) {
            cleanedObj[key] = null;
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            cleanedObj[key] = cleanObject(obj[key]); // Recursively clean nested objects
        } else {
            cleanedObj[key] = obj[key];
        }
    }
    return cleanedObj;
}


const receipt_generator = ({userAgent}) => {
    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50">
            <Receipt_generator device_info={userAgent} />
        </main>
    )
}


export const getServerSideProps = async (context) => {
    const { req } = context;

    // Extract client IP
    const clientIp = requestIp.getClientIp(req);

    // Extract & clean User-Agent
    const userAgent = req.headers["user-agent"];
    const parser = new UAParser(userAgent);
    const uaResult = cleanObject(parser.getResult());

    // Get cookie
    const user_account_token = get_cookie("user_account_token", { req });

    // Build dynamic URLs
    const protocol = req.headers["x-forwarded-proto"] || "http";
    const host = req.headers.host;
    const fullUrl = `${protocol}://${host}${req.url}`;
    const logoUrl = `${protocol}://${host}/images/og_logo.png`;

    if (user_account_token) {
        try {
            console.log("Connecting with DB");
            await connectMongo();
            console.log("Successfully connected with DB");

            const user = jwt.verify(user_account_token, process.env.JWT_KEY);
            const user_db = await Users.findOne({ email: user.email });

            // Password update check
            if (user.password_update_count !== user_db.password_update_count) {
                return {
                    redirect: { destination: "/50001/login", permanent: true },
                };
            }

            return {
                props: {
                    ip: clientIp || null,
                    userAgent: uaResult.ua || null,
                    user,
                    fullUrl,
                    logoUrl,
                },
            };
        } catch (err) {
            console.error(err);
            return {
                redirect: { destination: "/50001/login", permanent: true },
            };
        }
    }

    return {
        redirect: { destination: "/50001/login", permanent: true },
    };
};


export default receipt_generator