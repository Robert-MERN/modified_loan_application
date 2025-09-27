import connectMongo from "@/utils/functions/connectMongo";
import Settings from "@/models/settingsModel";

/**
 * @param {import('next').NextApiRequest} req 
 * @param {import('next').NextApiResponse} res 
 */
export default async function handler(req, res) {
  try {
    await connectMongo();

    const customersWithLoans = await Settings.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "myloans",
          let: { cid: { $toString: "$_id" } },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$customer_id", "$$cid"] }
              }
            }
          ],
          as: "loans"
        }
      },
      {
        $addFields: {
          total_loan_amount: {
            $sum: {
              $map: {
                input: "$loans",
                as: "l",
                in: {
                  $convert: {
                    input: { $trim: { input: "$$l.loan_amount" } }, // Trim spaces
                    to: "double",
                    onError: 0, // fallback if invalid
                    onNull: 0   // fallback if null
                  }
                }
              }
            }
          },
          total_paid_amount: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$loans",
                    as: "l",
                    cond: "$$l.loan_status"
                  }
                },
                as: "l",
                in: {
                  $convert: {
                    input: { $trim: { input: "$$l.loan_amount" } },
                    to: "double",
                    onError: 0,
                    onNull: 0
                  }
                }
              }
            }
          }
        }
      },
      { $project: { loans: 0 } }
    ]);

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
