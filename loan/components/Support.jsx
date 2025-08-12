import React from 'react'
import Navbar from './utilities/Navbar'
import { CgNotes } from "react-icons/cg";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import useStateContext from '@/context/ContextProvider';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Person3Icon from '@mui/icons-material/Person3';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import { LiaCoinsSolid } from "react-icons/lia";
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { CiLock } from "react-icons/ci";
import { useRouter } from 'next/router';


const Support = ({ app_settings }) => {

    const { setAPIloading } = useStateContext();

    const options = [
        {
            question: "Why was my loan application rejected?",
        },
        {
            question: "How long does a loan application approval take?",
        },
        {
            question: "When will the payment be released after the application is approved?",
        },
        {
            question: "How to raise the loan amount?",
        },
        {
            question: "How to repay?",
        },
        {
            question: "Repayment has been made but the order status has not changed",
        },
    ]
    const router = useRouter();
    const handle_options = (link) => {
        const appId = router.query.app_id;
        if (!appId) return;

        setAPIloading(true);
        setTimeout(() => {
            link && router.push(link)
            !link && setAPIloading(false);
        }, 1000)

    }


    return (
        <div className='w-screen min-h-screen relative bg-stone-100 px-[15px] pt-[66px] ' >
            <Navbar app_settings={app_settings} back_btn={true} disable_headset={true} />
            <div className='w-full bg-white rounded-lg flex items-center px-[15px] py-[20px] shadow-md' >

                <button onClick={() => handle_options()} className='w-full flex items-center gap-2 select-none active:opacity-[.65] transition-all text-left' >
                    <span className='w-[35px] h-[35px] rounded-xl bg-orange-200 grid place-items-center' >
                        <CgNotes className='text-white' />
                    </span>
                    <span className='text-[12px] text-stone-600 whitespace-break-spaces font-semibold select-none text-left'>Complaint Feedback</span>
                </button>

                <button onClick={() => handle_options(`/borrow-history/${router.query.app_id}`)} className='w-full flex items-center justify-end gap-2 select-none active:opacity-[.65] transition-all text-left' >
                    <span className='w-[35px] h-[35px] rounded-xl bg-gradient-to-b from-purple-300 to-purple-400 grid place-items-center' >
                        <AccessTimeIcon className='text-white' />
                    </span>
                    <span className='text-[12px] text-stone-600 font-semibold select-none text-left' >Record Request</span>
                </button>

            </div>

            <p className='text-stone-400 lead leading-[14px] font-medium text-[11px] select-none mt-4' >
                Hello, I am the official CS of Loan Partner, please do not trust any customer service outside the APP, beware of fraud.
            </p>

            <div className='w-full pb-6 px-[32px] pt-2 relative' >

                <div className='w-[30px] h-[30px] rounded-full absolute bg-emerald-400 left-0 top-[22px] flex justify-center items-end overflow-hidden border-2 border-emerald-500' >
                    <Person3Icon className='text-amber-300 scale-[1.2]' />
                </div>


                <p className='text-stone-400 lead leading-[14px] font-medium text-[13px] select-none mt-4 mb-1' >
                    Customer Service Assistant
                </p>
                <div className='w-full px-[10px] py-[15px] bg-gradient-to-b from-emerald-50 to-white to-[25%] rounded-lg shadow-md' >
                    <div className='w-full flex justify-between items-start' >

                        <div onClick={() => handle_options()} className='flex flex-col gap-2 items-center active:opacity-[.40] transition-all'>
                            <div className='border border-emerald-400 p-[2px] rounded-[12px]'  >
                                <WhatshotIcon className='text-emerald-400 scale-75' />
                            </div>
                            <p className='text-emerald-500 lead leading-[11px] font-medium text-[9px] select-none text-center' >
                                Top Questions
                            </p>
                        </div>

                        <div onClick={() => handle_options()} className='flex flex-col gap-2 items-center active:opacity-[.40] transition-all'>
                            <div className='border border-emerald-400 p-[6px] rounded-[12px]' >
                                <LiaCoinsSolid className='text-emerald-400 scale-[1.4]' />
                            </div>
                            <p className='text-emerald-500 lead leading-[11px] font-medium text-[9px] select-none text-center' >
                                Loan Questions
                            </p>
                        </div>

                        <div onClick={() => handle_options()} className='flex flex-col gap-2 items-center active:opacity-[.40] transition-all'>
                            <div className='border border-emerald-400 p-[2px] rounded-[10px]' >
                                <CreditCardIcon className='text-emerald-400 scale-75' />
                            </div>
                            <p className='text-emerald-500 lead leading-[11px] font-medium text-[9px] select-none text-center' >
                                Payment Questions
                            </p>
                        </div>

                        <div onClick={() => handle_options()} className='flex flex-col gap-2 items-center active:opacity-[.40] transition-all' >
                            <div className='border border-emerald-400 p-[6px] rounded-[10px]' >
                                <CiLock className='text-emerald-400 scale-[1.2]' />
                            </div>
                            <p className='text-emerald-500 lead leading-[11px] font-medium text-[9px] select-none text-center' >
                                Data Security
                            </p>
                        </div>

                    </div>

                    <div className='mt-8' >
                        <p className='text-stone-800 lead leading-[14px] font-bold text-[13px] select-none mt-4 px-[15px] mb-2' >
                            Top Questions
                        </p>

                        <div className='w-full flex flex-col' >

                            {options.map((e, index) => (
                                <button onClick={() => handle_options()} key={index} className='w-full py-[14px] flex justify-between active:bg-stone-100 rounded-md transition-all gap-2 px-[15px]' >
                                    <p className='text-stone-700 font-medium text-[13px] select-none cursor-pointer text-left' >
                                        {e.question}
                                    </p>
                                    <ArrowForwardIosIcon className='text-stone-400 scale-[.75]' />
                                </button>
                            ))}

                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default Support