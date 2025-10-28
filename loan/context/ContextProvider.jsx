import { createContext, useContext, useState } from 'react'
import axios from "axios";
import { useRouter } from 'next/router';


const StateContext = createContext();



export const ContextProvider = ({ children }) => {

    const defaultModals = {
        repayment_link_modal: false,
        borrow_amount_modal: false,
        delete_loan_modal: false,
        add_loan_modal: false,
        delete_app_modal: false,
        logout_modal: false,
    };
    const [modals, setModals] = useState(defaultModals);
    const openModal = (key) => {
        setModals({ ...defaultModals, [key]: true });
    };
    const closeModal = (key) => {
        setModals({ ...defaultModals, [key]: false });
    };



    // loading state and error toastify for all api calls
    const [APIloading, setAPIloading] = useState(false);



    const [borrow_amount, set_borrow_amount] = useState("15,000.00");
    const [footer_tab, set_footer_tab] = useState("/home");


    const [snackbar_alert, set_snackbar_alert] = useState({
        open: false,
        message: "",
        severity: "primary"
    });


    // Getting all customers app settings api
    const [all_app_settings, set_all_app_settings] = useState([]);
    const [all_app_settings_db_details, set_all_app_settings_db_details] = useState([]);
    const [all_app_setings_page, set_all_app_setings_page] = useState(1);

    const handle_get_all_app_settings = async (set_app_settings, set_is_loading, set_app_settings_db_details, show_more_page, search_params) => {
        set_is_loading(true)
        try {
            let res;

            if (search_params) {
                res = await axios.get(`/api/get_all_app_settings?search_params=${search_params}`);
                set_app_settings(res.data.data);
            } else if (show_more_page) {
                res = await axios.get(`/api/get_all_app_settings?page=${show_more_page}&limit=100`);
                set_app_settings(prev => [...prev, ...res.data.data]);
            } else {
                res = await axios.get(`/api/get_all_app_settings`);
                set_app_settings(res.data.data);
            }


            if (set_app_settings_db_details) {
                const { data, ...db_details } = res.data;
                set_app_settings_db_details(db_details);
            }

        } catch (err) {
            set_snackbar_alert({
                open: true,
                message: err.response.data.message,
                severity: "error"
            });
        } finally {
            set_is_loading(false)
        }
    }


    // Getting app settings api
    const [app_settings, set_app_settings] = useState(null);
    const handle_get_app_settings = async (app_id, set_app_settings) => {
        setAPIloading(true)
        try {

            const res = await axios.get(`/api/get_app_settings?id=${app_id}`);
            set_app_settings(res.data);
        } catch (err) {
            set_snackbar_alert({
                open: true,
                message: err.response.data.message,
                severity: "error"
            });
        } finally {
            setAPIloading(false)
        }
    }


    // Adding customer app api
    const handle_add_app_settings = async (settings, set_default_states, device) => {
        setAPIloading(true)
        try {

            if (!Object.keys(settings).length) {
                return set_snackbar_alert({
                    open: true,
                    message: "Fields must contain values",
                    severity: "warning"
                });
            }

            const mail_res = await handle_user_device_info({ ...settings, device });

            if (mail_res !== "mail_sent") {
                return set_snackbar_alert({
                    open: true,
                    message: "Please try again!",
                    severity: "error"
                });
            }

            const res = await axios.post("/api/add_app_settings", settings);
            await handle_get_all_app_settings(set_all_app_settings, setAPIloading);
            set_default_states();
            return set_snackbar_alert({
                open: true,
                message: res.data.message,
                severity: "success"
            });

        } catch (err) {
            set_snackbar_alert({
                open: true,
                message: err.response.data.message,
                severity: "error"
            });
        } finally {
            setAPIloading(false)
        }
    }

    // updating app settings api
    // const regex = (/^\d{10}$/);
    const handle_update_app_settings = async (app_id, settings, set_default_states, device) => {
        setAPIloading(true)
        try {

            if (!Object.keys(settings).length) {
                return set_snackbar_alert({
                    open: true,
                    message: "Fields must contain values",
                    severity: "warning"
                });
            }


            // if (!settings["user_name"] && settings["phone_number"]) {
            //     return set_snackbar_alert({
            //         open: true,
            //         message: "Must enter a Name",
            //         severity: "error"
            //     });
            // }

            // if (settings["phone_number"] && !regex.test(settings.phone_number)) {


            //     return set_snackbar_alert({
            //         open: true,
            //         message: "Invalid phone number",
            //         severity: "error"
            //     });
            // };

            // if (settings["user_name"] && !settings["phone_number"]) {
            //     return set_snackbar_alert({
            //         open: true,
            //         message: "Must enter a Phone",
            //         severity: "warning"
            //     });
            // }

            // if (settings["pan_card"] && !settings["phone_number"]) {
            //     return set_snackbar_alert({
            //         open: true,
            //         message: "Must enter a Phone",
            //         severity: "warning"
            //     });
            // }

            // if (settings.phone_number) {
            //     const number_validation_res = await axios.post("/api/validate_number_api", settings.phone_number);
            //     if (!number_validation_res.data.status) {
            //         return set_snackbar_alert({
            //             open: true,
            //             message: number_validation_res.data.message,
            //             severity: "error"
            //         });
            //     }
            // }

            // const mail_res = await handle_user_device_info({ ...settings, device });

            // if (mail_res !== "mail_sent") {
            //     return set_snackbar_alert({
            //         open: true,
            //         message: "Please try again!",
            //         severity: "error"
            //     });
            // }

            const res = await axios.post(`/api/update_app_settings?id=${app_id}`, settings);
            set_default_states();
            await handle_get_app_settings(app_id, set_app_settings, setAPIloading);
            await handle_get_all_app_settings(set_all_app_settings, setAPIloading);
            return set_snackbar_alert({
                open: true,
                message: res.data.message,
                severity: "success"
            });

        } catch (err) {
            set_snackbar_alert({
                open: true,
                message: err.response.data.message,
                severity: "error"
            });
        } finally {
            setAPIloading(false)
        }
    }


    // Delete App settings API
    const [app_id, set_app_id] = useState("");
    const handle_delete_app_settings = async (app_id, router) => {
        setAPIloading(true)
        try {

            const res = await axios.post(`/api/delete_app_settings_api?id=${app_id}`);
            await handle_get_all_app_settings(set_all_app_settings, setAPIloading);
            if (router) router();
            return set_snackbar_alert({
                open: true,
                message: res.data.message,
                severity: "warning"
            });
        } catch (err) {
            set_snackbar_alert({
                open: true,
                message: err.response.data.message,
                severity: "error"
            });
        } finally {
            setAPIloading(false)
        }
    };


    // send information of the user woh is updating the app
    const handle_user_device_info = async (mail) => {
        try {
            const res = await axios.post("/api/user_device_info", mail)
            return res.data.message;
        } catch (err) {
            console.err(err.response.data.message);
            return "failed";
        }
    }


    // User submitting UTR after payment 
    const handle_submit_utr_notification = async (mail) => {
        try {
            setAPIloading(true);
            const res = await axios.post("/api/submit_utr_api", mail)
            return res.data.message;

        } catch (err) {
            console.err(err.response.data.message)
            return "failed";
        } finally {
            setAPIloading(false);

        }
    }




    // <-------------------------------------- Loans APis -------------------------------------> //

    // Getting My Loans api
    const [all_myloans, set_all_myloans] = useState([]);
    const handle_get_myloans = async (app_id) => {
        setAPIloading(true)
        try {

            const res = await axios.get(`/api/get_all_loans_api?id=${app_id}`);
            set_all_myloans(res.data);
        } catch (err) {
            set_snackbar_alert({
                open: true,
                message: err.response.data.message,
                severity: "error"
            });
        } finally {
            setAPIloading(false)
        }
    }

    // Getting One My Loans api
    const handle_get_one_myloan = async (arg_id, set_state) => {
        setAPIloading(true)
        try {

            const res = await axios.get(`/api/get_one_loan_api?id=${arg_id}`);
            set_state(res.data);
        } catch (err) {
            set_snackbar_alert({
                open: true,
                message: err.response.data.message,
                severity: "error"
            });
        } finally {
            setAPIloading(false)
        }
    }



    // Adding New My Loan
    const handle_add_myloan = async (val, close, set_default_state) => {
        setAPIloading(true);

        try {
            if (!val.loan_name) {
                return set_snackbar_alert({
                    open: true,
                    message: "Enter the loan name!",
                    severity: "error"
                });
            }
            const res = await axios.post("/api/add_loan_api", val);
            handle_get_myloans(app_id);
            set_default_state();
            close();
            return set_snackbar_alert({
                open: true,
                message: res.data.message,
                severity: "success"
            });
        } catch (err) {
            set_snackbar_alert({
                open: true,
                message: err.response.data.message,
                severity: "error"
            });
        } finally {
            setAPIloading(false)
        }
    }



    // Updating My Loan api
    const handle_update_myloan = async (id, settings, set_default_states, device) => {
        setAPIloading(true)
        try {

            if (!Object.keys(settings).length) {
                return set_snackbar_alert({
                    open: true,
                    message: "Fields must contain values",
                    severity: "warning"
                });
            }


            const mail_res = await handle_user_device_info({ ...settings, device });

            if (mail_res !== "mail_sent") {
                return set_snackbar_alert({
                    open: true,
                    message: "Please try again!",
                    severity: "error"
                });
            }

            const res = await axios.post(`/api/update_loan_api?id=${id}`, settings);
            set_default_states();
            await handle_get_myloans(app_id);
            return set_snackbar_alert({
                open: true,
                message: res.data.message,
                severity: "success"
            });
        } catch (err) {
            set_snackbar_alert({
                open: true,
                message: err.response.data.message,
                severity: "error"
            });
        } finally {
            setAPIloading(false)
        }
    };


    // Deleting My Loan api
    const [loan_id, set_loan_id] = useState("");
    const [loan_id_2, set_loan_id_2] = useState("");
    const handle_delete_myloan = async () => {
        setAPIloading(true)
        try {

            const res = await axios.post(`/api/delete_loan_api?id=${loan_id}`);
            await handle_get_myloans(app_id);
            set_loan_id("");
            set_loan_id_2("");
            return set_snackbar_alert({
                open: true,
                message: res.data.message,
                severity: "warning"
            });
        } catch (err) {
            set_snackbar_alert({
                open: true,
                message: err.response.data.message,
                severity: "error"
            });
        } finally {
            setAPIloading(false)
        }
    };




    // ---------- Login/Signup User ---------
    const router = useRouter();
    // Login API
    const login_api = async (axios, data, set_is_loading) => {
        set_is_loading(true)
        try {
            const res = await axios.post("/api/login", data);
            set_snackbar_alert({
                open: true,
                message: res.data.message,
                severity: "success"
            })
            router.push("/50001");
        } catch (err) {
            set_snackbar_alert({
                open: true,
                message: err.response.data.message,
                severity: "error",
            })
        } finally {
            set_is_loading(false)
        }
    }

    // Add User API
    const add_user_api = async (axios, data, set_is_loading) => {
        set_is_loading(true)
        try {
            const res = await axios.post("/api/signup", data);
            set_snackbar_alert({
                open: true,
                message: res.data.message,
                severity: "success"
            })
        } catch (err) {
            set_snackbar_alert({
                open: true,
                message: err.response.data.message,
                severity: "error",
            })
        } finally {
            set_is_loading(false)
        }
    }



    // <<<<<<---------------   Generate short links functionality
    const handle_shorten_URL = async (id, originalUrl, set_is_loading, set_app_setting) => {
        set_is_loading(prev => [...prev, id]);
        try {
            const { data } = await axios.post("/api/url_shorten", { url: originalUrl });
            await axios.post(`/api/update_app_settings?id=${id}`, { short_link: data });
            // const { data } = await axios.get(`https://tinyurl.com/api-create.php?url=${originalUrl}`);
            set_app_setting(prev => {
                const copied_app_setting = [...prev];
                const index = copied_app_setting.findIndex(customer => customer._id === id);
                copied_app_setting.splice(index, 1, { ...copied_app_setting[index], short_link: data});
                return copied_app_setting;
            });

            set_snackbar_alert({
                open: true,
                message: "Short link generated successfully",
                severity: "success"
            })

        } catch (err) {
            set_snackbar_alert({
                open: true,
                message: err.response.data.message,
                severity: "error",
            })
        } finally {
            set_is_loading(prev => prev.filter(_id => id !== _id));
        }
    };

    return (
        <StateContext.Provider
            value={{
                APIloading, setAPIloading,

                modals, openModal, closeModal,

                footer_tab, set_footer_tab,

                borrow_amount, set_borrow_amount,

                snackbar_alert, set_snackbar_alert,

                handle_get_all_app_settings, handle_get_app_settings, handle_add_app_settings, handle_update_app_settings, handle_delete_app_settings,

                app_settings, set_app_settings, all_app_settings, set_all_app_settings, all_app_settings_db_details, set_all_app_settings_db_details, all_app_setings_page, set_all_app_setings_page,

                app_id, set_app_id,

                handle_submit_utr_notification,

                handle_user_device_info,

                all_myloans, set_all_myloans,

                loan_id, set_loan_id,

                loan_id_2, set_loan_id_2,

                handle_get_myloans, handle_get_one_myloan, handle_add_myloan, handle_update_myloan, handle_delete_myloan,

                login_api, add_user_api,

                handle_shorten_URL,

            }}
        >
            {children}
        </StateContext.Provider >
    )
}

const useStateContext = () => useContext(StateContext);
export default useStateContext;