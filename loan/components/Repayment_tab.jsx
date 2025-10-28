import React from 'react'
import Navbar from './utilities/Navbar'
import styles from "@/styles/Home.module.css";
import formatter from '@/utils/functions/num_formatter';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Repayment_tab = ({ app_settings }) => {


    const router = useRouter();

    const calc_admin_amount = (amount) => {
        if (!amount) return amount;
        // Remove all commas from the number string, if any
        const num = amount.replace(/,/g, '');
        // Convert the cleaned string to a number and calculate the admin amount
        const admin_amount = Number(num) * 0.40;
        return admin_amount;
    }


    return (
        <div className='w-screen min-h-screen relative bg-stone-100' >
            <Navbar app_settings={app_settings} back_btn={true} disable_headset={true} />

            <div className="h-[35px] bg-orange-200 px-[15px] flex items-center mt-[52px]">
                <p className={`text-amber-700 text-[12px] whitespace-nowrap ${styles.text_slider}`}>
                    We will not contact the user in any way to ask for repayment. Please complete the repayment operation within the APP and beware of phishing attempts or fraudulent communication from unauthorized sources.
                </p>
            </div>


            <div>
                <div className='w-screen relative bg-emerald-400 px-[15px] h-[120px]' >

                    <div className='absolute w-full flex justify-center left-0 right-0 top-[25px] px-[20px]' >
                        <div className=' bg-white w-full rounded-2xl p-[20px] flex items-center flex-col gap-2 shadow' >

                            <p className='text-stone-400 font-semibold text-[14px]' >Repay Amount </p>

                            <p className='text-stone-800 font-bold text-[19px]' >{`₹ ${app_settings.loan_amount ? formatter(app_settings.loan_amount) + ".00" : "00.00"}`}</p>

                            <p className='text-stone-400 font-semibold text-[12px]' >Payment dates: {app_settings.repayment_time ? app_settings.repayment_time : "yyyy-mm-dd"}</p>

                            <button className='px-[10px] py-[6px] font-medium text-emerald-400 bg-stone-100 rounded-md text-[14px]' >
                                {Boolean(app_settings.loan_status) ? "Paid off" : "Pending"}
                            </button>

                        </div>
                    </div>
                </div>


                <p className={`text-stone-800 font-semibold text-[11px] px-[15px] mt-[90px] mb-4`}>
                    You can borrow <span className='text-emerald-400' >{`₹ ${app_settings.loan_amount ? app_settings.loan_amount + ".00" : "00.00"}`}</span> next time after repayment on time
                </p>

                <div className='w-full px-[15px] bg-white mt-4 shadow flex flex-col gap-4 py-4' >

                    <div className='w-full flex justify-start items-center pb-3 border-b' >
                        <p className='text-[14px] text-stone-900  font-bold' >Loan Information</p>
                    </div>
                    <div className='w-full flex justify-between items-center' >
                        <p className='text-[13px] text-stone-400 font-semibold' >Lending Institutions</p>
                        <p className='text-[13px] text-stone-700 font-semibold'>{app_settings.lenders ? app_settings.lenders : ""}</p>
                    </div>
                    <div className='w-full flex justify-between items-center' >
                        <p className='text-[13px] text-stone-400 font-semibold' >Loan Term</p>
                        <p className='text-[13px] text-stone-700 font-semibold'>7 Day</p>
                    </div>

                    <div className='w-full flex justify-between items-center' >
                        <p className='text-[13px] text-stone-400 font-semibold' >Application Amount</p>
                        <p className='text-[13px] text-stone-700 font-semibold'>
                            ₹ {app_settings.loan_amount ? formatter(app_settings.loan_amount) + ".00" : "00.00"}</p>
                    </div>

                    <div className='w-full flex justify-between items-center' >
                        <p className='text-[13px] text-stone-400 font-semibold' >Admin Amount</p>
                        <p className='text-[13px] text-stone-700 font-semibold'>
                            ₹ {app_settings.loan_amount ? calc_admin_amount(app_settings.loan_amount)?.toLocaleString() + ".00" : "00.00"}</p>
                    </div>

                    <div className='w-full flex justify-between items-center' >
                        <p className='text-[13px] text-stone-400 font-semibold' >Expire Date</p>
                        <p className='text-[13px] text-stone-700 font-semibold'>{app_settings.repayment_time ? app_settings.repayment_time : "yyyy-mm-dd"}</p>
                    </div>

                    {router.isReady && router.query.app_id && router.query.loan_id && (
                        <>
                            {!Boolean(app_settings.loan_status) &&

                                <Link href={`/re-payment/${router.query.app_id}/${router.query.loan_id}`} target="_blank" >
                                    <div className='w-full mt-3' >
                                        <button className='bg-emerald-400 text-[13px] text-white px-[10px] py-[10px] rounded-md font-medium active:opacity-60 transition-all w-full' >Pay Loan</button>
                                    </div>
                                </Link>
                            }
                        </>
                    )}
                </div>
            </div>
        </div >
    )
}

export default Repayment_tab