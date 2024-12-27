const express = require("express");
const {
  addProduct,
  addProductEmployeeXref,
  deleteProduct,
  updateProduct,
  getProducts,
} = require("../db/dbOperations");
const { authMiddleWare } = require("../jwtHelper");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { product_name } = req.body;

    const result = await addProduct({ product_name });
    res.sendStatus(200);
  } catch (error) {
    const { message } = error;
    console.log(`ERROR - /product POST: ${error}`);
    res.status(400).send({
      message,
      status: 400,
      statusText: "Bad Request",
    });
  }
});

router.get("/all", async (req, res) => {
    try {
      const data = await getProducts();
  
      return res.send(data);
    } catch (error) {
      const { message } = error;
      res.status(400).send({ message });
    }
  });

router.put("/", async (req, res) => {
  try {
    const { product_id, product_name } = req.body;
    if (isNaN(parseInt(product_id))) {
      throw new Error("product_id must be a number");
    }

    const result = await updateProduct({ product_name, product_id });
    res.send(result);
  } catch (error) {
    const { message } = error;
    console.log(`ERROR - /product PUT: ${error}`);
    res.status(400).send({
      message,
      status: 400,
      statusText: "Bad Request",
    });
  }
});

router.delete("/", async (req, res) => {
  try {
    const { product_id } = req.body;
    if (isNaN(parseInt(product_id))) {
      throw new Error("product_id must be a number");
    }
    const result = await deleteProduct({product_id});
    res.send(result);
  } catch (error) {
    const { message } = error;
    console.log(`ERROR - /product DELETE: ${error}`);
    res.status(400).send({
      message,
      status: 400,
      statusText: "Bad Request",
    });
  }
});

router.post("/user", authMiddleWare, async (req, res) => {
  try {
    const { product_id } = req.body;
    const { user_id } = req.user;

    console.log("Passed : ", { product_id, user_id });
    await addProductEmployeeXref({ product_id, user_id });
    res.sendStatus(200);
  } catch (error) {
    console.log(`ERROR - /product/user POST: ${error}`);
    const { message } = error;
    res.status(400).send({
      message,
      status: 400,
      statusText: "Bad Request",
    });
  }
});

module.exports = router;
