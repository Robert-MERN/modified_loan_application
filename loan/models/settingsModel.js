import { Schema, Types, connection } from "mongoose"

const settingSchema = new Schema(
    {
        app_name: {
            type: String,
        },
        upi_id: {
            type: String,
        },
        user_name: {
            type: String,
        },
        phone_number: {
            type: String,
        },
        pan_card: {
            type: String,
        },
    },
    { timestamps: true });

const Db = connection.useDb("Loan");
const Settings = Db.models.Settings || Db.model('Settings', settingSchema);
export default Settings

