import React from 'react'
import Head from 'next/head'
import Borrow_history from '@/components/Borrow_history'
import { useEffect, useState } from 'react';
import useStateContext from '@/context/ContextProvider';
import styles from "@/styles/Home.module.css";
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/router';

const borrow = () => {
    const { handle_get_app_settings, handle_get_myloans, all_myloans } = useStateContext();
    const [app_settings, set_app_settings] = useState(null);

    const router = useRouter();

    useEffect(() => {
        if (router.isReady) {
            handle_get_app_settings(router.query.app_id, set_app_settings);
            handle_get_myloans(router.query.app_id);
        }
    }, [router.isReady]);

    return (
        <div className={`${styles.scrollBar}`} >
            <Head>
                <title>{app_settings && app_settings.app_name} - Borrow History</title>
                <meta name="description" content={`${app_settings && app_settings.app_name} - Borrow History`} />
                <link rel="icon" href="/images/icon_logo.png" />
            </Head>
            <Borrow_history app_settings={app_settings} myloans={all_myloans} />
        </div>
    )
}

export default borrow


export const getServerSideProps = async function ({ req, res }) {
    const user = getCookie("user_account", { req, res });
    if (!user) {
        return {
            redirect: {
                destination: `/login/${req.url.split("/").at(-1)}`,
                permanent: true,
            },
        }
    }
    return { props: { message: "logged in!" } }
}






