import React, { useState } from 'react'
import Navbar from './utilities/Navbar'
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


const Borrow_history = ({ app_settings, myloans }) => {

    const { setAPIloading } = useStateContext();

    const [select, set_select] = useState("all");
    const handle_select = (option) => {
        setAPIloading(true)
        setTimeout(() => {
            set_select(option);
            setAPIloading(false);
        }, 500);
    };

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
        <div className='w-screen min-h-screen relative bg-stone-100' >
            <Navbar app_settings={app_settings} back_btn={true} />
            <div className='w-screen overflow-x-auto flex bg-emerald-400 mt-[52px] px-[15px] pb-[5px] h-[34px] justify-between gap-8' >
                <p onClick={() => handle_select("all")} className={`text-stone-50 text-[13px] select-none relative w-[70px] text-center whitespace-nowrap ${select === "all" ? "font-semibold " : "font-normal opacity-90"}`} >
                    All
                    {select === "all" &&
                        <span className='w-full border-b-[3px] rounded-full absolute bottom-0 left-0 '></span>
                    }
                </p>


                <p onClick={() => handle_select("finished")} className={`text-stone-50 text-[13px] select-none relative w-[100px] text-center whitespace-nowrap ${select === "finished" ? "font-semibold " : "font-normal opacity-90"}`} >
                    Finished
                    {select === "finished" &&
                        <span className='w-full border-b-[3px] rounded-full absolute bottom-0 left-0 '></span>
                    }
                </p>


                <p onClick={() => handle_select("processing")} className={`text-stone-50 text-[13px] select-none relative w-[70px] text-center whitespace-nowrap ${select === "processing" ? "font-semibold " : "font-normal opacity-90"}`} >
                    Processing
                    {
                        select === "processing" &&
                        <span className='w-full border-b-[3px] rounded-full absolute bottom-0 left-0 '></span>
                    }
                </p>



            </div>

            {select === "all" ?
                <>
                    {Boolean(myloans.length) ?
                        <>
                            {myloans.map((item, index) => (
                                <Loans key={index} loan_settings={item} />
                            ))}
                        </>
                        :
                        <>
                        </>
                    }
                </>
                :
                select === "finished" ?
                    <>
                        {Boolean(myloans.length) && myloans.filter(each => Boolean(each.loan_status)).length ?
                            <>
                                {myloans.filter(each => Boolean(each.loan_status)).map((item, index) => (
                                    <Loans key={index} loan_settings={item} />
                                ))}
                            </>
                            :
                            <>
                            </>
                        }
                    </>
                    :
                    <>

                        {Boolean(myloans.length) && myloans.filter(each => !Boolean(each.loan_status)).length ?
                            <>
                                {myloans.filter(each => !Boolean(each.loan_status)).map((item, index) => (
                                    <Loans key={index} loan_settings={item} />
                                ))}
                            </>
                            :
                            <>
                            </>
                        }
                    </>

            }

        </div>
    )
}

export default Borrow_history