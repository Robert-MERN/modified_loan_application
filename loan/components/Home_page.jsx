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
        <div className={`w-screen min-h-screen bg-gradient-to-b from-blue-500 via-blue-300 to-blue-200 to-80% px-[15px] relative ${styles.scrollBar}`} >

            <Navbar user={true} app_settings={app_settings} />



            <div className={`mt-[52px] pt-[50px] ${styles.scrollBar}`}>


                {/* Main Card */}
                <div className="w-full bg-white/70 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border-2 border-white/50">
                    <p className="text-slate-500 text-sm font-medium text-center uppercase tracking-wider">
                        Available Limit
                    </p>
                    <h2 onClick={() => openModal("borrow_amount_modal")} className="text-4xl font-bold text-slate-800 text-center mt-2 flex justify-center items-center cursor-pointer">
                        ₹ {borrow_amount}
                        <ArrowDropDownIcon className="text-blue-500 ml-1" />
                    </h2>

                    {/* Simple Stats Row */}
                    <div className="flex mt-8 py-4 border-t border-slate-100">
                        <div className="flex-1 text-center">
                            <p className="text-xs text-slate-400">Total Limit</p>
                            <p className="font-bold text-slate-700">₹ {borrow_amount}</p>
                        </div>
                        <div className="w-[1px] bg-slate-100"></div>
                        <div className="flex-1 text-center">
                            <p className="text-xs text-slate-400">Spent</p>
                            <p className="font-bold text-slate-700">₹ {total_spent.toLocaleString("en-US")}.00</p>
                        </div>
                    </div>
                </div>

                {/* Borrow Now Button */}
                <button
                    onClick={() => handle_options(`/borrow/${router.query.app_id}`)}
                    className="w-full mt-12 py-[14px] bg-gradient-to-r from-[#53a7c1] to-[#4b89dc] text-white font-bold text-lg rounded-3xl shadow-[0px_8px_20px_rgba(75,137,220,0.35)] active:scale-95 transition-all duration-200 border-b-[3px] border-black/10 flex items-center justify-center shadow-blue-400"
                >
                    Borrow Now
                </button>


                <div className="w-full bg-white/70 backdrop-blur-lg rounded-3xl p-4 mt-6 border-2 border-white/50 shadow-sm">
                    <div className="flex gap-4">
                        {/* Refinance Card */}
                        <div
                            onClick={() => handle_options(`/borrow/${router.query.app_id}`)}
                            className="flex-1 bg-rose-50/50 hover:bg-rose-100/60 transition-colors rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer border border-rose-100/50"
                        >
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-400 to-red-500 shadow-md flex items-center justify-center mb-2">
                                <Image src={rupee_bag} alt="Refinance" className="w-6 h-6 object-contain brightness-0 invert" />
                            </div>
                            <p className="text-[13px] font-semibold text-rose-900">Refinance</p>
                        </div>

                        {/* Borrowing History Card */}
                        <div
                            onClick={() => handle_options(`/borrow-history/${router.query.app_id}`)}
                            className="flex-1 bg-blue-50/50 hover:bg-blue-100/60 transition-colors rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer border border-blue-100/50"
                        >
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 shadow-md flex items-center justify-center mb-2">
                                <Image src={rupee_pocket} alt="History" className="w-7 h-7 object-contain brightness-0 invert" />
                            </div>
                            <p className="text-[13px] font-semibold text-blue-900 text-center leading-tight">Borrowing History</p>
                        </div>
                    </div>

                    {/* Security Disclaimer Section */}
                    <div className="mt-4 px-3 py-3 bg-slate-50/80 rounded-xl border border-slate-100">
                        <p className="text-slate-400 text-[10px] leading-relaxed text-center font-medium">
                            <span className="inline-block mr-1">🛡️</span>
                            The platform promises to protect your data security and will not spread your personal information.
                        </p>
                    </div>
                </div>

            </div>

            <Footer />

        </div>
    )
}

export default HomePage