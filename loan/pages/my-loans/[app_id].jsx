import React from 'react'
import Head from 'next/head'
import My_loans from '@/components/My_loans'
import { useEffect, useState } from 'react';
import useStateContext from '@/context/ContextProvider';
import styles from "@/styles/Home.module.css";
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/router';

const my_loan = () => {
    const { handle_get_app_settings, set_footer_tab, handle_get_myloans, all_myloans } = useStateContext();
    const [app_settings, set_app_settings] = useState(null);



    const router = useRouter();

    useEffect(() => {
        if (router.isReady) {
            if (router.query.app_id) {
                set_footer_tab(`/my-loans/${router.query.app_id}`)
                handle_get_app_settings(router.query.app_id, set_app_settings);
                handle_get_myloans(router.query.app_id);
            }
        }
    }, [router.isReady, router.query.app_id]);
    return (
        <div className={`${styles.scrollBar}`} >
            <Head>
                <title>{app_settings && app_settings.app_name} - My Loans</title>
                <meta name="description" content={`${app_settings && app_settings.app_name} - My Loans`} />
                <link rel="icon" href="/images/icon_logo.png" />
            </Head>
            <My_loans app_settings={app_settings} myloans={all_myloans} />
        </div>
    )
}

export default my_loan

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