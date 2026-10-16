import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import ProductDetailPage from '@/components/ProductDetailPage';
import { products } from '@/data/products';

export default function ProductDetailRoute() {
  const { productId } = useParams<{ productId: string }>();

  if (!productId || !products[productId]) {
    return <Navigate to="/products" replace />;
  }

  return <ProductDetailPage product={products[productId]} />;
}