'use client'
import React, { useState, useRef, useEffect } from 'react'
import Navbar from './utilities/Navbar'
import styles from "@/styles/Home.module.css";
import formatter from '@/utils/functions/num_formatter';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import crypto from "crypto";
import useStateContext from '@/context/ContextProvider'
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';




const Repayment_tab = ({ app_settings }) => {



    const router = useRouter();

    const { set_snackbar_alert } = useStateContext();

    const calc_admin_amount = (amount) => {
        if (!amount) return amount;
        // Remove all commas from the number string, if any
        const num = amount.replace(/,/g, '');
        // Convert the cleaned string to a number and calculate the admin amount
        const admin_amount = Number(num) * 0.40;
        return admin_amount;
    }


    // Loan Receipt Logic
    const [expanded, setExpanded] = useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : null);
    };

    const receiptRef = useRef(null);

    const regex = / /g

    const handleDownload = async () => {
        if (receiptRef.current) {
            const canvas = await html2canvas(receiptRef.current, {
                useCORS: true,
                scale: 4, // improves quality
            });
            canvas.toBlob((blob) => {
                if (blob) {
                    saveAs(blob, `${app_settings.lenders.trim().replace(regex, '_')}_receipt.png`);
                }
            });
        }
    };

    function generateSerial() {
        const now = new Date();

        const date =
            now.getFullYear() +
            String(now.getMonth() + 1).padStart(2, "0") +
            String(now.getDate()).padStart(2, "0") +
            String(now.getHours()).padStart(2, "0") +
            String(now.getMinutes()).padStart(2, "0");

        const random = crypto.randomBytes(3).toString("base64").replace(/[^a-zA-Z0-9]/g, "").slice(0, 5);

        return `S${date}${random}`;
    }
    const [receipt_serial_number, set_receipt_serial_number] = useState("");
    useEffect(() => {
        set_receipt_serial_number(generateSerial());
    }, [])
    // Date Validator
    function isValidDate(dateStr) {
        const regex = /^(0[1-9]|[12][0-9]|3[01])[-\/](0[1-9]|1[0-2])[-\/]\d{4}$/;

        if (!regex.test(dateStr)) return false;

        const [day, month, year] = dateStr.split(/[-/]/).map(Number);

        const date = new Date(year, month - 1, day);

        return (
            date.getFullYear() === year &&
            date.getMonth() === month - 1 &&
            date.getDate() === day
        );
    }


    // Generate receipt time
    function generateReceiptTime(repayment) {
        const [d, m, y] = repayment.split(/[-/]/).map(Number);

        const date = new Date(y, m - 1, d - 6);

        const hour = Math.floor(Math.random() * (20 - 7 + 1)) + 7;

        date.setHours(
            hour,
            Math.floor(Math.random() * 60),
            Math.floor(Math.random() * 60)
        );

        return date.toLocaleString("en-GB", { hour12: false }).replace(",", "").replace(/\//g, "-");
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
                <div className='w-screen relative bg-blue-500 px-[15px] h-[120px]' >

                    <div className='absolute w-full flex justify-center left-0 right-0 top-[25px] px-[20px]' >
                        <div className=' bg-white w-full rounded-2xl p-[20px] flex items-center flex-col gap-2 shadow' >

                            <p className='text-stone-400 font-semibold text-[14px]' >Repay Amount </p>

                            <p className='text-stone-800 font-bold text-[19px]' >{`₹ ${app_settings.loan_amount ? formatter(app_settings.loan_amount) + ".00" : "00.00"}`}</p>

                            <p className='text-stone-400 font-semibold text-[12px]' >Payment dates: {app_settings.repayment_time ? app_settings.repayment_time : "yyyy-mm-dd"}</p>

                            <button className='px-[10px] py-[6px] font-medium text-blue-500 bg-stone-100 rounded-md text-[14px]' >
                                {Boolean(app_settings.loan_status) ? "Paid off" : "Pending"}
                            </button>

                        </div>
                    </div>
                </div>


                <p className={`text-stone-800 font-semibold text-[11px] px-[15px] mt-[90px] mb-4`}>
                    You can borrow <span className='text-blue-500' >{`₹ ${app_settings.loan_amount ? app_settings.loan_amount + ".00" : "00.00"}`}</span> next time after repayment on time
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
                        <p className='text-[13px] text-stone-700 font-semibold'>{app_settings.repayment_time ? app_settings.repayment_time : "dd-mm-yyyy"}</p>
                    </div>

                    {router.isReady && router.query.app_id && router.query.loan_id && (
                        <>
                            {!Boolean(app_settings.loan_status) &&

                                <Link href={`/re-payment/${router.query.app_id}/${router.query.loan_id}`} target="_blank" >
                                    <div className='w-full mt-3' >
                                        <button className='bg-blue-500 text-[13px] text-white px-[10px] py-[10px] rounded-md font-medium active:opacity-60 transition-all w-full' >Pay Loan</button>
                                    </div>
                                </Link>
                            }
                        </>
                    )}


                    {/* Accordion for Receipt */}
                    {Boolean(app_settings.is_receipt_uploaded) &&
                        <Accordion
                            expanded={expanded}
                            onChange={handleChange(true)}
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
                                className='px-[15px]'
                                sx={{
                                    justifyContent: "center",
                                    "& .MuiAccordionSummary-content": {
                                        justifyContent: "center",
                                        flexGrow: 0,
                                    },
                                }}
                            >
                                <p className="text-[14px] font-semibold text-slate-500 text-center">
                                    View receipt
                                </p>

                            </AccordionSummary>
                            <AccordionDetails className='px-[10px] border-t border-stone-200'>

                                {/* Receipt Preview */}
                                <div className='w-full flex justify-center flex-col items-center' >

                                    <div
                                        ref={receiptRef}
                                        className="min-w-[360px]  border rounded bg-white text-sm font-sans space-y-2 leading-7 mt-2"
                                    >
                                        <div className='bg-gray-100 pt-4 px-4 pb-2 w-full' >


                                            <div className="flex items-center justify-center gap-[2px] font-semibold text-lg">
                                                <div className="flex items-center justify-center w-[50px] h-[50px]">
                                                    <img src="/images/icon_logo.png" className="w-full h-full object-contain" />
                                                </div>
                                                <div className='pb-[17px]'>
                                                    <p className="leading-none capitalize">{app_settings.lenders || app_settings.app_name || ""}</p>
                                                </div>
                                            </div>


                                            <div className="text-center text-[15px] text-green-600 font-medium">
                                                Transaction Successful
                                            </div>
                                            <div className="text-center text-[15px] text-gray-500">
                                                {app_settings.receipt_time
                                                    ||
                                                    (isValidDate(app_settings.repayment_time) ?
                                                        generateReceiptTime(app_settings.repayment_time)
                                                        :
                                                        "")
                                                }
                                            </div>
                                        </div>

                                        <div className='px-4 pb-14'>


                                            <div className=''>
                                                <p className='text-gray-500 text-[16px]'>Amount:</p>
                                                <p className='text-[18px] text-stone-800 font-medium'>INR {app_settings?.receipt_loan_amount || (Number(app_settings?.loan_amount) * 0.6) || "00"}.00</p>
                                            </div>


                                            <div className='pt-4'>
                                                <p className='text-gray-500 text-[16px]'>Sent by:</p>
                                                <p className='text-stone-800 font-medium text-[16px] capitalize'>{app_settings.lenders || app_settings.app_name || ""}</p>

                                                <div className='w-full flex justify-between items-center'>
                                                    <p className='text-stone-800 font-medium text-[16px]'>Order sn:</p>
                                                    <p className='text-stone-800 font-medium text-[16px]'>{app_settings?.receipt_serial_number || receipt_serial_number}</p>
                                                </div>
                                            </div>


                                            <div className='pt-4'>
                                                <p className='text-gray-500 text-[16px]'>Received by:</p>

                                                <div className='w-full flex justify-between items-center gap-8'>
                                                    <p className='text-stone-800 font-medium text-[16px]'>Account Name:</p>
                                                    <p className='text-stone-800 font-medium text-[16px]'>{app_settings?.accountName?.toUpperCase() || app_settings?.user_name}</p>
                                                </div>

                                                <div className='w-full flex justify-between items-center gap-8'>
                                                    <p className='text-stone-800 font-medium text-[16px]'>Account IFSC:</p>
                                                    <p className='text-stone-800 font-medium text-[16px]'>{app_settings?.receipt_account_ifsc?.toUpperCase()}</p>
                                                </div>

                                                <div className='w-full flex justify-between items-center gap-8'>
                                                    <p className='text-stone-800 font-medium text-[16px]'>Account Number:</p>
                                                    <p className='text-stone-800 font-medium text-[16px]'>{app_settings?.receipt_account_number}</p>
                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                    <button
                                        onClick={handleDownload}
                                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded mb-12"
                                    >
                                        Download Receipt
                                    </button>
                                </div>
                            </AccordionDetails>
                        </Accordion>
                    }

                </div>
            </div>
        </div >
    )
}

export default Repayment_tab