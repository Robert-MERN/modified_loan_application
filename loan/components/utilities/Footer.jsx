import React, { useState } from 'react'
import { LuHome } from "react-icons/lu";
import { CgNotes } from "react-icons/cg";
import { PiUserListBold } from "react-icons/pi";
import Link from 'next/link';
import useStateContext from '@/context/ContextProvider';
import { useRouter } from 'next/router';

const Footer = () => {

  const { footer_tab, set_footer_tab, setAPIloading } = useStateContext();

  const router = useRouter();

  const select_footer_tab = (val) => {
    const appId = router.query.app_id;
    if (!appId) return;

    setAPIloading(true);
    setTimeout(() => {
      router.push(val);
      set_footer_tab(val);
      setAPIloading(false);
    }, 600)
  }

  return (
    <footer className='w-screen fixed bottom-0 left-0 right-0 bg-white flex items-center justify-between px-[30px] pt-[10px] pb-[5px] border-t border-stone-200 z-50' >


      <div onClick={() => select_footer_tab(`/home/${router.query.app_id}`)} className='flex flex-col items-center gap-1 active:opacity-60 transition-all cursor-pointer' >
        <LuHome className={`${footer_tab.includes(`/home`) ? "text-emerald-400" : "text-zinc-400"} scale-[1.2]`} />
        <p className={`${footer_tab.includes(`/home`) ? "text-emerald-400" : "text-stone-600"} text-[11px] font-semibold select-none`} >Home</p>
      </div>



      <div onClick={() => select_footer_tab(`/my-loans/${router.query.app_id}`)} className='flex flex-col items-center gap-1 active:opacity-60 transition-all cursor-pointer' >
        <CgNotes className={`${footer_tab.includes(`/my-loans`) ? "text-emerald-400" : "text-zinc-400"} scale-[1.2]`} />
        <p className={`${footer_tab.includes(`/my-loans`) ? "text-emerald-400" : "text-stone-600"} text-[11px] font-semibold select-none`} >My Loans</p>
      </div>




      <div onClick={() => select_footer_tab(`/user/${router.query.app_id}`)} className='flex flex-col items-center gap-1 active:opacity-60 transition-all cursor-pointer' >
        <PiUserListBold className={`${footer_tab.includes(`/user`) ? "text-emerald-400" : "text-zinc-400"} scale-[1.4]`} />
        <p className={`${footer_tab.includes(`/user`) ? "text-emerald-400" : "text-stone-600"} text-[11px] font-semibold select-none`} >User</p>
      </div>


    </footer>

  )
}

export default Footer