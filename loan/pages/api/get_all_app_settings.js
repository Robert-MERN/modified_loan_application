import connectMongo from "@/utils/functions/connectMongo"
import Settings from "@/models/settingsModel";
import Myloans from "@/models/myloansModel";

/**
 * @param {import('next').NextApiRequest} req 
 * @param {import('next').NextApiResponse} res 
 */
export default async function handler(req, res) {
  try {
    await connectMongo();

    const setting = await Settings.find().sort({ createdAt: -1 });

    if (setting.length === 0) {
      return res.status(404).json({ status: false, message: "No customer is created yet" });
    }

    const customers = setting.map(each => each.toObject());

    const customersWithLoans = await Promise.all(
      customers.map(async (customer) => {
        const all_loans = await Myloans.find({ customer_id: customer._id });

        if (all_loans.length > 0) {
          const total_loan_amount = all_loans.reduce(
            (sum, loan) => sum + Number(loan.loan_amount),
            0
          );

          const total_paid_amount = all_loans.reduce(
            (sum, loan) => loan.loan_status ? sum + Number(loan.loan_amount) : sum,
            0
          );

          return {
            ...customer,
            total_loan_amount,
            total_paid_amount,
          };
        }

        return customer;
      })
    );

    return res.status(200).json(customersWithLoans);

  } catch (err) {
    const net_err_msg = "querySrv ENODATA _mongodb._tcp.application.bjwgp.mongodb.net";
    const no_internet = "querySrv ETIMEOUT _mongodb._tcp.application.bjwgp.mongodb.net";
    const slow_internet = "Operation `settings.findOne()` buffering timed out after";

    if (err.message.includes(net_err_msg)) {
      return res.status(501).json({ status: false, message: "No Internet Connection!" });
    } else if (err.message.includes(slow_internet)) {
      return res.status(501).json({ status: false, message: "Unstable Network!" });
    } else if (err.message.includes(no_internet)) {
      return res.status(501).json({ status: false, message: "No Internet!" });
    } else {
      return res.status(501).json({ status: false, message: err.message });
    }
  }
}