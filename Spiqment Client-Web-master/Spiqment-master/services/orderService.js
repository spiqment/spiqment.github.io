const {
  ORDER_CREATION_SUCCESS,
  ORDER_CANCEL_SUCCESS,
  SERVER_ERROR,
} = require("../constants/messages");
const { ORDER_STATUS } = require("../constants/orders");
const Order = require("../models/order");
const Product = require("../models/product");
const { applyPagination } = require("../utils/generalHelpers");

const updateStock = async (id, quantity) => {
  const product = await Product.findById(id);
  product.stock = product.stock - quantity;
  await product.save({ validateBeforeSave: false });
};

const updateCancelledStock = async (id, quantity) => {
  const product = await Product.findById(id);
  product.stock = product.stock + quantity;
  await product.save({ validateBeforeSave: false });
};

const orderService = {
  newOrder: async (req, res) => {
    const { orderItems, shippingInfo, paymentInfo, charges} = req.body;

    for (let i = 0; i < orderItems.length; i++) {
      let item = orderItems[i];
      const productExists = await Product.findById(item.product);

      if (!productExists) {
        return res.status(404).json({
          success: false,
          message: "Invalid product ID specified, product not found",
        });
      }

      orderItems[i].price = productExists.price;
    }
    
    //const shippingPrice = 10;
    const shippingPrice = charges.shippingPrice;
    const itemsPrice = orderItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const taxPrice = charges.taxPrice;
    const totalPrice = charges.totalPrice;
    //const taxPrice = 10;
    //const totalPrice = itemsPrice + shippingPrice + taxPrice;

    try {
      const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user.id,
      });

      res.status(200).json({
        success: true,
        order,
        message: ORDER_CREATION_SUCCESS,
      });
    } catch (err) {
      res.status(500).json({
        success: true,
        message: SERVER_ERROR,
      });
    }
  },
  getSingleOrder: async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "_id name email"
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "No Order found with this ID",
      });
    }

    if (order.user.name != req.user.name && req.user.role != 'admin') {
      return res.status(401).json({
        success: false,
        message: "Insufficient Privilege to view resource",
      });
    }
    console.log(order.user._id);
    console.log(req.user);

    res.status(200).json({
      success: true,
      order,
    });
  },
  updateOrder: async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order.orderStatus === ORDER_STATUS.DELIVERED) {
      return res.status(400).json({
        success: false,
        message: "Order has been already delivered",
      });
    }

    if (
      order.orderStatus === ORDER_STATUS.PROCESSING &&
      req.body.orderStatus !== ORDER_STATUS.CANCELLED  && req.body.orderStatus !== ORDER_STATUS.IN_TRANSIT
    ) {
      return res.status(400).json({
        success: false,
        message: "Order needs to be dispatched",
      });
    }

    if (
      order.orderStatus === ORDER_STATUS.IN_TRANSIT &&
      req.body.orderStatus !== ORDER_STATUS.CANCELLED  && req.body.orderStatus !== ORDER_STATUS.DELIVERED
    ) {
      return res.status(400).json({
        success: false,
        message: "Order is already in transit",
      });
    }

    if (
      order.orderStatus === ORDER_STATUS.DELIVERED &&
      req.body.orderStatus !== ORDER_STATUS.CANCELLED
    ) {
      return res.status(400).json({
        success: false,
        message: "Order is already delivered",
      });
    }

    if (order.orderStatus === ORDER_STATUS.PROCESSING && req.body.orderStatus === ORDER_STATUS.CANCELLED) {
      order.cancelOrder.cancelledOn = Date.now();
      order.cancelOrder.reason = req.body.reason;
    }
    if (order.orderStatus === ORDER_STATUS.IN_TRANSIT && req.body.orderStatus === ORDER_STATUS.CANCELLED) {
      let promises = [];
      order.orderItems.forEach((item) => {
        promises.push(updateCancelledStock(item.product, item.quantity));
      });

      try {
        await Promise.all(promises);
        order.cancelOrder.cancelledOn = Date.now();
        order.cancelOrder.reason = req.body.reason;
      } 
      catch (error) {
        console.log(error);
        return res.status(500).json({
          success: false,
          message: SERVER_ERROR,
        });
      }
    }

    order.orderStatus = req.body.orderStatus;

    if (order.orderStatus === ORDER_STATUS.IN_TRANSIT) {
      let promises = [];
      order.orderItems.forEach((item) => {
        promises.push(updateStock(item.product, item.quantity));
      });

      try {
        await Promise.all(promises);
      } catch (error) {
        console.log(error);
        return res.status(500).json({
          success: false,
          message: SERVER_ERROR,
        });
      }
    }

    await order.save();
    res.status(200).json({
      success: true,
    });
  },
  deleteOrder: async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "No Order found with this ID",
      });
    }

    if (
      ![ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELLED].includes(
        order.orderStatus
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Only delivered or cancelled orders may be deleted",
      });
    }

    await order.delete();

    res.status(200).json({
      success: true,
    });
  },
  getOrderListing: async (req, res) => {
    const { keyword } = req.query;
    const orders = await applyPagination(
      Order.searchQuery(keyword, req.query),
      req.query
    );
    const count = await Order.searchQuery(keyword).count();
    let totalAmount = await Order.aggregate([
      {
        $match: {
          orderStatus: {
            $in: ["PROCESSING", "IN_TRANSIT", "DELIVERED"]
          }
        }
      },
      {
        $group: {
          _id: null,
          totalAmount: {
            $sum: "$totalPrice"
          }
        }
      }
    ]);
    console.log(totalAmount);

    totalAmount = totalAmount.length > 0 ? totalAmount[0].totalAmount : 0;

    console.log(totalAmount);

    return res.status(200).json({
      success: true,
      count,
      orders,
      totalAmount,
    });
  },
  myOrderListing: async (req, res) => {
    const { keyword, orderBy, direction } = req.query;
    const orders = await applyPagination(
      Order.searchQuery(keyword, { ...req.query, userId: req.user._id }),
      req.query
    );
    const count = await Order.searchQuery(keyword).count();

    return res.status(200).json({
      success: true,
      count,
      orders,
    });
  },
  cancelOrder: async (req, res) => {
    const orderId = req.params.orderId;
    const { orderStatus, cancelOrderReason} = req.body;
   // Checking for user that is cancelling is the same who ordered?
   /* const userId = req.user._id;

    if (order.user !== userId) {
      return res.status(404).json({
        success: false,
        message: "You are not allowed to cancel this order",
      });
    }
    */
    const order = await Order.findById(orderId);
    console.log(order);

    if (
      [ORDER_STATUS.IN_TRANSIT, ORDER_STATUS.DELIVERED].includes(
        order.orderStatus
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Orders only in processing state can be canceled",
      });
    }
    if(orderStatus === ORDER_STATUS.CANCELLED){
    order.orderStatus = orderStatus;
      if(!order.cancelOrder){
        order.cancelOrder = {};
      }
      order.cancelOrder.reason = cancelOrderReason;
      order.cancelOrder.cancelledOn = Date.now();
    }
    await order.save();
    res.status(200).json({
      success: true,
      message: ORDER_CANCEL_SUCCESS,
    });
},
getAllOrderListing: async (req, res) => {

  const orders = await Order.find();

  return res.status(200).json({
    success: true,
    orders,
  });
}
};


module.exports = orderService;
