import React from 'react'
import Admin_login from '@/components/Admin_login'
import Head from 'next/head'
import axios from 'axios'
import { get_cookie } from '@/utils/functions/cookie';
import jwt from "jsonwebtoken";
import Users from '@/models/user_model';
import connectMongo from '@/utils/functions/connectMongo';


const login = () => {
    return (
        <div className={`w-screen bg-slate-100 lg:bg-[#1F2822] h-fit relative`} >
            <Head>
                <title>Admin - Login</title>
                <meta property="og:title" content="Admin | Login" />
                <meta property="og:description" content="Login Page" />
                <link rel="icon" href="/images/icon_logo.png" />
            </Head>
            <Admin_login axios={axios} />
        </div>
    )
}

export default login


export const getServerSideProps = async ({ req, res }) => {

    const user_account_token = get_cookie("user_account_token", { req });

    if (user_account_token) {
        console.log("Connecting with DB")
        try {
            // connecting with monogDB
            await connectMongo();
            console.log("Successfuly conneted with DB");

            const user = jwt.verify(user_account_token, process.env.JWT_KEY);
            const user_db = await Users.findOne({ email: user.email });

            if (user.password_update_count === user_db.password_update_count) {
                return {
                    redirect: {
                        destination: "/50001",
                        permanent: true,
                    }
                }
            }
        }
        catch (err) {
            console.error(err);
        }
    }


    const protocol = req.headers["x-forwarded-proto"] || "http"; // Detect HTTP or HTTPS
    const host = req.headers.host; // Get the domain (localhost:3000 or production domain)
    const fullUrl = `${protocol}://${host}${req.url}`; // Fully dynamic URL
    const logoUrl = `${protocol}://${host}/images/og_logo.png`; // Fully dynamic URL

    return { props: { message: "Not signed in", fullUrl, logoUrl } }
}