import React from 'react'
import { getCookie } from "cookies-next"
import Head from 'next/head'
import Login from '@/components/Login'
import { useEffect, useState } from 'react';
import useStateContext from '@/context/ContextProvider';
import styles from "@/styles/Home.module.css";
import { useRouter } from 'next/router';


const login = () => {
    const { handle_get_app_settings } = useStateContext();
    const [app_settings, set_app_settings] = useState(null);

    const router = useRouter();

    useEffect(() => {
        if (router.isReady) {
            handle_get_app_settings(router.query.app_id, set_app_settings);
        }
    }, [router.isReady]);
    return (
        <div className={`${styles.scrollBar}`} >
            <Head>
                <title>{app_settings && app_settings.app_name} - Login</title>
                <meta name="description" content={`${app_settings && app_settings.app_name} - Login`} />
                <link rel="icon" href="/images/icon_logo.png" />
            </Head>
            <Login app_settings={app_settings} />
        </div>
    )
}

export default login




export const getServerSideProps = async function ({ req, res }) {
    const user = getCookie("user_account", { req, res });
    // console.log(req.url)
    if (user) {
        return {
            redirect: {
                destination: `/home/${req.url.split("/").at(-1)}`,
                permanent: true,
            },
        }
    }
    return { props: { message: "not signed up!", } }
}