import connectMongo from "@/utils/functions/connectMongo";
import Settings from "@/models/settingsModel";
import Myloans from "@/models/myloansModel";

/**
 * @param {import('next').NextApiRequest} req 
 * @param {import('next').NextApiResponse} res 
 */
export default async function handler(req, res) {
  try {
    await connectMongo();

    // Get all customers
    const customers = await Settings.find().sort({ createdAt: -1 }).lean();

    if (customers.length === 0) {
      return res.status(200).json(customers);
    }

    // Get all loans in one query
    const allLoans = await Myloans.find({
      customer_id: { $in: customers.map(c => c._id) }
    }).lean();

    // Group loans by customer_id
    const loanMap = {};
    for (const loan of allLoans) {
      const cid = loan.customer_id.toString();
      if (!loanMap[cid]) {
        loanMap[cid] = { total_loan_amount: 0, total_paid_amount: 0 };
      }
      loanMap[cid].total_loan_amount += Number(loan.loan_amount);
      if (loan.loan_status) {
        loanMap[cid].total_paid_amount += Number(loan.loan_amount);
      }
    }

    // Merge loan data into customers
    const customersWithLoans = customers.map(customer => {
      const cid = customer._id.toString();
      return {
        ...customer,
        total_loan_amount: loanMap[cid]?.total_loan_amount || 0,
        total_paid_amount: loanMap[cid]?.total_paid_amount || 0,
      };
    });

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