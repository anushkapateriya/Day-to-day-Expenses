const cashfree = require("../config/cashfree");
const Order = require("../models/order");
const User = require("../models/user");

const createOrder = async (req, res) => {

    try {

        const orderId = "order_" + Date.now();

        const orderAmount = 100;

        const request = {
            order_amount: orderAmount,
            order_currency: "INR",
            order_id: orderId,

            customer_details: {
                customer_id: "user_" + req.userId,
                customer_name: "User",
                customer_email: "user@example.com",
                customer_phone: "9999999999"
            },

            order_meta: {
                return_url:
                    "http://127.0.0.1:5500/frontend/expense.html?order_id={order_id}"
            }
        };

        const response = await cashfree.PGCreateOrder(request);

        await Order.create({
            orderId: orderId,
            status: "PENDING",
            UserId: req.userId
        });

        res.status(200).json({
            message: "Order created successfully",
            orderId: orderId,
            paymentSessionId: response.data.payment_session_id
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Something went wrong"
        });
    }
};

const verifyPayment = async (req, res) => {

    const orderId = req.query.order_id;

    try {

        const response = await cashfree.PGOrderFetchPayments(orderId);

        const payments = response.data;

        const order = await Order.findOne({
            where: {
                orderId: orderId,
                UserId: req.userId
            }
        });

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        if (payments.length > 0) {

            const paymentStatus = payments[0].payment_status;

            if (paymentStatus === "SUCCESS") {

                order.status = "SUCCESSFUL";
                await order.save();

                const user = await User.findByPk(req.userId);

                user.isPremium = true;
                await user.save();

                return res.status(200).json({
                    message: "Transaction successful"
                });
            }

            if (paymentStatus === "FAILED") {

                order.status = "FAILED";
                await order.save();

                return res.status(200).json({
                    message: "TRANSACTION FAILED"
                });
            }
        }

        return res.status(200).json({
            message: "Payment is still pending"
        });


    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Something went wrong"
        });
    }
};



module.exports = {
    createOrder,
    verifyPayment
};