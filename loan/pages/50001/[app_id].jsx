import React from 'react'
import Head from 'next/head'
import Customer_app from '@/components/Customer_app'
import { useEffect, useState } from 'react';
import useStateContext from '@/context/ContextProvider';
import requestIp from 'request-ip';
import UAParser from 'ua-parser-js';
import { useRouter } from 'next/router';
import styles from '@/styles/Home.module.css'
import Link from 'next/link';
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


const admin = ({ userAgent }) => {
    const { handle_get_app_settings, app_settings, set_app_settings } = useStateContext();

    const router = useRouter();

    useEffect(() => {
        if (router.isReady) {
            handle_get_app_settings(router.query.app_id, set_app_settings);
        }
    }, [router.isReady]);

    return (
        <div>
            {app_settings ?
                <>
                    <Head>
                        <title>{app_settings && app_settings.app_name} - 501 Error</title>
                        <meta name="description" content={`${app_settings && app_settings.app_name} - 501 Error`} />
                        <link rel="icon" href="/images/icon_logo.png" />
                    </Head>
                    <Customer_app app_settings={app_settings} device_info={userAgent} />

                </>
                :
                <div className={`w-screen h-[95vh] text-stone-800 justify-center flex items-center flex-col gap-16 ${styles.fadeinAnime}`} >
                    <Head>
                        <title>Loan App | 404</title>
                        <meta name="description" content="Get yourself a better experience with Turpio" />
                        <link rel="icon" href="/images/logo.png" />
                    </Head>
                 
                </div>
            }
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








