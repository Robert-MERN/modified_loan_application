import React, { useEffect, useState } from 'react'
import style from "@/styles/Home.module.css"
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, IconButton } from '@mui/material';
import useStateContext from '@/context/ContextProvider';


const Borrow_amount_modal = ({ open, close }) => {


    const { borrow_amount, set_borrow_amount, } = useStateContext();



    const handle_select_amount = (params) => {
        set_borrow_amount(params);
        close();
    }


    const amounts = [
        "55,000.00",
        "45,000.00",
        "35,000.00",
        "25,000.00",
        "15,000.00",
        "5,000.00"
    ]
    return (
        <Dialog
            open={open.borrow_amount_modal}
            onClose={close}
            className='overflow-hidden'
        >

            <div className={`h-fit md:w-[500px] xl:h-[450px] p-5 md:p-7 pt-8 md:pt-12 pb-6 relative flex flex-col gap-4 md:gap-10 justify-between overflow-x-hidden ${style.scrollBar}`} >
                <div
                    onClick={close}
                    className='absolute right-3 top-2 cursor-pointer select-none'
                >
                    <IconButton >
                        <CloseIcon className='scale-[.9] md:scale-[1.1] text-stone-500' />
                    </IconButton>
                </div>


                <div>
                    <div className="flex flex-col w-full mt-4 md:mt-6 gap-2 md:gap-4">
                        <React.Fragment>
                            <label htmlFor="" className='text-[12px] md:text-[14px] text-stone-500 font-semibold mb-2'>
                                Please Select a Loan Amount
                            </label>

                            <div className="flex flex-col w-full gap-4">
                                {amounts.map((amount, i) => (
                                    < button key={i} onClick={() => handle_select_amount(amount)} className={`py-[10px] text-[12px] md:text-[14px] hover:bg-emerald-400 hover:text-white w-full rounded-md select-none flex gap-3 px-4 items-center text-center justify-center font-bold ${borrow_amount === amount ? "bg-emerald-400 text-white" : "bg-stone-300 text-stone-600"}`} >
                                        ₹ {amount}
                                    </button>
                                ))
                                }
                            </div >
                        </React.Fragment>

                        < label htmlFor="" className='text-[11px] md:text-[13px] text-stone-500 md:mt-6 mt-4' > Please note that amount cannot increase the product amount. It depends on your credit score </label>

                    </div>
                </div>


            </div>

        </Dialog>

    )
}

export default Borrow_amount_modal