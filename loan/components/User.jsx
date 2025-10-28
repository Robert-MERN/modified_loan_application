import React, { useState, useEffect } from 'react'
import Footer from './utilities/Footer'
import Navbar from './utilities/Navbar'
import useStateContext from '@/context/ContextProvider';
import Image from 'next/image';
import user_pic from "@/public/images/user_pic.png"
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { MdOutlineVerifiedUser } from "react-icons/md";
import { useRouter } from 'next/router';


const User = ({ app_settings }) => {
    const { setAPIloading, openModal } = useStateContext();


    const options = [
        {
            option: "Edit new information",
            link: "/support",
        },
        {
            option: "My downloads",
            link: "/support",
        },
        {
            option: "Privacy policy",
            link: "/support",
        },
        {
            option: "Contact us",
            link: "/support",
        },
        {
            option: "Settings",
            link: "logout",
        },
    ]
    const router = useRouter();

    const handle_options = (link) => {
        
        const appId = router.query.app_id;
        if (!appId) return;

        setAPIloading(true);
        setTimeout(() => {
            if (link === "logout") {
                openModal("logout_modal")
                setAPIloading(false);
            } else {
                router.push(`${link}/${router.query.app_id}`)
            }
        }, 500)

    }




    return (
        <div className='w-screen relative bg-stone-900' >
            <Navbar back_btn={false} app_settings={app_settings} />

            <div>
                <div className='w-screen relative bg-emerald-400 mt-[52px] px-[15px] h-[50px]' >

                    <div className='absolute w-full flex justify-center left-0 right-0 top-[10px] px-[20px]' >
                        <div className='h-[100px] bg-white w-full rounded-2xl p-[20px] flex gap-4' >
                            <div className='w-[60px] h-[60px] rounded-full bg-emerald-400 pt-[3px] overflow-hidden' >

                                <Image src={user_pic} className='object-contain scale-[0.9]' alt="user_profile" />
                            </div>

                            <div>
                                <p className='font-bold text-[18px] text-stone-700' >{app_settings && app_settings.user_name || "Nice name"}</p>


                                <p className='font-bold text-[13px] text-stone-500' >
                                    {app_settings && app_settings.pan_card}
                                </p>

                                {/* <a target='__blank' href={`https://wa.me/91${app_settings ? app_settings.phone_number : ""}`} className='font-semibold text-[16px] text-stone-500 underline' >
                                    91{app_settings && app_settings.phone_number}
                                </a> */}

                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <div className='min-h-[calc(100vh-200px)] w-full mt-[90px] flex flex-col justify-between' >
                <div className='w-full flex flex-col' >

                    {options.map((e, index) => (
                        <button onClick={() => handle_options(e.link)} key={index} className='w-full px-[20px] py-[14px] flex justify-between active:bg-stone-800 transition-all' >
                            <p className='text-stone-500 font-bold text-[14px] select-none cursor-pointer' >
                                {e.option}
                            </p>
                            <ArrowForwardIosIcon className='text-stone-300 scale-[.75]' />
                        </button>
                    ))}

                </div>

                <div className='w-full px-[20px] py-[15px] flex gap-3 mt-4 mb-[106px]' >
                    <MdOutlineVerifiedUser className='text-emerald-400 scale-[1.6]' />
                    <p className='text-stone-300 lead leading-[14px] font-medium text-[11px] select-none' >
                        The platform promises to protect your data security and will not spread your personal information
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default User