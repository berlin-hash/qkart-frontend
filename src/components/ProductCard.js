import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  return (
    <Card className="card">
      <CardMedia  image={product.image} className='product' component="img"/>
  <CardContent>
    <Typography color="primary" variant="h5">
      {product.name}
    </Typography>
    <Typography  variant="subtitle1" >
      ${product.cost}
    </Typography>
    <Rating name="read-only" value={product.rating} readOnly /> 
    <Button variant="contained" fullWidth={true} onClick={handleAddToCart}>
        ADD TO CART
    </Button>
  </CardContent>
    </Card>
  );
};

export default ProductCard;
