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
import { cn } from "@/lib/utils";
import Loading from "@/components/Loading";
import { useTranslations } from "next-intl";
import { TurnstileInstance } from "@marsidev/react-turnstile";
import { Turnstile } from "@marsidev/react-turnstile";
import { useRef } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ProductsList({ credits }: { credits: Credits }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);
  const { toast } = useToast();

  const t = useTranslations("credits");
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
      if (!captchaToken) {
        toast({
          title: "Error with security check",
          description: "Please try again or refresh the page",
          variant: "destructive",
        });
        turnstileRef.current?.reset();
        return;
      }

      const response = await fetch(
        `/api/checkout?priceId=${priceId}&productId=${productId}&captchaToken=${captchaToken}`
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
      toast({
        title: "Error with security check",
        description: "Please try again or refresh the page",
        variant: "destructive",
      });
      turnstileRef.current?.reset();
    }
  };

  const creditsPerDollar = (product: Product) => {
    if (product.prices[0].amountType == "fixed") {
      const credits = parseFloat(product.name.split(" ")[0]);
      const price = product.prices[0].priceAmount / 100;
      const creditsPerDollar = credits / price;
      return creditsPerDollar.toFixed(2);
    }
    return 0;
  };

  if (loading) {
    return <Loading fullScreen={true} element="products" />;
  }

  if (products.length === 0) {
    return <div>{t("noProductsAvailable")}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products
        .sort((a, b) => {
          const priceA =
            a.prices[0].amountType === "fixed"
              ? a.prices[0].priceAmount || 0
              : 0;
          const priceB =
            b.prices[0].amountType === "fixed"
              ? b.prices[0].priceAmount || 0
              : 0;
          return priceA - priceB;
        })
        .map((product) => (
          <Card key={product.id} className="w-full">
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-base">{product.description}</p>
              <div className="flex flex-col">
                <p className="text-lg font-bold mt-4">
                  {product.prices[0].amountType === "fixed"
                    ? `$${(product.prices[0].priceAmount / 100).toFixed(
                        2
                      )} ${product.prices[0].priceCurrency.toUpperCase()}`
                    : product.prices[0].amountType == "free"
                    ? "FREE"
                    : "Custom"}
                </p>
                {product.prices[0].amountType == "fixed" ? (
                  <p className="text-sm font-base">
                    {creditsPerDollar(product)} credits per dollar
                  </p>
                ) : (
                  <p className="text-sm font-base">
                    {product.prices[0].amountType}
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className={cn(
                  product.prices[0].amountType == "free" &&
                    credits.transactions?.some(
                      (transaction) => transaction.type == "free"
                    ) &&
                    "cursor-not-allowed!",
                  "w-full"
                )}
                variant={
                  product.prices[0].amountType == "free" &&
                  credits.transactions?.some(
                    (transaction) => transaction.type == "free"
                  )
                    ? "neutral"
                    : "default"
                }
                disabled={
                  product.prices[0].amountType == "free" &&
                  credits.transactions?.some(
                    (transaction) => transaction.type == "free"
                  )
                }
                onClick={() => handlePurchase(product.prices[0].id, product.id)}
              >
                {t("purchase")}{" "}
                {product.prices[0].amountType == "free" &&
                  t("oneTimePurchaseOnly")}
              </Button>
            </CardFooter>
          </Card>
        ))}
      <Turnstile
        ref={turnstileRef}
        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY! as string}
        onSuccess={(token: string) => setCaptchaToken(token)}
        onError={() => {
          toast({
            title: "Error with security check",
            description: "Please try again or refresh the page",
            variant: "destructive",
          });
        }}
        onExpire={() => {
          setCaptchaToken(null);
          turnstileRef.current?.reset();
        }}
        className="mb-4"
      />
    </div>
  );
}
