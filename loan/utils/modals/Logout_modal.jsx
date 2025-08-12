import React from 'react'
import Dialog from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import { remove_cookie } from '../functions/cookie';
import { useRouter } from 'next/router';



const Logout_modal = ({
    open,
    close,
    set_loan_id,
    set_loan_id_2,
    set_app_id,
}) => {

    const router = useRouter();

    const handle_logout = () => {
        set_loan_id("");
        set_loan_id_2("")
        set_app_id("")
        close();
        remove_cookie("user_account_token")
        router.push("/50001/login");
    };

    return (
        <Dialog
            open={open.logout_modal}
            onClose={close}
        >
            <div className='w-full md:w-[500px]' >
                <div className='w-full flex justify-between items-center pl-[20px] pr-[15px] py-[8px] bg-slate-50' >
                    <p className='text-[15px] md:text-[18px] font-medium text-stone-700 '>
                        Logout
                    </p>
                    <IconButton onClick={close}>
                        <CloseIcon className='scale-[.9] md:scale-[1.1] text-stone-500' />
                    </IconButton>
                </div>
                <p className='text-[13px] md:text-[16px] text-stone-500 font-medium border-b border-stone-300 p-[20px]' >
                    Are you sure do you want to logout?
                </p>
                <div className='w-full flex justify-end gap-3 p-[20px] ' >
                    <button onClick={close} className='bg-slate-200 hover:opacity-85 active:opacity-60 px-[14px] py-[6px] md:py-[8px] rounded text-stone-700 text-[12px] font-medium md:text-[15px] transition-all' >Cancel</button>
                    <button onClick={handle_logout} className='bg-red-600 hover:opacity-85 active:opacity-60 px-[14px] py-[6px] md:py-[8px] rounded text-white text-[12px] font-medium md:text-[15px] transition-all' >Logout</button>
                </div>

            </div>
        </Dialog>
    )
}

export default Logout_modal