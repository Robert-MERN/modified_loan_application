import React, { useState, useEffect } from 'react'
import Footer from './utilities/Footer'
import Navbar from './utilities/Navbar'
import styles from "@/styles/Home.module.css";
import Image from 'next/image';
import no_result from "@/public/images/no_result.svg";
import useStateContext from '@/context/ContextProvider';
import { useRouter } from 'next/router';
import formatter from '@/utils/functions/num_formatter';


const Loans = ({ loan_settings }) => {
    const router = useRouter();
    const repayment_btn = (loan_id) => {
        router.push(`/re-payment-tab/${router.query.app_id}/${loan_id}`);
    }

    return (
        <div className='w-full px-[15px] bg-white mt-4 shadow flex flex-col gap-3 py-4' >

            <div className='w-full flex justify-between items-center mb-3' >
                <p className='text-[14px] text-stone-900  font-bold' >Order Status</p>
                <p className='text-[14px] text-emerald-400 font-bold'>
                    {Boolean(loan_settings.loan_status) ?
                        "Completed"
                        :
                        "Active"
                    }
                </p>

            </div>
            <div className='w-full flex justify-between items-center' >
                <p className='text-[13px] text-stone-400 font-semibold' >Lenders</p>
                <p className='text-[13px] text-stone-700 font-semibold'>{loan_settings ? loan_settings.lenders : ""}</p>
            </div>
            <div className='w-full flex justify-between items-center' >
                <p className='text-[13px] text-stone-400 font-semibold' >Loan Amount</p>
                <p className='text-[13px] text-stone-700 font-semibold'>
                    ₹ {loan_settings ? formatter(loan_settings.loan_amount) + ".00" : "00.00"}</p>
            </div>
            <div className='w-full flex justify-between items-center' >
                <p className='text-[13px] text-stone-400 font-semibold' >Repayment Status</p>
                <p className='text-[13px] text-stone-700 font-semibold'>
                    {Boolean(loan_settings.loan_status) ?
                        "Paid off"
                        :
                        "Unpaid"
                    }
                </p>
            </div>
            <div className='w-full flex justify-between items-center' >
                <p className='text-[13px] text-stone-400 font-semibold' >Repayment Time</p>
                <p className='text-[13px] text-stone-700 font-semibold'>{loan_settings ? loan_settings.repayment_time : "yyyy-mm-dd"}</p>
            </div>
            {!Boolean(loan_settings.loan_status) &&
                <div className='w-full flex justify-end items-center mt-3' >
                    <button onClick={() => repayment_btn(loan_settings._id)} className='bg-emerald-400 text-[12px] text-white px-[10px] py-[8px] rounded-lg font-medium active:opacity-60 transition-all' >Repayment Now</button>
                </div>
            }
        </div>
    )

}

