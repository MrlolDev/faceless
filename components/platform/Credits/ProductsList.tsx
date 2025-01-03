"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Product } from "@polar-sh/sdk/models/components/product";
import { Credits } from "@/types/credits";

export default function ProductsList({ credits }: { credits: Credits }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handlePurchase = async (priceId: string, productId: string) => {
    try {
      const response = await fetch(
        `/api/checkout?priceId=${priceId}&productId=${productId}`
      );
      if (!response.ok) throw new Error("Checkout failed");

      const data = await response.json();

      // Redirect to Polar's checkout page
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error) {
      console.error("Error initiating checkout:", error);
    }
  };

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (products.length === 0) {
    return <div>No products available.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="w-full">
          <CardHeader>
            <CardTitle>{product.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-base">{product.description}</p>
            <p className="text-lg font-bold mt-4">
              {product.prices[0].amountType === "fixed"
                ? `$${(product.prices[0].priceAmount / 100).toFixed(
                    2
                  )} ${product.prices[0].priceCurrency.toUpperCase()}`
                : product.prices[0].amountType == "free"
                ? "FREE"
                : "Custom"}
            </p>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              variant="default"
              disabled={
                product.prices[0].amountType == "free" &&
                credits.transactions?.some(
                  (transaction) => transaction.type == "free"
                )
              }
              onClick={() => handlePurchase(product.prices[0].id, product.id)}
            >
              Purchase
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
