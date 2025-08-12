import React, { useEffect, useState } from 'react'
import Navbar from './utilities/Navbar'
import Image from 'next/image'
import login_vector from "@/public/images/login_vector.png";
import { FaCheck } from "react-icons/fa6";
import { setCookie } from 'cookies-next';
import useStateContext from '@/context/ContextProvider';
import { useRouter } from 'next/router';
import NotificationsIcon from '@mui/icons-material/Notifications';

const Login = ({ app_settings }) => {

    const { setAPIloading } = useStateContext();


    const router = useRouter();

    const [animation, set_animation] = useState(true);



    const [step, set_step] = useState("1");

    useEffect(() => {
        if (step === "2") {
            setTimeout(() => {
                set_animation(false);
            }, 2000)
        }
    }, [step])

    const [phone, set_phone] = useState({
        number: "",
        errors: {
            number: ""
        }
    })

    const handle_input_change = (e) => {
        const { name, value } = e.target;
        set_phone((prev) => ({ ...prev, [name]: value }));
    }
    const regex = (/^\d{10}$/);
    const verify_input = (value) => {
        let error = "";
        if (!value) {
            error = "Please enter a Phone number!"
        }
        if (value && !regex.test(value)) {
            error = "Not a valid Phone number!"
        }
        return error;
    }


    const handle_input_blur = (e) => {
        const { name, value } = e.target;
        const error = verify_input(value);

        set_phone((prev) => ({
            ...prev, errors: {
                ...prev.errors,
                [name]: error
            }
        }))

    }


    const handle_login_btn = (mock) => {

        const appId = router.query.app_id;
        if (!appId) return;

        setAPIloading(true);


        setTimeout(() => {
            if (mock === "2") {
                set_step("2");
                setAPIloading(false);

            } else if (mock === "3") {
                // cookie expires in 1 days
                const expiryDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
                // now setting that user in cookies
                setCookie("user_account", "user is logged in!", { expires: expiryDate });
                router.push(`/home/${router.query.app_id}`);

            } else {
                setAPIloading(false);
            }
        }, 1000)
    }



    return (
        <div className='w-screen min-h-[calc(100vh-52px)] relative bg-emerald-400' >
            <Navbar app_settings={app_settings} disable_headset={true} />
            <div className='flex flex-col mt-[52px] w-full min-h-[calc(100vh-52px)] justify-center'>

                <div className={`flex-[2.6] bg-emerald-400 relative`} >
                    <div className={`absolute bottom-[-60px] left-0 right-0  mx-auto
                    ${step === "1" ? "w-[90%]" : (step === "2" && animation ? "w-[80%]" : "w-[90%]")} transition-all`}>
                        <Image src={login_vector} alt="loan_vector" className='object-contain' />
                    </div>
                </div>

                <div className='flex-1 bg-stone-50  rounded-t-2xl px-[20px] py-[25px] z-10 flex-col flex gap-5' >

                    {step === "1" &&
                        <p className='text-[15px] text-stone-800 font-normal' >Hello, welcome to {app_settings && app_settings.app_name}</p>
                    }
                    {step === "2" && animation ?
                        <p className='text-[15px] text-stone-800 font-normal' >Send the verification code to {phone.number}</p>
                        :
                        <>
                            {step !== "1" &&
                                < p className='text-[15px] text-stone-800 font-normal' >To login, click on login button</p>
                            }
                        </>

                    }


                    {step === "1" &&
                        <div className='flex w-full flex-col gap-2' >
                            <div className={`flex items-center gap-2 bg-emerald-50 rounded-lg px-[10px] py-[15px] text-[14px] font-normal  border ${phone.errors.number ? "border-red-500 text-red-500" : "border-transparent text-stone-600"}`} >
                                +91
                                <input
                                    value={phone.number}
                                    onChange={handle_input_change}
                                    onBlur={handle_input_blur}
                                    placeholder='Please enter a telephone number'
                                    type="tel"
                                    name="number"
                                    className='outline-none bg-emerald-50 w-full caret-stone-400 text-stone-600'
                                />
                            </div>
                            {phone.errors.number &&
                                <p className='text-[11px] text-red-500 font-normal pl-4' >{phone.errors.number}</p>

                            }

                            <p className='text-[12px] text-stone-400 font-normal' >Phone number (e.g. xxxxxxxxxx)</p>
                        </div>
                    }

                    {step === "2" &&
                        <>
                            {animation ?
                                <div className='flex w-full flex-col gap-2' >
                                    <div className={`flex items-center gap-2 bg-emerald-50 rounded-lg px-[10px] py-[15px] text-[14px] font-normal  text-stone-600`} >
                                        <input
                                            placeholder='Enter the 4-digit verification code'
                                            type="tel"
                                            className='outline-none bg-emerald-50 w-full caret-stone-400 text-stone-600'
                                        />

                                        <span onClick={() => handle_login_btn("mock")} className='text-emerald-400 text-[12px]' >Send</span>
                                    </div>


                                    <p className='text-[12px] text-amber-500 font-normal flex items-center' >
                                        <NotificationsIcon className='scale-[.65]' />
                                        Please do not share the code with others
                                    </p>

                                    <div className={`flex items-center gap-2 bg-emerald-50 rounded-lg px-[10px] py-[15px] text-[14px] font-normal  text-stone-600`} >
                                        <input
                                            placeholder='Please set a password, 8-16 characters'
                                            type="password"
                                            value=""
                                            className='outline-none bg-emerald-50 w-full caret-stone-400 text-stone-600'
                                        />


                                    </div>
                                </div>
                                :
                                <div className='flex items-center justify-center gap-3 bg-emerald-100 rounded-xl px-[10px] py-[25px] text-[15px] font-normal text-zinc-400 mb-2 select-none' >
                                    Your login information is saved

                                    <div className='bg-white p-[5px] rounded-md text-emerald-400' >
                                        <FaCheck />
                                    </div>

                                </div>
                            }
                        </>
                    }

                    {step === "1" &&
                        <button
                            disabled={!regex.test(phone.number)}
                            onClick={() => handle_login_btn("2")}
                            className={`text-white text-[17px] font-normal py-[14px] rounded-2xl transition-all ${regex.test(phone.number) ? "bg-emerald-400 cursor-pointer active:opacity-60" : "bg-stone-200 cursor-auto"}`}
                        >
                            Next step
                        </button>
                    }


                    {(step === "2") &&
                        <>
                            {animation ?
                                <button className='text-white text-[17px] font-normal bg-stone-200 py-[14px] rounded-2xl' >
                                    Next step
                                </button>
                                :
                                <button onClick={() => handle_login_btn("3")} className='text-white text-[17px] font-normal bg-emerald-400 py-[14px] rounded-2xl active:opacity-60 transition-all' >
                                    Login
                                </button>
                            }
                        </>
                    }

                    <p className='text-[12px] text-stone-400 font-normal' >Signing in means you agree to the <span onClick={() => handle_login_btn("mock")} className='text-emerald-400' >{`{{ Privacy Policy }}`}</span></p>
                </div>
            </div>

        </div >
    )
}

export default Login