const My_loans = ({ app_settings, myloans }) => {
    const { setAPIloading } = useStateContext();

    const [select, set_select] = useState("not_finished");
    const handle_select = (option) => {
        setAPIloading(true)
        setTimeout(() => {
            set_select(option);
            setAPIloading(false);
        }, 500);
    }

    const router = useRouter();

    const pay_loan = () => {
        const appId = router.query.app_id;
        if (!appId) return;
        
        setAPIloading(true);
        setTimeout(() => {
            setAPIloading(false);
            router.push(`/borrow/${router.query.app_id}`)
        }, 750);
    }



    return (
        <div className={`w-screen min-h-screen relative bg-stone-10 ${styles.scrollBar}`} >
            <Navbar app_settings={app_settings} back_btn={false} />
            <div className='w-screen overflow-x-auto flex bg-emerald-400 mt-[52px] px-[15px] pb-[5px] h-[34px] gap-8' >
                <p onClick={() => handle_select("paid_off")} className={`text-stone-50 text-[13px] select-none relative w-[70px] text-center whitespace-nowrap ${select === "paid_off" ? "font-semibold " : "font-normal opacity-90"}`} >
                    Paid off
                    {select === "paid_off" &&
                        <span className='w-full border-b-[3px] rounded-full absolute bottom-0 left-0 '></span>
                    }
                </p>


                <p onClick={() => handle_select("not_finished")} className={`text-stone-50 text-[13px] select-none relative w-[100px] text-center whitespace-nowrap ${select === "not_finished" ? "font-semibold " : "font-normal opacity-90"}`} >
                    Not Finished
                    {select === "not_finished" &&
                        <span className='w-full border-b-[3px] rounded-full absolute bottom-0 left-0 '></span>
                    }
                </p>


                <p onClick={() => handle_select("overdue")} className={`text-stone-50 text-[13px] select-none relative w-[70px] text-center whitespace-nowrap ${select === "overdue" ? "font-semibold " : "font-normal opacity-90"}`} >
                    Overdue
                    {
                        select === "overdue" &&
                        <span className='w-full border-b-[3px] rounded-full absolute bottom-0 left-0 '></span>
                    }
                </p>


                <p onClick={() => handle_select("approval_process")} className={`text-stone-50 text-[13px] select-none relative w-[150px] text-center whitespace-nowrap ${select === "approval_process" ? "font-semibold " : "font-normal opacity-90"}`} >
                    Approval process
                    {select === "approval_process" &&
                        <span className='w-full border-b-[3px] rounded-full absolute bottom-0 left-0 '></span>
                    }
                </p>
            </div>

            <div className="h-[35px] bg-orange-100 px-[15px] flex items-center">

                {select === "not_finished" ?
                    <p className={`text-amber-600 text-[12px] whitespace-nowrap bg-orange-100 ${styles.text_slider}`}>
                        1, fill in UTR for faster balance reconcilation
                    </p>
                    :
                    <p className={`text-amber-600 text-[12px] whitespace-nowrap bg-orange-100 ${styles.text_slider}`}>
                        1, Please do not disclose your order information to prevent fraud 2, All transactions made outside the app with a repayment discount are fraudlent
                    </p>
                }

            </div>

            {select === "not_finished" ?
                <>
                    {Boolean(myloans.length) && myloans.filter(each => !Boolean(each.loan_status)).length ?
                        <>
                            {myloans.filter(each => !Boolean(each.loan_status)).map((item, index) => (
                                <Loans key={index} loan_settings={item} />
                            ))}
                        </>
                        :
                        <>
                            <div className='flex items-center w-full justify-center mt-20'>
                                <Image src={no_result} href="No Result" className='w-[160px] object-contain' />
                            </div>
                            <div onClick={pay_loan} className='w-full px-[20px] mt-4' >
                                <button className='w-full text-white active:opacity-75 transition-all py-[8px] text-[16px] bg-emerald-400 rounded-full font-medium'>
                                    Borrow now
                                </button>
                            </div>
                        </>
                    }
                </>
                : select === "paid_off" ?

                    <>
                        {Boolean(myloans.length) && myloans.filter(each => Boolean(each.loan_status)).length ?
                            <>
                                {myloans.filter(each => Boolean(each.loan_status)).map((item, index) => (
                                    <Loans key={index} loan_settings={item} />
                                ))}
                            </>
                            :
                            <>
                                <div className='flex items-center w-full justify-center mt-20'>
                                    <Image src={no_result} href="No Result" className='w-[160px] object-contain' />
                                </div>
                                <div onClick={pay_loan} className='w-full px-[20px] mt-4' >
                                    <button className='w-full text-white active:opacity-75 transition-all py-[8px] text-[16px] bg-emerald-400 rounded-full font-medium'>
                                        Borrow now
                                    </button>
                                </div>
                            </>
                        }
                    </>
                    :
                    <>
                        <div className='flex items-center w-full justify-center mt-20'>
                            <Image src={no_result} href="No Result" className='w-[160px] object-contain' />
                        </div>
                        <div onClick={pay_loan} className='w-full px-[20px] mt-4' >
                            <button className='w-full text-white active:opacity-75 transition-all py-[8px] text-[16px] bg-emerald-400 rounded-full font-medium'>
                                Borrow now
                            </button>
                        </div>
                    </>
            }



            <Footer />
        </div >
    )
}

export default My_loans