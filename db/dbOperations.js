const {
  MBLAPP_USERS,
  MBLAPP_PRODUCTS,
  MBLAPP_USER_PRODUCT_XREF,
} = require("../config");
const knex = require("../db_connection/db");

const createDynamicFilter = (queryBuilder, props) => {
  for (const property in props) {
    const value = props[property];
    if (value === undefined) {
      continue;
    }
    const type = typeof value;
    if (type === "object") {
      if (Array.isArray(value)) {
        queryBuilder.whereIn(property, value);
      } else {
        throw "cant handle objects.";
      }
    } else if (type !== undefined) {
      queryBuilder.where(property, value);
    }
  }
};

const getUsers = async (full_name = undefined) => {
  try {
    const result = await knex(MBLAPP_USERS).modify(createDynamicFilter, {
      full_name,
    });
    return result;
  } catch (error) {
    console.log(`getUsers ERROR :: ${error.message}`);
    throw new Error(error.message);
  }
};

const getProducts = async (product_name = undefined) => {
  try {
    const result = await knex(MBLAPP_PRODUCTS).modify(createDynamicFilter, {
      product_name,
    });
    return result;
  } catch (error) {
    console.log(`getProducts ERROR :: ${error.message}`);
    throw new Error(error.message);
  }
};

const getProductsByUserId = async (id = undefined) => {
  try {
    const result = await knex
      .select("a.product_name", "b.product_id", "b.user_id")
      .from(`${MBLAPP_PRODUCTS} as a`)
      .leftJoin(
        `${MBLAPP_USER_PRODUCT_XREF} as b`,
        "a.product_id",
        "b.product_id"
      )
      .where({ user_id: id });

    return result;
  } catch (error) {
    console.log(`getProductsByUser ERROR :: ${error.message}`);
    throw new Error(error.message);
  }
};

const addNewUser = async ({ full_name, password }, trx = knex) => {
  try {
    const results = await trx(MBLAPP_USERS).insert({ full_name, password }).returning('*');
    return results[0];
  } catch (error) {
    console.log(`addNewUser ERROR :: ${error.message}`);
    throw new Error(error.message);
  }
};

const addProduct = async ({ product_name, calories }, trx = knex) => {
  try {
    const results = await trx(MBLAPP_PRODUCTS).insert({ product_name, calories }).returning('*');
    return results[0];
  } catch (error) {
    console.log(`addProduct ERROR :: ${error.message}`);
    throw new Error(error.message);
  }
};

const addProductEmployeeXref = async ({ product_id, user_id }, trx = knex) => {
  try {
    const results = await trx(MBLAPP_USER_PRODUCT_XREF).insert({
      product_id,
      user_id,
    }).returning('*');
    return results[0];
  } catch (error) {
    console.log(`addProductEmployeeXref ERROR :: ${error.message}`);
    throw new Error(error.message);
  }
};

const updateProduct = async ({ product_id, product_name }) => {
  try {
    const result = await knex(MBLAPP_PRODUCTS)
      .update({
        product_name,
        modifed_date: new Date(),
      })
      .where({ product_id });

    return { success: result === 1 };
  } catch (error) {
    console.log(`updateProduct ERROR :: ${error.message}`);
    throw new Error(error.message);
  }
};

const disassociateProductWithEmployee = async ({ product_id }, trx = knex) => {
  try {
    const result = await trx(MBLAPP_USER_PRODUCT_XREF)
      .where({ product_id })
      .del();
    return result;
  } catch (error) {
    console.log(`disassociateProductWithEmployee ERROR :: ${error.message}`);
    throw new Error(error.message);
  }
};

const deleteProduct = async ({ product_id }) => {
  try {
    const res = await knex.transaction(async (trx) => {
      await trx(MBLAPP_USER_PRODUCT_XREF).where({ product_id }).del();
      const result = await trx(MBLAPP_PRODUCTS).where({ product_id }).del();
      return { success: result === 1 };
    });

    return res;
  } catch (error) {
    console.log(`deleteProduct ERROR :: ${error.message}`);
    throw new Error(error.message);
  }
};

module.exports = {
  getUsers,
  addNewUser,
  addProduct,
  updateProduct,
  addProductEmployeeXref,
  disassociateProductWithEmployee,
  deleteProduct,
  getProducts,
  getProductsByUserId,
};
