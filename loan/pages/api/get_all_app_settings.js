import connectMongo from "@/utils/functions/connectMongo";
import Settings from "@/models/settingsModel";
import mongoose from "mongoose";

/**
 * @param {import('next').NextApiRequest} req 
 * @param {import('next').NextApiResponse} res 
 */
export default async function handler(req, res) {
  try {
    await connectMongo();

    const page = parseInt(req.query.page) || 1; // default page = 1
    const limit = parseInt(req.query.limit) || 100; // default 100 results per request
    const skip = (page - 1) * limit;
    const search_params = req.query.search_params || null;

    // ✅ Build dynamic search query
    let searchQuery = {};

    if (search_params) {
      const regex = new RegExp(search_params, "i");

      // Start with normal string fields
      searchQuery = {
        $or: [
          { user_name: regex },
          { pan_card: regex },
          { app_name: regex },
          { upi_id: regex },
        ],
      };

      // ✅ Check if the search_params is a valid ObjectId
      if (mongoose.Types.ObjectId.isValid(search_params)) {
        searchQuery.$or.push({ _id: new mongoose.Types.ObjectId(search_params) });
      }
    }

    const customersWithLoans = await Settings.aggregate([
      { $match: searchQuery }, // ✅ Apply search query
      { $sort: { createdAt: -1 } },
      { $skip: skip }, // ✅ Add skip
      { $limit: limit }, // ✅ Add limit
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

    const totalDocuments = await Settings.countDocuments(); // ✅ Total saved customers

    return res.status(200).json({
      data: customersWithLoans,
      total: totalDocuments,
      currentPage: page,
      totalPages: Math.ceil(totalDocuments / limit),
    });

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
