import React, { useState } from 'react'
import Navbar from './utilities/Navbar'
import styles from "@/styles/Home.module.css"
import { FaCheck } from "react-icons/fa6";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Image from 'next/image';
import my_cash from "@/public/images/my_cash.png";
import cloud_wallet from "@/public/images/cloud_wallet.png";
import link_cash from "@/public/images/link_cash.png";
import super_bank from "@/public/images/super_bank.jpg";
import magic_loan from "@/public/images/magic_loan.jpg";
import h24_cash from "@/public/images/h24_cash.png";
import we_cash from "@/public/images/we_cash.png";
import cash_now from "@/public/images/cash_now.png";
import u_money from "@/public/images/u_money.png";
import loan_assist from "@/public/images/loan_assist.png";
import useStateContext from '@/context/ContextProvider';



const Borrow = ({ app_settings }) => {

    const { openModal, borrow_amount, setAPIloading } = useStateContext();

    const [agree, set_agree] = useState("agree");


    const check_product = (product) => {
        if (selected_products.length) {
            return selected_products.some(e => e.name === product.name);
        } else {
            return false;
        }
    }

    const [selected_products, set_selected_products] = useState([]);
    const select_product = (product) => {
        if (selected_products.length) {
            if (selected_products.some(e => e.name === product.name)) {
                const products_copy = [...selected_products];
                products_copy.splice(products_copy.findIndex(e => e.name === product.name), 1);
                set_selected_products(products_copy);
            } else {
                return set_selected_products(prev => ([...prev, product]));
            }

        } else {
            return set_selected_products(prev => ([...prev, product]));
        }

    };

    const products = [
        {
            name: "My Cash",
            img: my_cash,
            users: "1660k+",
            amount: "3,200-3,500"
        },
        {
            name: "Cloud Wallet",
            img: cloud_wallet,
            users: "2324k+",
            amount: "3,200-3,500"
        },
        {
            name: "Link Cash",
            img: link_cash,
            users: "2826k+",
            amount: "3,200-3,500"
        },
        {
            name: "Super Bank",
            img: super_bank,
            users: "2727k+",
            amount: "3,200-3,500"
        },
        {
            name: "Magic Loan",
            img: magic_loan,
            users: "1677k+",
            amount: "3,200-3,500"
        },
        {
            name: "2 4H Cash",
            img: h24_cash,
            users: "1286k+",
            amount: "3,200-3,500"
        },
        {
            name: "We Cash",
            img: we_cash,
            users: "1694k+",
            amount: "3,200-3,500"
        },
        {
            name: "Cash Now",
            img: cash_now,
            users: "1311k+",
            amount: "3,200-3,500"
        },
        {
            name: "U Money",
            img: u_money,
            users: "1157k+",
            amount: "3,200-3,500"
        },
        {
            name: "Loan Assist",
            img: loan_assist,
            users: "1976k+",
            amount: "3,200-3,500"
        },
    ];

    const handle_submit = () => {
        setAPIloading(true);

        setTimeout(() => {
            setAPIloading(false);
        }, 1000);

    }


    return (
        <div className='w-screen min-h-screen relative bg-stone-100 pt-[52px]' >
            <Navbar app_settings={app_settings} back_btn={true} />

            <div className="h-[35px] bg-orange-100 px-[15px] flex items-center select-none">
                <p className={`text-amber-600 text-[12px] whitespace-nowrap bg-orange-100 ${styles.text_slider}`}>
                    After registering, the system will match you with a limit according to your credit score
                </p>
            </div>

            <div className='px-[15px] mt-4 select-none' >
                <div className='w-full px-[35px] pb-[25px] pt-[15px] flex flex-col items-center gap-2 bg-white rounded-xl shadow-sm' >

                    <p className='text-[16px] text-stone-400 font-semibold' >
                        Please select a loan amount
                    </p>

                    <div onClick={() => openModal("borrow_amount_modal")} className='w-full flex justify-between items-center' >
                        <p className='text-[24px] font-bold text-stone-700' >₹ {borrow_amount}</p>
                        <ArrowDropDownIcon className='text-stone-300 scale-[1.5]' />

                    </div>

                </div>
            </div>


            <p className='text-[12px] font-semibold text-stone-600 px-[15px] w-full text-center my-4 select-none' >
                There are currently only <span className='px-[6px] py-[1px] bg-emerald-50 text-emerald-400' >0</span> <span className='px-[6px] py-[1px] bg-emerald-50 text-emerald-400 ml-[2px]' >2</span> <span className='px-[6px] py-[1px] bg-emerald-50 text-emerald-400 ml-[2px]' >6</span> <span className='px-[6px] py-[1px] bg-emerald-50 text-emerald-400 ml-[2px]' >9</span> loan quotas left
            </p>

            <div className='w-full pb-[140px]' >
                {products.map((e, index) => (

                    <div key={index} onClick={() => select_product(e)} className='w-full px-[15px] py-[15px] flex justify-between items-center bg-white shadow active:opacity-60 transition-all select-none mb-3' >
                        <div className='flex gap-3 items-center' >
                            <button className={`border-emerald-400 ${check_product(e) ? "bg-emerald-400" : "bg-white"} border rounded-full p-[3px] text-[12px] font-thin text-white`} >
                                {check_product(e) ?
                                    <FaCheck />
                                    :
                                    <FaCheck className='text-white' />
                                }
                            </button>

                            <div className='flex items-center gap-1' >
                                <div className='w-[23px] h-[23px] rounded-full bg-white overflow-hidden' >
                                    <Image alt={e.name} src={e.img} className='object-contain' />
                                </div>
                                <div>
                                    <p className='text-[11px] text-stone-600 font-semibold' >{e.name}</p>
                                    <p className='text-[9px] text-emerald-400 font-medium' >{e.users} users have borrowed</p>
                                </div>

                            </div>

                        </div>

                        <div className='flex items-center' >
                            <p className='text-[11px] text-orange-400 font-semibold' >₹ {e.amount}</p>
                            <ArrowDropDownIcon className='text-stone-300 scale-[1.5]' />
                        </div>

                    </div>
                ))}

            </div>



            <footer className='w-screen fixed bottom-0 left-0 right-0 bg-white px-[10px] pt-[15px] pb-[20px] border-t border-stone-200 z-50 select-none' >
                <div className='flex gap-2 items-center mb-[12px]' >
                    <button onClick={() => agree !== "agree" ? set_agree("agree") : set_agree("")} className={`border-emerald-400 ${agree === "agree" ? "bg-emerald-400" : "bg-white"} border rounded-full p-[3px] text-[12px] font-thin text-white`} >
                        {agree === "agree" ?
                            <FaCheck />
                            :
                            <FaCheck className='text-white' />

                        }
                    </button>
                    <p className='text-[12px] text-stone-400 font-semibold' >I agree to the  <span className='text-emerald-400' >{"{{Loan Agreement}}"}</span> </p>
                </div>

                <button className='w-full flex border border-emerald-400 rounded-full overflow-hidden relative' >


                    <div className='text-emerald-400 text-[10px] w-full pr-[10px] py-[13px] flex flex-col active:bg-emerald-50 transition-all leading-[14px] select-none' >
                        <p>
                            The highest withdrawal limit
                        </p>
                        <p className='text-[15px] font-bold' >₹ 10,500.00</p>
                    </div>


                    <div onClick={handle_submit} className='bg-emerald-400 active:bg-emerald-300 text-white text-[10px] w-full py-[13px] flex flex-col transition-all leading-[14px] z-10 rounded-full select-none' >
                        {selected_products.length} products have been selected
                        <p className='text-[15px] font-bold' >Apply now</p>
                    </div>


                </button>

            </footer>

        </div>
    )
}

export default Borrow