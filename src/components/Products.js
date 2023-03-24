import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import { Stack } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Button } from "@mui/material";
import Cart, { generateCartItemsFrom } from "./Cart";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product


/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

const Products = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [products, setProducts] = useState([]);
  const [Loader, setLoader] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [cartLoad, setCardLoad] = useState(false);
  const [cartData, setCartData] = useState([]);
  const [itemData, setItemData] = useState([]);
  const [debounceTimeout, setDebounceTimeout] = useState(
    setTimeout(() => {}, 3000)
  );

  const token = localStorage.getItem("token");

  let partition = 12;
  if (token) partition = 9;

  function handleSearchInputChange(event) {
    setSearchQuery(event.target.value);
    debounceSearch(event, 3000);

    // performSearch(searchQuery)
  }

 

  useEffect(() => {
    performAPICall();
  }, []);

  const performAPICall = async () => {
    try {
      setLoader(true);
      const response = await axios.get(`${config.endpoint}/products`);
      // console.log(response.data);
      setProducts(response.data);
      setLoader(false);
      setCardLoad(true);
      return response.data;
    } catch (err) {
      console.log(err);
      setLoader(false);
    }
  };
  // let productsData = []
  // axios.get(`${config.endpoint}/products`)
  // .then(response => {
  //   productsData = response.data
  //   console.log(productsData)
  // })

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    try {
      const response = await axios.get(
        `${config.endpoint}/products/search?value=${text}`
      );
      setProducts(response.data);
    } catch (err) {
      if (err.response.status === 404) {
        setProducts([]);
      }
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(() => {
      performSearch(event.target.value);
    }, 500);

    setDebounceTimeout(timeout);
  };

  const fetchCart = async (token) => {
    if (!token) return;
    try {
      const head = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
      };
      const response = await axios.get(`${config.endpoint}/cart`, head);
      if (response.data.length !== 0) {
        // console.log(response.data)
        console.log(generateCartItemsFrom(response.data, products));
        setCartData(generateCartItemsFrom(response.data, products));
      }
    } catch (err) {
      if (err.response !== undefined && err.response.status === 404) {
        setProducts([]);
        enqueueSnackbar("No Products found", { varaint: "warning" });
      } else {
        enqueueSnackbar(
          "Something went wrong. Check the backend console for more details",
          { varaint: "error" }
        );
      }
    }
  };

  useEffect(() => {
    fetchCart(token);
  }, [cartLoad]);

  const handleAddToCart = async (productId, qty, addToCartflag) => {
    try {
      if (!token) {
        enqueueSnackbar("Login to add an item to the Cart", {
          variant: "warning",
        });
        return;
      }
      if (addToCartflag && cartData.some((item) => productId === item._id)) {
        enqueueSnackbar(
          "Item already in cart. Use the cart sidebar to update quantity or remove item",
          { variant: "warning" }
        );
        return;
      }
      const res =await axios.post(
        `${config.endpoint}/cart`,
        {
          productId: productId,
          qty: qty,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-type": "application/json",
          },
        }
      );
      setItemData(res.data)
      setCartData(generateCartItemsFrom(res.data, products));

    } catch (err) {
      enqueueSnackbar(err.response.message, {variant: "error"})
    }
  };

  const handleQuantity = (productId, qty) => {
    // console.log(productId, qty);
    handleAddToCart(productId, qty, false);
  }

  return (
    <div>
      <Header>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <TextField
          className="search-desktop"
          style={{ width: 100 }}
          InputProps={{
            className: "search",
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
          onChange={handleSearchInputChange}
        />
      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={handleSearchInputChange}
      />
      <Grid container>
        <Grid item md={partition} className="product-grid">
          <Box className="hero">
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
              to your door step
            </p>
          </Box>
          <Grid container>
            {!Loader &&
              products.length > 0 &&
              products.map((product) => (
                <Grid item xs={6} md={3} key={product._id}>
                  <ProductCard
                    product={product}
                    handleAddToCart={() => handleAddToCart(product._id, 1, true)}
                  />
                </Grid>
              ))}
          </Grid>
          {Loader && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                height: "100px",
              }}
            >
              <CircularProgress color="inherit" />
              <p>Loading Products</p>
            </div>
          )}
          {!Loader && products.length === 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                height: "100px",
              }}
            >
              <SentimentDissatisfied />
              <p>No products found</p>
            </div>
          )}
        </Grid>
        {token && (
          <Grid item md={3} sm={12}>
            <Box style={{ height: "100vh", backgroundColor: "#E9F5E1" }}>
              <Stack
                justifyContent="center"
                alignItems="center"
                style={{
                  minHeight: "30rem",
                  borderRadius: "10px",
                  backgroundColor: "#FFFFFF",
                  margin: "3px",
                  padding: "2px",
                }}
              >
                

                {token && (
                  <Grid item>
                    <Cart items={cartData} handleQuantity={handleQuantity} products={products}  />
                  </Grid>
                )}
              </Stack>
            </Box>
          </Grid>
        )}
      </Grid>

      <Footer />
    </div>
  );
};

export default Products;
