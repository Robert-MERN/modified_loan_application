import React from 'react'
import HomePage from '@/components/Home_page'
import Head from 'next/head'
import { useEffect, useState } from 'react';
import useStateContext from '@/context/ContextProvider';
import styles from "@/styles/Home.module.css";
import { getCookie } from "cookies-next"
import { useRouter } from 'next/router';

const index = () => {
    const { handle_get_app_settings, set_footer_tab, handle_get_myloans, all_myloans } = useStateContext();
    const [app_settings, set_app_settings] = useState(null);


    const router = useRouter();

    useEffect(() => {
        set_footer_tab("/")
        if (router.isReady) {
            handle_get_app_settings(router.query.app_id, set_app_settings);
            handle_get_myloans(router.query.app_id);
        }
    }, [router.isReady]);

    return (
        <div className={`bg-emerald-400  ${styles.scrollBar}`} >
            <Head>
                <title>Home - {app_settings && app_settings.app_name}</title>
                <meta name="description" content={`${app_settings && app_settings.app_name} - `} />
                <link rel="icon" href="/images/icon_logo.png" />
            </Head>
            <HomePage app_settings={app_settings} myloans={all_myloans} />
        </div>
    )
}

export default index


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