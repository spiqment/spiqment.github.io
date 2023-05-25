const router = require("express").Router();
const orderService = require("../services/orderService");
const orderValidatorSchema = require("../validators/orderValidatorSchema");
const SchemaValidator = require("../middlewares/SchemaValidator");
const { isAuthenticatedUser } = require("../middlewares/auth");
const validator = new SchemaValidator();

router.post(
  "/",
  isAuthenticatedUser(),
  validator.body(orderValidatorSchema.createOrderRequestModel),
  orderService.newOrder
);
router.get(
  "/",
  isAuthenticatedUser("admin"),
  validator.query(orderValidatorSchema.orderListingRequestModel),
  orderService.getOrderListing
);
router.get(
  "/getAllOrders",
  isAuthenticatedUser("admin"),
  validator.query(orderValidatorSchema.orderListingRequestModel),
  orderService.getAllOrderListing
);
router.get(
  "/my-orders",
  isAuthenticatedUser(),
  validator.query(orderValidatorSchema.orderListingRequestModel),
  orderService.myOrderListing
);
router.get("/:id", isAuthenticatedUser(), orderService.getSingleOrder);
router.put(
  "/:id",
  isAuthenticatedUser("admin"),
  validator.body(orderValidatorSchema.updateOrderRequestModel),
  orderService.updateOrder
);
router.delete("/:id", isAuthenticatedUser("admin"), orderService.deleteOrder);
router.put("/cancel/:orderId", isAuthenticatedUser(), orderService.cancelOrder);

module.exports = router;
