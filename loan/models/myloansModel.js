import { Schema, Types, connection } from "mongoose"

const myloansSchema = new Schema(
    {
        loan_name: {
            type: String,
        },
        loan_amount: {
            type: String,
            default: "00",
        },
        lenders: {
            type: String,
            default: "Lenders",
        },
        repayment_time: {
            type: String,
            default: "DD-MM-YYYY",
        },
        loan_status: {
            type: Boolean,
            default: false,
        },
        customer_id: {
            type: String
        },
        
        receipt_time: {
            type: String
        },
        receipt_loan_amount: {
            type: String,

        },
        receipt_account_name: {
            type: String
        },
        receipt_account_ifsc: {
            type: String
        },
        receipt_account_number: {
            type: String
        },
        receipt_serial_number: {
            type: String
        }
    },
    { timestamps: true });

const Db = connection.useDb("Loan");
const Myloans = Db.models.Myloans || Db.model('Myloans', myloansSchema);
export default Myloans

