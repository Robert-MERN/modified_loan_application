'use client';

import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import useStateContext from '@/context/ContextProvider';


export default function Receipt_generator() {

    const { set_snackbar_alert } = useStateContext();

    const [form, setForm] = useState({
        date: "2025-",
        appName: '',
        amount: '',
        accountName: '',
        ifsc: '',
        accountNumber: '',
    });

    const receiptRef = useRef(null);

    const regex = / /g

    const handleDownload = async () => {

        if (Object.values(form).every(e => e)) {
            if (receiptRef.current) {
                const canvas = await html2canvas(receiptRef.current, {
                    useCORS: true,
                    scale: 4, // improves quality
                });
                canvas.toBlob((blob) => {
                    if (blob) {
                        saveAs(blob, `${form.accountName.replace(regex, '_')}_receipt.png`);
                    }
                });
            }
        } else {
            set_snackbar_alert({
                open: true,
                message: "Field(s) can't be empty!",
                severity: "error"
            });
        }
    };

    return (
        <div className="p-6">
            {/* Form */}
            <div className="mb-6 space-y-3">
                <p className='text-[23px] text-stone-800 font-semibold mb-4'>Generate Receipt</p>
                {['appName', "date", 'amount', 'accountName', 'ifsc', 'accountNumber'].map((field) => (
                    <input
                        key={field}
                        placeholder={field === "date" ? `date (YYYY-MM-DD)` : field}
                        value={form[field]}
                        onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                        className="border p-2 w-full rounded outline-none"
                    />
                ))}
            </div>

            {/* Receipt Preview */}
            <div className='w-full flex justify-center flex-col items-center' >

                <div
                    ref={receiptRef}
                    className="min-w-[360px]  border rounded bg-white text-sm font-sans space-y-2 leading-7"
                >
                    <div className='bg-gray-100 pt-4 px-4 pb-2 w-full' >


                        <div className="flex items-center justify-center gap-[2px] font-semibold text-lg">
                            <div className="flex items-center justify-center w-[50px] h-[50px]">
                                <img src="/images/icon_logo.png" className="w-full h-full object-contain" />
                            </div>
                            <div className='pb-[17px]'>
                                <p className="leading-none">{form.appName}</p>
                            </div>
                        </div>


                        <div className="text-center text-[15px] text-green-600 font-medium">
                            Transaction Successful
                        </div>
                        <div className="text-center text-[15px] text-gray-500">
                            {form.date} 14:18:47
                        </div>
                    </div>

                    <div className='px-4 pb-14'>


                        <div className=''>
                            <p className='text-gray-500 text-[16px]'>Amount:</p>
                            <p className='text-[18px] text-stone-800 font-medium'>INR {form.amount}.00</p>
                        </div>


                        <div className='pt-4'>
                            <p className='text-gray-500 text-[16px]'>Sent by:</p>
                            <p className='text-stone-800 font-medium text-[16px] capitalize'>{form.appName}</p>

                            <div className='w-full flex justify-between items-center'>
                                <p className='text-stone-800 font-medium text-[16px]'>Order sn:</p>
                                <p className='text-stone-800 font-medium text-[16px]'>S202507312014Ms85o</p>
                            </div>
                        </div>


                        <div className='pt-4'>
                            <p className='text-gray-500 text-[16px]'>Received by:</p>

                            <div className='w-full flex justify-between items-center gap-8'>
                                <p className='text-stone-800 font-medium text-[16px]'>Account Name:</p>
                                <p className='text-stone-800 font-medium text-[16px]'>{form.accountName.toUpperCase()}</p>
                            </div>

                            <div className='w-full flex justify-between items-center gap-8'>
                                <p className='text-stone-800 font-medium text-[16px]'>Account IFSC:</p>
                                <p className='text-stone-800 font-medium text-[16px]'>{form.ifsc.toUpperCase()}</p>
                            </div>

                            <div className='w-full flex justify-between items-center gap-8'>
                                <p className='text-stone-800 font-medium text-[16px]'>Account Number:</p>
                                <p className='text-stone-800 font-medium text-[16px]'>{form.accountNumber}</p>
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
        </div>
    );
}
