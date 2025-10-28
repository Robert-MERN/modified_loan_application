import React from 'react'
import useStateContext from "@/context/ContextProvider";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Slide } from '@mui/material';
import Repayment_link_modal from '@/utils/modals/Repayment_link_modal';
import Borrow_amount_modal from '@/utils/modals/Borrow_amount_modal';
import styles from "@/styles/Home.module.css";
import Delete_loan_modal from '@/utils/modals/Delete_loan_modal';
import Add_loan_modal from '@/utils/modals/Add_loan_modal';
import Delete_app_modal from '@/utils/modals/Delete_app_modal';
import Logout_modal from '@/utils/modals/Logout_modal';



const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


function TransitionDown(props) {
    return <Slide {...props} direction="down" />;
}



const Layout = ({ children }) => {

    const {
        modals,
        closeModal,
        APIloading,
        snackbar_alert,
        set_snackbar_alert,
        set_loan_id,
        set_loan_id_2,
        set_app_id,
    } = useStateContext();

    const handleClose = () => {
        set_snackbar_alert(prev => ({ ...prev, open: false }));
    };





    return (
        <div className={`relative  ${styles.scrollBar}`} >
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 999 }}
                open={APIloading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>


            <Repayment_link_modal open={modals} close={() => closeModal("repayment_link_modal")} />

            <Borrow_amount_modal open={modals} close={() => closeModal("borrow_amount_modal")} />

            <Delete_loan_modal open={modals} close={() => closeModal("delete_loan_modal")} />

            <Add_loan_modal open={modals} close={() => closeModal("add_loan_modal")} />

            <Delete_app_modal open={modals} close={() => closeModal("delete_app_modal")} />

            <Logout_modal
                open={modals}
                close={() => closeModal("delete_app_modal")}
                set_loan_id={set_loan_id}
                set_loan_id_2={set_loan_id_2}
                set_app_id={set_app_id}
            />

            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                TransitionComponent={TransitionDown}
                key={TransitionDown ? TransitionDown.name : ''}
                open={snackbar_alert.open}
                autoHideDuration={10000}
                onClose={handleClose}>
                <Alert onClose={handleClose} severity={snackbar_alert.severity} sx={{ width: '100%' }}>
                    {snackbar_alert.message}
                </Alert>
            </Snackbar>

            {children}
        </div>
    )
}

export default Layout