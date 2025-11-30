"use client";

import { useState, useEffect } from "react";
import {
  ShoppingBag,
  Eye,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  CreditCard,
  AlertCircle,
  IndianRupee,
} from "lucide-react";
import Link from "next/link";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  total: number;
  subtotal: number;
  shipping: number;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  address: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
  } | null;
  items: {
    id: string;
    quantity: number;
    price: number;
    size: string;
    product: {
      name: string;
      category: string;
      images?: string[];
    };
  }[];
}

const statusConfig = {
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
  },
  processing: {
    label: "Processing",
    color: "bg-blue-100 text-blue-800",
    icon: Package,
  },
  shipped: {
    label: "Shipped",
    color: "bg-purple-100 text-purple-800",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800",
    icon: XCircle,
  },
};

const paymentStatusConfig = {
  pending: {
    label: "Payment Pending",
    color: "bg-orange-100 text-orange-800",
    icon: AlertCircle,
  },
  paid: {
    label: "Paid",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
  failed: {
    label: "Failed",
    color: "bg-red-100 text-red-800",
    icon: XCircle,
  },
  refunded: {
    label: "Refunded",
    color: "bg-gray-100 text-gray-800",
    icon: IndianRupee,
  },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("paid"); // Default to paid orders
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [paymentFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (paymentFilter !== "all") {
        params.append("paymentStatus", paymentFilter);
      }
      const response = await fetch(`/api/admin/orders?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId ? { ...order, status } : order
          )
        );
        if (selectedOrder?.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status });
        }
      }
    } catch (error) {
      console.error("Failed to update order:", error);
    }
  };

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((order) => order.status === filter);

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Orders</h1>
        <p className="text-neutral-600 mt-1">
          Manage customer orders and shipments
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Total Orders</p>
              <p className="text-2xl font-bold text-neutral-900 mt-1">
                {stats.total}
              </p>
            </div>
            <ShoppingBag className="w-6 h-6 text-neutral-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">
                {stats.pending}
              </p>
            </div>
            <Clock className="w-6 h-6 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Processing</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {stats.processing}
              </p>
            </div>
            <Package className="w-6 h-6 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Shipped</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">
                {stats.shipped}
              </p>
            </div>
            <Truck className="w-6 h-6 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Delivered</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {stats.delivered}
              </p>
            </div>
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      {/* Payment Status Filter */}
      <div className="flex items-center gap-4 flex-wrap">
        <span className="text-sm font-medium text-neutral-700">Payment Status:</span>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setPaymentFilter("paid")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              paymentFilter === "paid"
                ? "bg-green-600 text-white"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            <CheckCircle className="w-4 h-4 inline mr-1" />
            Paid
          </button>
          <button
            onClick={() => setPaymentFilter("pending")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              paymentFilter === "pending"
                ? "bg-orange-600 text-white"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            <AlertCircle className="w-4 h-4 inline mr-1" />
            Pending Payment
          </button>
          <button
            onClick={() => setPaymentFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              paymentFilter === "all"
                ? "bg-neutral-900 text-white"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            All Orders
          </button>
        </div>
      </div>

      {/* Order Status Filters */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === "all"
              ? "bg-neutral-900 text-white"
              : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
          }`}
        >
          All ({stats.total})
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === "pending"
              ? "bg-yellow-600 text-white"
              : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
          }`}
        >
          Pending ({stats.pending})
        </button>
        <button
          onClick={() => setFilter("processing")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === "processing"
              ? "bg-blue-600 text-white"
              : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
          }`}
        >
          Processing ({stats.processing})
        </button>
        <button
          onClick={() => setFilter("shipped")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === "shipped"
              ? "bg-purple-600 text-white"
              : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
          }`}
        >
          Shipped ({stats.shipped})
        </button>
        <button
          onClick={() => setFilter("delivered")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === "delivered"
              ? "bg-green-600 text-white"
              : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
          }`}
        >
          Delivered ({stats.delivered})
        </button>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                  Order #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <ShoppingBag className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                    <p className="text-neutral-600">No orders found</p>
                    <p className="text-sm text-neutral-500 mt-1">
                      {paymentFilter === "paid" 
                        ? "No paid orders yet. Orders will appear here after customers complete payment."
                        : "Try changing the filter to see more orders."}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const StatusIcon =
                    statusConfig[order.status as keyof typeof statusConfig]
                      ?.icon || Clock;
                  const PaymentIcon =
                    paymentStatusConfig[order.paymentStatus as keyof typeof paymentStatusConfig]
                      ?.icon || AlertCircle;
                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-neutral-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-neutral-900">
                          #{order.orderNumber}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-neutral-900">
                            {order.user?.name || "Unknown"}
                          </div>
                          <div className="text-sm text-neutral-500">
                            {order.user?.email || "No email"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-neutral-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-neutral-600">
                          {order.items.length} item
                          {order.items.length !== 1 ? "s" : ""}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-neutral-900">
                          ₹{order.total.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            paymentStatusConfig[
                              order.paymentStatus as keyof typeof paymentStatusConfig
                            ]?.color || "bg-neutral-100 text-neutral-800"
                          }`}
                        >
                          <PaymentIcon className="w-3 h-3" />
                          {paymentStatusConfig[order.paymentStatus as keyof typeof paymentStatusConfig]
                            ?.label || order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            statusConfig[
                              order.status as keyof typeof statusConfig
                            ]?.color || "bg-neutral-100 text-neutral-800"
                          }`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {statusConfig[order.status as keyof typeof statusConfig]
                            ?.label || order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-sm font-medium text-neutral-900 hover:text-neutral-700 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-neutral-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-neutral-900">
                  Order #{selectedOrder.orderNumber}
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-neutral-500 hover:text-neutral-700"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Payment & Status Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Order Status
                  </label>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) =>
                      updateOrderStatus(selectedOrder.id, e.target.value)
                    }
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Payment Status
                  </label>
                  <div className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    paymentStatusConfig[selectedOrder.paymentStatus as keyof typeof paymentStatusConfig]?.color || "bg-neutral-100"
                  }`}>
                    {paymentStatusConfig[selectedOrder.paymentStatus as keyof typeof paymentStatusConfig]?.label || selectedOrder.paymentStatus}
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-neutral-50 rounded-lg p-4 flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-neutral-600" />
                <div>
                  <p className="text-sm font-medium text-neutral-900">Payment Method</p>
                  <p className="text-sm text-neutral-600 capitalize">{selectedOrder.paymentMethod || "Not specified"}</p>
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h3 className="font-semibold text-neutral-900 mb-3">
                  Customer Information
                </h3>
                <div className="bg-neutral-50 rounded-lg p-4 space-y-2">
                  <p className="text-sm">
                    <span className="text-neutral-600">Name:</span>{" "}
                    <span className="font-medium">{selectedOrder.user.name}</span>
                  </p>
                  <p className="text-sm">
                    <span className="text-neutral-600">Email:</span>{" "}
                    <span className="font-medium">{selectedOrder.user.email}</span>
                  </p>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="font-semibold text-neutral-900 mb-3">
                  Shipping Address
                </h3>
                {selectedOrder.address ? (
                  <div className="bg-neutral-50 rounded-lg p-4 space-y-1">
                    <p className="text-sm font-medium">
                      {selectedOrder.address.fullName}
                    </p>
                    <p className="text-sm text-neutral-600">
                      {selectedOrder.address.phone}
                    </p>
                    <p className="text-sm text-neutral-600">
                      {selectedOrder.address.addressLine1}
                    </p>
                    {selectedOrder.address.addressLine2 && (
                      <p className="text-sm text-neutral-600">
                        {selectedOrder.address.addressLine2}
                      </p>
                    )}
                    <p className="text-sm text-neutral-600">
                      {selectedOrder.address.city}, {selectedOrder.address.state} -{" "}
                      {selectedOrder.address.pincode}
                    </p>
                  </div>
                ) : (
                  <div className="bg-neutral-50 rounded-lg p-4">
                    <p className="text-sm text-neutral-500">No address on file</p>
                  </div>
                )}
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold text-neutral-900 mb-3">
                  Order Items
                </h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center bg-neutral-50 rounded-lg p-4"
                    >
                      <div>
                        <p className="font-medium text-neutral-900">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-neutral-600">
                          Size: {item.size} • Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium text-neutral-900">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-neutral-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-neutral-900">
                    Total
                  </span>
                  <span className="text-2xl font-bold text-neutral-900">
                    ₹{selectedOrder.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
