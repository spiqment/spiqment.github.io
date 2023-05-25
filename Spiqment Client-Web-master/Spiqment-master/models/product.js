const mongoose = require("mongoose");
const { ORDER_BY_DIRECTIONS } = require("../constants/common");
// Added for the recommended products ids script
const Category = require("./category");
//
const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter product name"],
    trim: true,
    maxLength: [90, "Product name must be within the range = 90"],
  },
  price: {
    type: Number,
    required: [true, "Please enter product price"],
    default: 0.0,
  },
  description: {
    type: String,
    required: [true, "Please enter product description"],
  },
  //
  color: {
    type: String,
    required: [true, "Please select product color"],
  },
  
  sizes: {
    type: [
      {
        type: String,
      },
    ],
    required: [true, "Please select product sizes"]
  },
  //
   images: [
     {
       public_id: {
         type: String,
         required: true,
       },
       url: {
         type: String,
         required: true,
       },
     },
   ],
  category: {
    type: mongoose.SchemaTypes.ObjectId,
    //commented for Reviews Script
    ref: "Category",
  },
  stock: {
    type: Number,
    required: [true, "Please enter product stock"],
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.SchemaTypes.ObjectId,
        //commented for Reviews Script
        ref: "User",
        required: true,
      },
      rating: {
        type: Number,
        required: true,
        min: [0, "Rating must be between 1 to 5"],
        max: [5, "Rating must be between 1 to 5"],
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  deletedAt: {
    type: Date,
    default: null,
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
  },
});

productSchema.virtual("ratings").get(function () {
  return this.reviews.length
    ? this.reviews.reduce((total, next) => total + next.rating, 0) /
        this.reviews.length
    : 0;
});

productSchema.set("toObject", { virtuals: true });
productSchema.set("toJSON", { virtuals: true });

productSchema.pre("find", function () {
  this.populate("reviews.user", "-role -reAuthenticate")
    .populate("category", "name")
    .where({ deletedAt: null });
});

productSchema.pre("findOne", function () {
  this.populate("reviews.user", "-role -reAuthenticate")
    .populate("category", "name")
    .where({ deletedAt: null });
});

productSchema.pre("save", async function (next) {
  this.updatedAt = Date.now();
});

productSchema.methods.delete = async function () {
  if (!this.deletedAt) {
    this.deletedAt = Date.now();
    await this.save();
  }
};

productSchema.statics.searchQuery = function (keyword, queryParams) {
  const stringSearchFields = ["name"];
  const alphaNumericSearchFields = ["_id"];

  let query = {};
  if (!!keyword) {
    query = {
      $or: [
        ...stringSearchFields.map((field) => ({
          [field]: {
            $regex: keyword,
            $options: "i",
          },
        })),
        ...alphaNumericSearchFields.map((field) => ({
          $where: `/.*${keyword}.*/.test(this.${field})`,
        })),
      ],
    };
  }

  if (!!queryParams && queryParams.productId) {
    query._id = queryParams.productId;
  }

  if (!!queryParams && queryParams.category) {
    query.category = queryParams.category;
  }

  if (!!queryParams && queryParams.priceGTE) {
    query.price = { $gte: queryParams.priceGTE };
  }
  
  if (!!queryParams && queryParams.ratings) {
    query["reviews"] = { $elemMatch: { rating: Number(queryParams.ratings) } };
  }

  if (!!queryParams && queryParams.priceLTE) {
    query.price = {
      ...(!!query.price ? query.price : {}),
      $lte: queryParams.priceLTE,
    };
  }

  let sortableFields = ["price", "stock", "createdAt", "name"];

  let sortOrder = {};

  if (!!queryParams && !!queryParams.orderBy) {
    let orderBy = queryParams.orderBy;
    direction = queryParams.direction || ORDER_BY_DIRECTIONS.ASC;
    sortOrder =
      sortableFields.includes(orderBy) &&
      direction === ORDER_BY_DIRECTIONS.DESC &&
      orderBy
        ? { [orderBy]: "desc" }
        : sortableFields.includes(orderBy) &&
          direction === ORDER_BY_DIRECTIONS.ASC &&
          orderBy
        ? { [orderBy]: "asc" }
        : {};
  }

  return this.find(query).sort(sortOrder);
};

module.exports = mongoose.model("Product", productSchema);
