import React, { useEffect, useState } from 'react'
import useStateContext from '@/context/ContextProvider';
import rupee_bag from "@/public/images/rupee-bag.png";
import Image from 'next/image';
import rupee_pocket from "@/public/images/rupee-pocket.png"
import Footer from './utilities/Footer';
import Navbar from './utilities/Navbar';
import { useRouter } from 'next/router';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import styles from "@/styles/Home.module.css";
import { Preview } from '@mui/icons-material';

const HomePage = ({ app_settings, myloans }) => {

    const { setAPIloading, openModal, borrow_amount } = useStateContext();

    const router = useRouter();

    const handle_options = (link) => {
        const appId = router.query.app_id;
        if (!appId) return;

        setAPIloading(true);
        setTimeout(() => {
            link && router.push(link)
        }, 1000)

    };

    const [total_spent, set_total_spent] = useState(0);

    useEffect(() => {
        if (myloans.length) {
            const total_spent_amount = myloans.reduce((prev, each) => prev + Number(each.loan_amount), 0);
            set_total_spent(total_spent_amount);
        }

    }, [myloans.length])




    return (
        <div className={`w-screen min-h-screen bg-gradient-to-b from-emerald-400 via-teal-200 to-emerald-50 to-80% px-[15px] relative ${styles.scrollBar}`} >

            <Navbar app_settings={app_settings} />



            <div className={`mt-[52px] ${styles.scrollBar}`}>
                <div className='w-full flex flex-col items-center' >
                    <p className='font-semuibold text-[18px] text-white text-center select-none flex items-center' >
                        Available credit
                    </p>
                    <p onClick={() => openModal("borrow_amount_modal")} className='font-bold text-[32px] text-white text-center mt-2 select-none active:opacity-40 transition-all cursor-pointer' >
                        ₹ {borrow_amount}
                        <ArrowDropDownIcon className='scale-[1.8] ml-2' />
                    </p>
                </div>

                <div className='mt-5 w-full flex' >
                    <div className='flex-1 flex flex-col items-center border-r border-stone-100 gap-2 select-none' >

                        <p className='font-semibold text-[15px] text-white' >Total amount</p>
                        <p className='font-bold text-[18px] text-white' >₹ {borrow_amount}</p>

                    </div>
                    <div className='flex-1 flex flex-col items-center gap-2 select-none' >

                        <p className='font-semibold text-[15px] text-white' >Spent</p>
                        <p className='font-bold text-[18px] text-white' >₹ {total_spent.toLocaleString("en-US")}.00</p>
                    </div>
                </div>

                <div className='w-full px-[40px] flex justify-center mt-12' >
                    <button onClick={() => handle_options(`/borrow/${router.query.app_id}`)} className='w-full bg-white active:opacity-75 transition-all py-[12px] text-[16px] text-teal-500 rounded-full font-bold' >
                        Borrow Now
                    </button>
                </div>

                <div className='w-full bg-white rounded-lg px-[15px] pt-[30px] pb-[35px] mt-8' >
                    <div className='w-full flex gap-4' >


                        <div onClick={() => handle_options(`/borrow/${router.query.app_id}`)} className='px-[10px] py-[25px] bg-orange-100 rounded-lg flex items-center gap-2 w-full active:opacity-60 transition-all cursor-pointer select-none' >

                            <div className='w-[40px] h-[40px] grid place-items-center rounded-full  bg-gradient-to-b from-orange-200  to-orange-400'>
                                <Image src={rupee_bag} alt="Rupee Icon" className='text-white w-[30px]' />
                            </div>
                            <p onClick={() => handle_options(`/borrow/${router.query.app_id}`)} className='w-[60px] text-[12px] font-medium text-stone-800 text-center select-none break-words' >Refinance</p>
                        </div>

                        <div onClick={() => handle_options(`/borrow-history/${router.query.app_id}`)} className='px-[10px] py-[25px] bg-teal-100 rounded-lg flex items-center  w-full gap-2 active:opacity-60 transition-all cursor-pointer select-none' >

                            <div className='w-[40px] h-[40px] rounded-full bg-gradient-to-b from-teal-200 to-teal-400 flex justify-center items-center'>
                                <Image src={rupee_pocket} alt="Rupee Icon" className='text-white object-contain w-[45px]' />
                            </div>
                            <p className='w-[60px] break-words text-[12px] leading-[14px] font-medium text-stone-800 text-center select-none' >Borrowing history</p>
                        </div>
                    </div>

                    <div className='w-full px-[5px] py-[15px] bg-emerald-50 mt-4 rounded-lg' >
                        <p className='text-zinc-400 lead leading-[14px] font-medium text-center text-[11px] select-none' >
                            The platform promises to protect your data security and will not spread your personal information
                        </p>
                    </div>
                </div>

            </div>

            <Footer />

        </div>
    )
}

export default HomePage