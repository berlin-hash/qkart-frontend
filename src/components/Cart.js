import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Cart.css";
import axios from "axios";
import { config } from "../App";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 *
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

/**
 * Returns the complete data on all products in cartData by searching in productsData
 *
 * @param { Array.<{ productId: String, qty: Number }> } cartData
 *    Array of objects with productId and quantity of products in cart
 *
 * @param { Array.<Product> } productsData
 *    Array of objects with complete data on all available products
 *
 * @returns { Array.<CartItem> }
 *    Array of objects with complete data on products in cart
 *
 */
export const generateCartItemsFrom = (cartData, productsData) => {
  const cartProducts = productsData.filter((product) => {
    for (let item of cartData) {
      if (item.productId === product._id) {
        product.qty = item.qty;
        return true;
      }
    }
  });
  // console.log(cartProducts);
  return cartProducts;
};

/**
 * Get the total value of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products added to the cart
 *
 * @returns { Number }
 *    Value of all items in the cart
 *
 */
export const getTotalCartValue = (items = []) => {
  let cost = 0;
  items.forEach((item) => {
    cost = cost + item.cost * item.qty;
  });
  return cost;
};

const getTotalItems = (items = []) => {
  let total = 0;
  items.forEach((item) => {
    total += item.qty;
  });
  return total;
};
/**
 * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
 *
 * @param {Number} value
 *    Current quantity of product in cart
 *
 * @param {Function} handleAdd
 *    Handler function which adds 1 more of a product to cart
 *
 * @param {Function} handleDelete
 *    Handler function which reduces the quantity of a product in cart by 1
 *
 *
 */

const ItemQuantity = ({ value, handleAdd, handleDelete, ReadOnly }) => {
  return (
    <Stack direction="row" alignItems="center">
      {!ReadOnly && (
        <IconButton size="small" color="primary" onClick={handleDelete}>
          <RemoveOutlined />
        </IconButton>
      )}
      {ReadOnly && <p>Qty:</p>}
      <Box padding="0.5rem" data-testid="item-qty">
        {value}
      </Box>
      {!ReadOnly && (
        <IconButton size="small" color="primary" onClick={handleAdd}>
          <AddOutlined />
        </IconButton>
      )}
    </Stack>
  );
};

const OrderDetails = () => {};

/**
 * Component to display the Cart view
 *
 * @param { Array.<Product> } products
 *    Array of objects with complete data of all available products
 *
 * @param { Array.<Product> } items
 *    Array of objects with complete data on products in cart
 *
 * @param {Function} handleDelete
 *    Current quantity of product in cart
 *
 *
 */
const Cart = ({ products, items = [], handleQuantity, isReadOnly }) => {
  const history = useHistory();
  const shippingCharges = 0

  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }

  const handleCheckoutRedirect = () => {
    history.push("/checkout", { from: "Cart" });
  };

  return (
    <>
      <Box className="cart">
        {/* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */}
        {items.map((item) => (
          <Box display="flex" alignItems="flex-start" key={item._id}>
            <Box className="image-container">
              <img
                // Add product image
                src={item.image}
                // Add product name as alt eext
                alt={item.name}
                width="100%"
                height="100%"
              />
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              height="6rem"
              paddingX="1rem"
            >
              <div>{item.name}</div>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <ItemQuantity
                  // Add required props by checking implementation
                  handleAdd={() => handleQuantity(item._id, item.qty + 1)}
                  handleDelete={() => handleQuantity(item._id, item.qty - 1)}
                  value={item.qty}
                  ReadOnly={isReadOnly}
                />
                <Box padding="0.5rem" fontWeight="700">
                  ${item.cost}
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
        <Box
          padding="1rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box color="#3C3C3C" alignSelf="center">
            Order total
          </Box>
          <Box
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1.5rem"
            alignSelf="center"
            data-testid="cart-total"
          >
            ${getTotalCartValue(items)}
          </Box>
        </Box>
        {!isReadOnly && (
          <Box display="flex" justifyContent="flex-end" className="cart-footer">
            <Button
              color="primary"
              variant="contained"
              startIcon={<ShoppingCart />}
              className="checkout-btn"
              onClick={handleCheckoutRedirect}
            >
              Checkout
            </Button>
          </Box>
        )}
      </Box>
      {isReadOnly && (
        <Box className="cart">
          <Box
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1.5rem"
            alignSelf="center"
            padding="1rem"
          >
            Order details
          </Box>
          <Box
            sx={{ px: 3, py: 1 }}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>Products</Box>
            <Box>{getTotalItems(items)}</Box>
          </Box>
          <Box
           sx={{ px: 3, py: 1 }}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>Subtotal</Box>
            <Box>{getTotalCartValue(items)}</Box>
          </Box>
          <Box
            sx={{ px: 3, py: 1 }}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>Shipping Charges</Box>
            <Box>${shippingCharges}</Box>
          </Box>
          <Box
            sx={{ px: 3, py: 1 }}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            fontWeight="700"
          >
            <Box>Total</Box>
            <Box>${getTotalCartValue(items) + shippingCharges}</Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Cart;
