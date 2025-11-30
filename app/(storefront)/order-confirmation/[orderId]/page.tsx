"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, Package, Truck, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderConfirmationPageProps {
  params: { orderId: string };
}

interface OrderItem {
  id: string;
  quantity: number;
  size: string;
  price: number;
  product: {
    name: string;
    images: string[];
  };
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: number;
  subtotal: number;
  shipping: number;
  createdAt: string;
  items: OrderItem[];
  address: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
  } | null;
}

export default function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrder();
  }, [params.orderId]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${params.orderId}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      } else {
        setError("Order not found");
      }
    } catch (err) {
      setError("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 p-8">
          <Package className="h-16 w-16 mx-auto text-neutral-300" />
          <h1 className="text-2xl font-bold text-neutral-900">Order Not Found</h1>
          <p className="text-neutral-500">We couldn&apos;t find order #{params.orderId}</p>
          <Link href="/products">
            <Button size="lg">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="container-page max-w-3xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-neutral-600">
            Thank you for your purchase. We&apos;ve sent a confirmation to your email.
          </p>
        </div>

        {/* Order Card */}
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          {/* Order Info */}
          <div className="p-6 border-b border-neutral-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-sm text-neutral-500">Order Number</p>
                <p className="text-lg font-bold text-neutral-900">#{order.orderNumber}</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-sm text-neutral-500">Order Date</p>
                <p className="font-medium text-neutral-900">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Order Status */}
          <div className="p-6 bg-green-50 border-b border-neutral-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-green-800">Payment Successful</p>
                <p className="text-sm text-green-700">Your order is being processed</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="p-6 border-b border-neutral-200">
            <h3 className="font-semibold text-neutral-900 mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative h-20 w-16 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                    {item.product.images?.[0]?.startsWith("http") ? (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-neutral-400 font-bold">
                        {item.product.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-neutral-900">{item.product.name}</p>
                    <p className="text-sm text-neutral-500">
                      Size: {item.size} • Qty: {item.quantity}
                    </p>
                    <p className="font-medium text-neutral-900">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          {order.address && (
            <div className="p-6 border-b border-neutral-200">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-neutral-400 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">Delivery Address</h3>
                  <p className="text-neutral-600">{order.address.fullName}</p>
                  <p className="text-neutral-600">{order.address.addressLine1}</p>
                  {order.address.addressLine2 && (
                    <p className="text-neutral-600">{order.address.addressLine2}</p>
                  )}
                  <p className="text-neutral-600">
                    {order.address.city}, {order.address.state} - {order.address.pincode}
                  </p>
                  <p className="text-neutral-500">{order.address.phone}</p>
                </div>
              </div>
            </div>
          )}

          {/* Order Total */}
          <div className="p-6 bg-neutral-50">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Subtotal</span>
                <span className="text-neutral-900">₹{order.subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Shipping</span>
                <span className={order.shipping === 0 ? "text-green-600 font-medium" : "text-neutral-900"}>
                  {order.shipping === 0 ? "FREE" : `₹${order.shipping}`}
                </span>
              </div>
              <div className="flex justify-between text-lg font-semibold pt-2 border-t border-neutral-200">
                <span className="text-neutral-900">Total Paid</span>
                <span className="text-neutral-900">₹{order.total.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="mt-6 bg-white rounded-2xl border border-neutral-200 p-6">
          <div className="flex items-start gap-3">
            <Truck className="h-5 w-5 text-neutral-400 mt-0.5" />
            <div>
              <h3 className="font-semibold text-neutral-900 mb-1">Estimated Delivery</h3>
              <p className="text-neutral-600">3-5 business days</p>
              <p className="text-sm text-neutral-500 mt-2">
                You will receive tracking information via email once your order ships.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link href="/account/orders" className="flex-1">
            <Button variant="outline" className="w-full" size="lg">
              View My Orders
            </Button>
          </Link>
          <Link href="/products" className="flex-1">
            <Button className="w-full" size="lg">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
