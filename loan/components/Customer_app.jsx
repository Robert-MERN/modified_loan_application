'use client';
import React, { useEffect } from 'react'
import Navbar from './utilities/Navbar'
import useStateContext from '@/context/ContextProvider'
import { useState } from 'react'
import Link from 'next/link'
import clipboardCopy from 'clipboard-copy';
import crypto from "crypto";
import Switch from '@mui/material/Switch';





const Customer_app = ({ app_settings, device_info }) => {
    const {
        handle_update_app_settings,
        app_id,
        set_app_id,
        APIloading,
        handle_user_device_info,
        handle_update_myloan,
        handle_get_myloans,
        all_myloans,
        loan_id,
        set_loan_id,
        loan_id_2,
        set_loan_id_2,
        openModal,
        set_snackbar_alert,
    } = useStateContext();

    const [customize, set_customize] = useState("app_customization");

    useEffect(() => {

        if (customize !== "app_customization" && app_id) {
            handle_get_myloans(app_id);
        };

    }, [customize, app_id]);

    const default_State = {
        app_name: app_settings?.app_name || "",
        upi_id: app_settings?.upi_id || "",
        user_name: app_settings?.user_name || "",
        pan_card: app_settings?.pan_card || "",
        phone_number: "",
    }

    const default_State_2 = {
        loan_amount: "",
        lenders: "",
        repayment_time: "",
        loan_status: false,
        // Receipt fields
        is_receipt_uploaded: false,
        receipt_time: "",
        receipt_loan_amount: "",
        receipt_account_name: "",
        receipt_account_ifsc: "",
        receipt_account_number: "",
        receipt_serial_number: "",
    }


    const [values, set_values] = useState(default_State);

    useEffect(() => {
        if (app_settings) {
            set_values({
                app_name: app_settings?.app_name || "",
                upi_id: app_settings?.upi_id || "",
                user_name: app_settings?.user_name || "",
                pan_card: app_settings?.pan_card || "",
                phone_number: "",
            });
            set_app_id(app_settings._id)
        }
    }, [app_settings])

    const [values_2, set_values_2] = useState(default_State_2);

    useEffect(() => {
        if (all_myloans.length) {
            const ID = loan_id || all_myloans[0]._id
            const selected_loan = all_myloans.find(each => each._id === ID);
            set_values_2({
                loan_amount: selected_loan?.loan_amount || "",
                lenders: selected_loan?.lenders || "",
                repayment_time: selected_loan?.repayment_time || "",
                loan_status: selected_loan?.loan_status || "",
                is_receipt_uploaded: selected_loan?.is_receipt_uploaded || false,
                receipt_time: selected_loan?.receipt_time || "",
                receipt_loan_amount: selected_loan?.receipt_loan_amount || "",
                receipt_account_name: selected_loan?.receipt_account_name || "",
                receipt_account_ifsc: selected_loan?.receipt_account_ifsc || "",
                receipt_account_number: selected_loan?.receipt_account_number || "",
                receipt_serial_number: selected_loan?.receipt_serial_number || "",
            })
        }
    }, [all_myloans, loan_id])



    const handle_change = (e) => {
        const { name, value } = e.target;
        set_values(prev => ({ ...prev, [name]: value }));
    };

    const handle_change_2 = (e) => {
        const { name, value } = e.target;
        set_values_2(prev => ({ ...prev, [name]: value }));
    }




    const delete_empty_pairs = (obj) => {
        const object = { ...obj }
        for (const each of Object.keys(obj)) {
            if (!obj[each]) {
                delete object[each];
            }
        }
        return object;
    }

    const set_default_states = () => {
        // set_values(default_State);
    }

    const set_default_states_2 = () => {
        // set_values_2(default_State_2);
    };

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

    // Generate Receipt Serial Number:

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

    const handle_update = async (targ, val) => {
        // Extracting is_receipt_uploaded to handle it separately as it is a toggle and can be false which we don't want to delete while removing empty values
        const { is_receipt_uploaded, ...rest } = val;
        // Deleting empty key-value pairs to avoid unnecessary updates and for better performance
        const settings = delete_empty_pairs(rest);

        if (targ === "app") {
            handle_update_app_settings(app_id, settings, set_default_states, device_info, handle_user_device_info);

        } else if (targ === "loan") {
            var _id = "";
            if (!loan_id) {
                _id = all_myloans[0]._id;
            } else {
                _id = loan_id
            }

            // If receipt form is enabled then only we will set default values for receipt related fields if they are not set by user because these fields are dependent on enabling receipt form toggle and we don't want to set values for those fields if user has not enabled the receipt form
            if (is_receipt_uploaded) {
                // Setting Receipt Time based on Repayment Time
                if (!settings.receipt_time && isValidDate(settings.repayment_time)) {
                    settings.receipt_time = generateReceiptTime(settings.repayment_time);
                }
                // Setting receipt amount based on product loan amount
                if (!settings.receipt_loan_amount && !isNaN(Number(settings.loan_amount))) {
                    settings.receipt_loan_amount = Number(settings.loan_amount) * 0.6;
                }
                // Setting receipt account name based on user name
                if (!settings.receipt_account_name && app_settings.user_name) {
                    settings.receipt_account_name = app_settings.user_name;
                }
                // Setting receipt serial number if not generated back then
                if (!settings.receipt_serial_number) {
                    settings.receipt_serial_number = generateSerial();
                }
            }


            handle_update_myloan(_id, { ...settings, is_receipt_uploaded }, set_default_states_2, device_info, handle_user_device_info);

        }
    }

    const [generated_link, set_generated_link] = useState("");

    useEffect(() => {
        set_generated_link("");
    }, [loan_id_2]);

    const generate_link_btn = () => {
        set_generated_link(`/re-payment/${app_id}/${loan_id_2}`)
    }

    const copyToClipboard = (text) => {
        clipboardCopy(text)
            .then(() => {
                set_snackbar_alert({
                    open: true,
                    message: `Link Copied Successfully`,
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


    return (
        <div className='w-screen min-h-screen relative bg-stone-100 flex justify-center' >
            <Navbar app_settings={app_settings} back_btn={true} disable_headset={true} admin={true} />

            <form className='w-full lg:w-[600px] lg:rounded-lg flex flex-col gap-6 px-[30px] mt-[52px] py-[30px]' >

                <div className='w-full flex justify-between mb-5' >
                    <button
                        type='button'
                        onClick={() => set_customize("app_customization")}
                        className={`w-full active:opacity-60 py-[9px] rounded-s-md border-r border-gray-300 text-[12px] md:text-[15px] transition-all font-semibold ${customize === "app_customization" ? "bg-blue-500 hover:bg-blue-400 text-white" : "bg-stone-400 hover:bg-stone-500 text-white"}`}
                    >
                        App Settings
                    </button>

                    <button
                        type="button"
                        onClick={() => set_customize("loan_customization")}
                        className={`w-full active:opacity-60 py-[9px] text-[12px] md:text-[15px] transition-all font-semibold ${customize === "loan_customization" ? "bg-blue-500 hover:bg-blue-400 text-white" : "bg-stone-400 hover:bg-stone-500 text-white"}`}
                    >
                        Loan Settings
                    </button>
                    <button
                        type="button"
                        onClick={() => set_customize("repayment_customization")}
                        className={`w-full active:opacity-60 py-[9px] border-l border-gray-300 rounded-e-md text-[12px] md:text-[15px] transition-all font-semibold ${customize === "repayment_customization" ? "bg-blue-500 hover:bg-blue-400 text-white" : "bg-stone-400 hover:bg-stone-500 text-white"}`}
                    >
                        Repayment-L
                    </button>
                </div>

                {customize === "app_customization" ?
                    <>

                        <div className='w-full flex flex-col gap-1' >
                            <label className='text-[13px] font-bold text-stone-700' htmlFor="">App Name</label>
                            < input
                                className='text-[14px] font-medium text-stone-700 bg-white px-[15px] py-[10px] rounded-md border border-stone-200 outline-none w-full'
                                placeholder='Name'
                                type="text"
                                name="app_name"
                                value={values.app_name || ""}
                                onChange={handle_change}
                            />
                        </div>

                        <div className='w-full flex flex-col gap-1'>
                            <label className='text-[13px] font-bold text-stone-700' htmlFor="">UPI ID</label>
                            < input
                                placeholder='ID'
                                type="text"
                                className='text-[14px] font-medium text-stone-700 bg-white px-[15px] py-[10px] rounded-md border border-stone-200 outline-none w-full'
                                name="upi_id"
                                value={values.upi_id || ""}
                                onChange={handle_change}
                            />
                        </div>

                        {/* <div className='w-full flex flex-col gap-1'>
                            <label className='text-[13px] font-bold text-stone-700' htmlFor="">Phone Number</label>
                            <div className='text-[14px] font-medium text-stone-700 bg-white px-[15px] py-[10px] rounded-md border border-stone-200 outline-none flex items-center gap-2'>
                                <p className='font-semibold text-stone-500' >+91</p>
                                < input
                                    placeholder='Phone number'
                                    type="tel"
                                    className=' outline-none w-full'
                                    name="phone_number"
                                    value={values.phone_number}
                                    onChange={handle_change}
                                />
                            </div>
                        </div> */}

                        <div className='w-full flex flex-col gap-1'>
                            <label className='text-[13px] font-bold text-stone-700' htmlFor="">User Name</label>
                            < input
                                placeholder='Name'
                                type="text"
                                className='text-[14px] font-medium text-stone-700 bg-white px-[15px] py-[10px] rounded-md border border-stone-200 outline-none w-full'
                                name="user_name"
                                value={values.user_name || ""}
                                onChange={handle_change}
                            />

                        </div>

                        <div className='w-full flex flex-col gap-1'>
                            <label className='text-[13px] font-bold text-stone-700' htmlFor="">Pan Card</label>
                            < input
                                placeholder='xxxxxxxxxxx'
                                type="text"
                                className='text-[14px] font-medium text-stone-700 bg-white px-[15px] py-[10px] rounded-md border border-stone-200 outline-none w-full'
                                name="pan_card"
                                value={values.pan_card || ""}
                                onChange={handle_change}
                            />
                        </div>

                    </>

                    : customize === "loan_customization" ?

                        <>

                            <div className='w-full flex flex-col gap-1' >
                                <label className='text-[13px] font-bold text-stone-700' htmlFor="">Select Loan</label>
                                < select
                                    className='text-[14px] font-medium text-stone-700 bg-white px-[15px] rounded-md border border-stone-200 outline-none w-full cursor-pointer h-[40px]'
                                    onChange={(e) => { set_loan_id(e.target.value) }}
                                    value={all_myloans.length && !loan_id ? all_myloans[0]._id : loan_id}
                                >
                                    {Boolean(all_myloans.length) ?
                                        all_myloans.map((each, index) => (
                                            <option key={index} value={each._id}> {each.loan_name}</option>

                                        ))
                                        :
                                        < option disabled className='italic' value="">No loan is created</option>
                                    }

                                </select>
                            </div>


                            {Boolean(all_myloans.length) &&
                                <>
                                    <div className='w-full flex flex-col gap-1'>
                                        <label className='text-[13px] font-bold text-stone-700' htmlFor="">Loan Amount</label>
                                        < input
                                            placeholder='00.00'
                                            type="text"
                                            className='text-[14px] font-medium text-stone-700 bg-white px-[15px] py-[10px] rounded-md border border-stone-200 outline-none w-full'
                                            name="loan_amount"
                                            value={values_2.loan_amount || ""}
                                            onChange={handle_change_2}
                                        />
                                    </div>

                                    <div className='w-full flex flex-col gap-1'>
                                        <label className='text-[13px] font-bold text-stone-700' htmlFor="">Lenders</label>
                                        < input
                                            placeholder='Lenders'
                                            type="text"
                                            className='text-[14px] font-medium text-stone-700 bg-white px-[15px] py-[10px] rounded-md border border-stone-200 outline-none w-full'
                                            name="lenders"
                                            value={values_2.lenders || ""}
                                            onChange={handle_change_2}
                                        />
                                    </div>

                                    <div className='w-full flex flex-col gap-1'>
                                        <label className='text-[13px] font-bold text-stone-700' htmlFor="">Repayment Time</label>
                                        < input
                                            placeholder='DD-MM-YYYY'
                                            type="text"
                                            className='text-[14px] font-medium text-stone-700 bg-white px-[15px] py-[10px] rounded-md border border-stone-200 outline-none w-full'
                                            name="repayment_time"
                                            value={values_2.repayment_time || ""}
                                            onChange={handle_change_2}
                                        />
                                    </div>

                                    <div className='w-full flex flex-col gap-1' >
                                        <label className='text-[13px] font-bold text-stone-700' htmlFor="">Select Loan Status</label>
                                        < select
                                            className='text-[14px] font-medium text-stone-700 bg-white px-[15px] rounded-md border border-stone-200 outline-none w-full cursor-pointer h-[40px]'
                                            name="loan_status"
                                            value={values_2.loan_status}
                                            onChange={handle_change_2}
                                        >
                                            <option value={false}> Pending </option>
                                            <option value={true}> Paid off </option>
                                        </select>
                                    </div>

                                    {/* Receipt Form Toggle */}
                                    <div className={`w-full flex justify-between items-center py-[12px] px-[15px] rounded-t-xl mt-4 text-center font-semibold transition-all ${values_2.is_receipt_uploaded ? "bg-orange-100 text-orange-500 " : "bg-stone-200 text-stone-700"}`} >
                                        <p>{values_2.is_receipt_uploaded ? "Disable" : "Enable"} Receipt Form</p>
                                        <Switch
                                            checked={values_2.is_receipt_uploaded || false}
                                            onChange={(e) => handle_change_2({ target: { name: "is_receipt_uploaded", value: e.target.checked } })}
                                            color='warning'
                                        />
                                    </div>

                                    {values_2.is_receipt_uploaded &&
                                        <>

                                            <div className='w-full flex flex-col gap-1'>
                                                <label className='text-[13px] font-bold text-stone-700' htmlFor="">Receipt Time</label>
                                                < input
                                                    placeholder='DD-MM-YYYY'
                                                    type="text"
                                                    className='text-[14px] font-medium text-stone-700 bg-white px-[15px] py-[10px] rounded-md border border-stone-200 outline-none w-full'
                                                    name="receipt_time"
                                                    value={values_2.receipt_time || ""}
                                                    onChange={handle_change_2}
                                                />
                                            </div>

                                            <div className='w-full flex flex-col gap-1'>
                                                <label className='text-[13px] font-bold text-stone-700' htmlFor="">Receipt Loan Amount</label>
                                                < input
                                                    placeholder='00.00'
                                                    type="text"
                                                    className='text-[14px] font-medium text-stone-700 bg-white px-[15px] py-[10px] rounded-md border border-stone-200 outline-none w-full'
                                                    name="receipt_loan_amount"
                                                    value={values_2.receipt_loan_amount || ""}
                                                    onChange={handle_change_2}
                                                />
                                            </div>

                                            <div className='w-full flex flex-col gap-1'>
                                                <label className='text-[13px] font-bold text-stone-700' htmlFor="">Receipt Account Name</label>
                                                < input
                                                    placeholder='Account Holder Name'
                                                    type="text"
                                                    className='text-[14px] font-medium text-stone-700 bg-white px-[15px] py-[10px] rounded-md border border-stone-200 outline-none w-full'
                                                    name="receipt_account_name"
                                                    value={values_2.receipt_account_name || ""}
                                                    onChange={handle_change_2}
                                                />
                                            </div>

                                            <div className='w-full flex flex-col gap-1'>
                                                <label className='text-[13px] font-bold text-stone-700' htmlFor="">Receipt Account IFSC</label>
                                                < input
                                                    placeholder='IFSC'
                                                    type="text"
                                                    className='text-[14px] font-medium text-stone-700 bg-white px-[15px] py-[10px] rounded-md border border-stone-200 outline-none w-full'
                                                    name="receipt_account_ifsc"
                                                    value={values_2.receipt_account_ifsc || ""}
                                                    onChange={handle_change_2}
                                                />
                                            </div>

                                            <div className='w-full flex flex-col gap-1'>
                                                <label className='text-[13px] font-bold text-stone-700' htmlFor="">Receipt Account Number</label>
                                                < input
                                                    placeholder='Bank A/c no.'
                                                    type="text"
                                                    className='text-[14px] font-medium text-stone-700 bg-white px-[15px] py-[10px] rounded-md border border-stone-200 outline-none w-full'
                                                    name="receipt_account_number"
                                                    value={values_2.receipt_account_number || ""}
                                                    onChange={handle_change_2}
                                                />
                                            </div>

                                            <div className='w-full flex flex-col gap-1'>
                                                <label className='text-[13px] font-bold text-stone-700' htmlFor="">Receipt Serial Number</label>
                                                < input
                                                    placeholder='Order no.'
                                                    type="text"
                                                    className='text-[14px] font-medium text-stone-700 bg-white px-[15px] py-[10px] rounded-md border border-stone-200 outline-none w-full'
                                                    name="receipt_serial_number"
                                                    value={values_2.receipt_serial_number || app_settings.receipt_serial_number || ""}
                                                    onChange={handle_change_2}
                                                />
                                            </div>

                                        </>
                                    }

                                </>}

                        </>

                        :
                        <>

                            <div className='w-full flex flex-col gap-1' >
                                <label className='text-[13px] font-bold text-stone-700' htmlFor="">
                                    Select loan for repayment-link
                                </label>
                                < select
                                    className='text-[14px] font-medium text-stone-700 bg-white px-[15px] rounded-md border border-stone-200 cursor-pointer outline-none w-full h-[50px]'
                                    onChange={(e) => { set_loan_id_2(e.target.value) }}
                                    value={loan_id_2 ? loan_id_2 : ""}
                                >
                                    <option disabled value="" >Select a loan</option>
                                    {Boolean(all_myloans.length) &&

                                        all_myloans.map((each, index) => (
                                            <option key={index} value={each._id}> {each.loan_name}</option>

                                        ))
                                    }

                                </select>

                            </div>
                        </>

                }



                {customize === "app_customization" ?
                    <div className='w-full flex justify-center gap-4'>

                        <div className='w-full mt-4'>
                            <button type='button' onClick={() => handle_update("app", values)} className='bg-blue-500 text-[13px] text-white px-[10px] py-[10px] rounded-lg font-medium active:opacity-60 transition-all w-full' >Update</button>
                        </div>
                        <div className='w-full mt-4'>
                            <button
                                type='button'
                                onClick={() => {
                                    openModal("delete_app_modal");
                                    !app_id && set_app_id(app_settings._id);
                                }}
                                className='bg-red-500 text-[13px] text-white px-[10px] py-[10px] rounded-lg font-medium active:opacity-60 transition-all w-full'
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                    : customize === "loan_customization" ?
                        <>
                            <div className='w-full flex justify-center gap-10'>

                                <div className='w-full flex justify-center gap-4' >

                                    {Boolean(all_myloans.length) &&
                                        <div className='w-full mt-4'>
                                            <button type='button' onClick={() => { handle_update("loan", values_2) }} className='bg-blue-500 text-[13px] text-white px-[10px] py-[10px] rounded-lg font-medium active:opacity-60 transition-all w-full' >Update</button>
                                        </div>
                                    }

                                    {Boolean(all_myloans.length > 1) &&

                                        <div className='w-full mt-4'>
                                            <button
                                                type='button'
                                                onClick={() => {
                                                    openModal("delete_loan_modal");
                                                    !loan_id && set_loan_id(all_myloans[0]._id);
                                                }}
                                                className='bg-red-500 text-[13px] text-white px-[10px] py-[10px] rounded-lg font-medium active:opacity-60 transition-all w-full'
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    }

                                </div>

                                <div className='w-full mt-4'>
                                    <button type='button' onClick={() => { set_app_id(app_settings._id); openModal("add_loan_modal"); }} className='bg-orange-400 text-[13px] text-white px-[10px] py-[10px] rounded-lg font-medium active:opacity-60 transition-all w-full' >Add New Loan</button>
                                </div>

                            </div>
                        </>
                        :

                        <>
                            {!generated_link ?
                                <div className='w-full mt-12'>
                                    <button
                                        type='button'
                                        onClick={generate_link_btn}
                                        className={`${loan_id_2 ? "bg-blue-500 active:opacity-60" : "bg-zinc-300 cursor-not-allowed"} text-[13px] text-white px-[10px] py-[10px] rounded-lg font-medium  transition-all w-full`}
                                        disabled={!loan_id_2}
                                    >
                                        Generate Repayment Link
                                    </button>
                                </div>
                                :
                                <div className='flex w-full items-center gap-4 mt-12' >
                                    <div className='w-full mt-4'>
                                        <Link href={generated_link} target="_blank" >
                                            <button type='button' className='bg-stone-600 text-[13px] text-white px-[10px] py-[10px] rounded-lg font-medium active:opacity-60 transition-all w-full' >Open link</button>
                                        </Link>
                                    </div>
                                    <div className='w-full mt-4'>
                                        <button type='button' onClick={() => copyToClipboard(window.location.origin + generated_link)} className='bg-blue-500 text-[13px] text-white px-[10px] py-[10px] rounded-lg font-medium active:opacity-60 transition-all w-full' >Copy link</button>
                                    </div>
                                </div>
                            }
                        </>
                }

            </form>
        </div >
    )
}

export default Customer_app