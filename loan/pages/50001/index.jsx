import React from 'react'
import Head from 'next/head'
import Admin from '@/components/Admin'
import { useEffect, useState } from 'react';
import useStateContext from '@/context/ContextProvider';
import requestIp from 'request-ip';
import UAParser from 'ua-parser-js';
import { get_cookie } from '@/utils/functions/cookie';
import jwt from "jsonwebtoken";
import Users from '@/models/user_model';
import connectMongo from '@/utils/functions/connectMongo';
import axios from 'axios';


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


const admin = ({ userAgent }) => {
    const { handle_get_all_app_settings, all_app_settings, set_all_app_settings, all_app_settings_db_details, set_all_app_settings_db_details } = useStateContext();

    const [is_loading, set_is_loading] = useState(true);

    // useEffect(() => {
    //     handle_get_all_app_settings(set_all_app_settings, set_is_loading, set_all_app_settings_db_details);
    // }, []);

    return (
        <div>
            <Head>
                <title>Admin - 501 Error</title>
                <meta name="description" content={`Admin - 501 Error`} />
                <link rel="icon" href="/images/icon_logo.png" />
            </Head>
            <Admin app_settings={all_app_settings} app_settings_db_details={all_app_settings_db_details} set_is_loading={set_is_loading} is_loading={is_loading} device_info={userAgent} axios={axios} />
        </div>
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


export default admin








