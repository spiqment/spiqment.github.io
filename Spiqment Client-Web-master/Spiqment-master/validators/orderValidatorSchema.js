const Joi = require("joi");
const { ORDER_STATUS } = require("../constants/orders");

const orderValidatorSchema = {
  createOrderRequestModel: Joi.object({
    shippingInfo: Joi.object()
      .keys({
        address: Joi.string().required(),
        city: Joi.string().required(),
        phoneNo: Joi.string().required(),
        postalCode: Joi.string().required(),
        province: Joi.string().required(),
        country: Joi.string().required(),
      })
      .required(),
    orderItems: Joi.array().items(
      Joi.object().keys({
        quantity: Joi.number().required(),
        product: Joi.string().required(),
        color: Joi.string(),
        size: Joi.string(),     
      })
    ),
    //Extra Code added
    charges: Joi.object({
        shippingPrice: Joi.number().required(),
        taxPrice: Joi.number().required(),
        totalPrice: Joi.number().required(),
      }),
    //Extra payment method code added
    paymentInfo: Joi.object({
      paymentMethod: Joi.string().required(),
      Stripe_id: Joi.string(),
    })
    //Payment method code end
  }),
  //Extra Code ended
  updateOrderRequestModel: Joi.object({
    orderStatus: Joi.string()
      .valid(
        ORDER_STATUS.PROCESSING,
        ORDER_STATUS.IN_TRANSIT,
        ORDER_STATUS.DELIVERED,
        ORDER_STATUS.CANCELLED
      )
      .required(),
      reason: Joi.string(),
  }),
  orderListingRequestModel: Joi.object({
    keyword: Joi.string().allow("").trim().optional(),
    page: Joi.number().empty("").default(1).optional(),
    limit: Joi.number().empty("").default(20).max(500).optional(),
    orderBy: Joi.string().valid("user", "totalPrice", "orderStatus").optional(),
    direction: Joi.string().valid("asc", "desc").optional(),
  }),
};

module.exports = orderValidatorSchema;
