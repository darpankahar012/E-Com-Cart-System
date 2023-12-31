const Product = require("../models/product");
const mongoose = require("mongoose");

exports.get_all_products = (req, res, next) => {
  Product.find()
    .select("name price _id category productImage productSeller ")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        products: docs.map((doc) => {
          return {
            name: doc.name,
            price: doc.price,
            category: doc.category,
            productImage: doc.productImage,
            sellerEmail: doc.productSeller.email,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + doc._id,
            },
            _id: doc._id,
          };
        }),
      };

      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.get_a_product = (req, res, next) => {
  const _id = req.params.productId;
  Product.findById(_id)
    .select("name price _id productImage productSeller.email")
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: "GET",
            url: "http://localhost:3000/products",
          },
        });
      } else {
        res.status(404).json({ message: "Data not found" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.post_new_product = (req, res, next) => {
  const productSeller = {
    id: req.userData.userId,
    email: req.userData.email,
  };

  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    category: req.body.category,
    productImage: req.body.productImage,
    productSeller: productSeller,
  });

  product
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Product saved",
        currentProduct: {
          name: result.name,
          price: result.price,
          category: result.category,
          productImage: result.productImage,
          _id: result._id,
        },
        request: {
          type: "GET",
          url: "http://localhost:3000/products/" + result._id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.update_a_product = (req, res, next) => {
  const id = req.params.productId;
  const updateData = {};
  for (const [key, value] of Object.entries(req.body)) {
    updateData[key] = value;
  }
  Product.updateOne({ _id: id }, { $set: updateData })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Changes has been done",
        request: {
          type: "GET",
          ulr: "http://localhost:3000/products/" + id,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

exports.delete_product = (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "Product deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/products",
        },
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};
