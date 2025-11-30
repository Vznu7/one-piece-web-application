"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Package, Loader2, Eye } from "lucide-react";
import Link from "next/link";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  items: {
    id: string;
    quantity: number;
    price: number;
    size: string;
    product: {
      name: string;
      images: string[];
    };
  }[];
  address: {
    fullName: string;
    addressLine1: string;
    city: string;
    state: string;
    pincode: string;
  };
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchOrders();
    }
  }, [status, router]);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/user/orders");
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-neutral-200">
          <Package className="w-12 h-12 mx-auto mb-3 text-neutral-400" />
          <p className="text-neutral-600 mb-4">No orders yet</p>
          <Link
            href="/products"
            className="inline-block px-6 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-neutral-900">
                      Order #{order.orderNumber}
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        statusColors[order.status as keyof typeof statusColors] ||
                        "bg-neutral-100 text-neutral-800"
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600">
                    Placed on {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-neutral-900">
                    ₹{order.total.toLocaleString()}
                  </p>
                  <p className="text-sm text-neutral-600">
                    {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              <div className="border-t border-neutral-200 pt-4 space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.product.images.length > 0 &&
                      item.product.images[0].startsWith("http") ? (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-300" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-neutral-900 text-sm">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-neutral-600">
                        Size: {item.size} • Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-medium text-neutral-900 mt-1">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-neutral-200 mt-4 pt-4">
                <div className="text-sm text-neutral-600">
                  <p className="font-medium text-neutral-900 mb-1">Delivery Address</p>
                  <p>{order.address.fullName}</p>
                  <p>
                    {order.address.addressLine1}, {order.address.city}
                  </p>
                  <p>
                    {order.address.state} - {order.address.pincode}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
