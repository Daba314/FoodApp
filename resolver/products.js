const { getProducts, addProduct } = require("../db/dbOperations");

module.exports = {
  products: async () => {
    const allProducts = await getProducts();
    return allProducts;
  },
  createProduct: async (args) => {
    const product = {
      product_name: args.productInput.product_name,
      calories: +args.productInput.calories,
    };
    const addedProduct = await addProduct(product);
    return addedProduct;
  }}