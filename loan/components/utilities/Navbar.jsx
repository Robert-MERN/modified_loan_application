import React, { useState, useEffect } from 'react'
import useStateContext from '@/context/ContextProvider';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useRouter } from 'next/router';
import LogoutIcon from '@mui/icons-material/Logout';




const Navbar = ({ back_btn, disable_headset, admin, app_settings }) => {
  const { openModal, show_navbar_BG, setAPIloading } = useStateContext();
  const router = useRouter();

  const push = (link) => {
    
    const appId = router.query.app_id;
    if (!appId) return;

    setAPIloading(true);
    setTimeout(() => {
      if (link) {
        router.push(link);
        setAPIloading(false);
      } else {
        router.back();
        setAPIloading(false);
      }
    }, 500);
  }


  return (
    <div className='fixed left-0 top-0 right-0 bg-emerald-400 z-50' >
      <div className={`p-[15px] w-screen h-[52px]`} >
        <nav className='w-full flex justify-center items-center relative' >

          {back_btn &&
            <ArrowBackIosNewIcon onClick={() => push()} className='text-white absolute left-0 top-0 active:opacity-60 transition-all cursor-pointer' />
          }

          <button onClick={() => admin ? push("/50001") : push(`/home/${router.query.app_id}`)} className='font-bold text-[15px] text-white text-center select-none capitalize' >
            {admin ? "Admin" : app_settings && app_settings.app_name}
          </button>


          {!disable_headset &&
            <div onClick={() => push(`/support/${router.query.app_id}`)} >
              <HeadsetMicIcon className='text-white absolute right-0 top-0 active:opacity-60 transition-all cursor-pointer' />
            </div>
          }


          {admin &&
            <div onClick={() => openModal("logout_modal")} >
              <LogoutIcon className='text-white absolute right-0 top-0 active:opacity-60 transition-all cursor-pointer' />
            </div>
          }

        </nav>
      </div>
    </div >

  )
}

export default Navbar