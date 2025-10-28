import React from 'react'
import Head from 'next/head'
import User from '@/components/User'
import { useEffect, useState } from 'react';
import useStateContext from '@/context/ContextProvider';
import { useRouter } from 'next/router';
import { getCookie } from 'cookies-next';



const user = () => {
    const { handle_get_app_settings, set_footer_tab } = useStateContext();
    const [app_settings, set_app_settings] = useState(null);

    const router = useRouter();

    useEffect(() => {
        if (router.isReady) {
            if (router.query.app_id) {
                set_footer_tab(`/user/${router.query.app_id}`)
                handle_get_app_settings(router.query.app_id, set_app_settings);
            }
        }
    }, [router.isReady, router.query.app_id]);

    return (
        <div>
            <Head>
                <title>{app_settings && app_settings.app_name} - My Loans</title>
                <meta name="description" content={`${app_settings && app_settings.app_name} - My Loans`} />
                <link rel="icon" href="/images/icon_logo.png" />
            </Head>
            <User app_settings={app_settings} />
        </div>
    )
}

export default user


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








