"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  MapPin,
  CreditCard,
  Shield,
  Truck,
  ArrowLeft,
  Loader2,
  CheckCircle,
} from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { items, clear } = useCartStore();
  
  const [step, setStep] = useState<"shipping" | "payment" | "processing">("shipping");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card">("upi");
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [useNewAddress, setUseNewAddress] = useState(true);
  
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: "",
    phone: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freeShippingThreshold = 2500;
  const shipping = subtotal >= freeShippingThreshold ? 0 : 99;
  const total = subtotal + shipping;

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Fetch saved addresses
  useEffect(() => {
    if (session?.user) {
      fetchSavedAddresses();
      // Pre-fill email from session
      setShippingAddress((prev) => ({
        ...prev,
        email: session.user?.email || "",
        fullName: session.user?.name || "",
      }));
    }
  }, [session]);

  const fetchSavedAddresses = async () => {
    try {
      const response = await fetch("/api/user/addresses");
      if (response.ok) {
        const data = await response.json();
        setSavedAddresses(data);
        // If user has a default address, select it
        const defaultAddr = data.find((a: any) => a.isDefault);
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id);
          setUseNewAddress(false);
        }
      }
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const validateShipping = () => {
    if (useNewAddress) {
      const required = ["fullName", "phone", "addressLine1", "city", "state", "pincode"];
      for (const field of required) {
        if (!shippingAddress[field as keyof ShippingAddress]) {
          setError(`Please fill in ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`);
          return false;
        }
      }
      if (shippingAddress.pincode.length !== 6) {
        setError("Please enter a valid 6-digit pincode");
        return false;
      }
      if (shippingAddress.phone.length < 10) {
        setError("Please enter a valid phone number");
        return false;
      }
    } else if (!selectedAddressId) {
      setError("Please select a delivery address");
      return false;
    }
    setError(null);
    return true;
  };

  const handleProceedToPayment = () => {
    if (validateShipping()) {
      setStep("payment");
    }
  };

  const getShippingData = () => {
    if (useNewAddress) {
      return shippingAddress;
    }
    const selected = savedAddresses.find((a) => a.id === selectedAddressId);
    return {
      fullName: selected?.fullName || "",
      phone: selected?.phone || "",
      email: session?.user?.email || "",
      addressLine1: selected?.addressLine1 || "",
      addressLine2: selected?.addressLine2 || "",
      city: selected?.city || "",
      state: selected?.state || "",
      pincode: selected?.pincode || "",
    };
  };

  const handlePayment = async () => {
    if (!session?.user) {
      router.push("/auth/login?callbackUrl=/checkout");
      return;
    }

    setLoading(true);
    setError(null);
    setStep("processing");

    try {
      const addressData = getShippingData();

      // Step 1: Create order in database with pending status
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            size: item.size,
            price: item.price,
          })),
          shippingAddress: addressData,
          paymentMethod,
          subtotal,
          shipping,
          total,
        }),
      });

      if (!orderResponse.ok) {
        const err = await orderResponse.json();
        throw new Error(err.error || "Failed to create order");
      }

      const order = await orderResponse.json();

      // Step 2: Create Razorpay order
      const razorpayResponse = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          receipt: order.orderNumber,
        }),
      });

      if (!razorpayResponse.ok) {
        throw new Error("Failed to initialize payment");
      }

      const razorpayOrder = await razorpayResponse.json();

      // Step 3: Open Razorpay checkout
      const options = {
        key: razorpayOrder.keyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "One More Piece",
        description: `Order #${order.orderNumber}`,
        order_id: razorpayOrder.orderId,
        handler: async function (response: any) {
          // Step 4: Verify payment
          try {
            const verifyResponse = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: order.id,
              }),
            });

            if (verifyResponse.ok) {
              // Payment successful - clear cart and redirect
              clear();
              router.push(`/order-confirmation/${order.orderNumber}`);
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (err) {
            setError("Payment verification failed. Please contact support.");
            setStep("payment");
            setLoading(false);
          }
        },
        prefill: {
          name: addressData.fullName,
          email: addressData.email || session.user.email,
          contact: addressData.phone,
        },
        theme: {
          color: "#171717",
        },
        modal: {
          ondismiss: function () {
            setStep("payment");
            setLoading(false);
            setError("Payment was cancelled. Your order is saved - you can retry payment.");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err: any) {
      console.error("Payment error:", err);
      setError(err.message || "Something went wrong. Please try again.");
      setStep("payment");
      setLoading(false);
    }
  };

  // Redirect if not logged in
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 p-8">
          <ShoppingBag className="h-16 w-16 mx-auto text-neutral-300" />
          <h1 className="text-2xl font-bold text-neutral-900">Please login to checkout</h1>
          <p className="text-neutral-500">You need to be logged in to complete your purchase.</p>
          <Link href="/auth/login?callbackUrl=/checkout">
            <Button size="lg">Login to Continue</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 p-8">
          <ShoppingBag className="h-16 w-16 mx-auto text-neutral-300" />
          <h1 className="text-2xl font-bold text-neutral-900">Your cart is empty</h1>
          <p className="text-neutral-500">Add some items to your cart before checking out.</p>
          <Link href="/products">
            <Button size="lg">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="container-page">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className={`flex items-center gap-2 ${step === "shipping" ? "text-neutral-900" : "text-neutral-400"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === "shipping" ? "bg-neutral-900 text-white" : "bg-neutral-200"
            }`}>
              1
            </div>
            <span className="hidden sm:inline font-medium">Shipping</span>
          </div>
          <div className="w-12 h-px bg-neutral-300" />
          <div className={`flex items-center gap-2 ${step === "payment" || step === "processing" ? "text-neutral-900" : "text-neutral-400"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === "payment" || step === "processing" ? "bg-neutral-900 text-white" : "bg-neutral-200"
            }`}>
              2
            </div>
            <span className="hidden sm:inline font-medium">Payment</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr,400px] gap-8">
          {/* Main Content */}
          <div className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            {step === "shipping" && (
              <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-neutral-100 rounded-lg">
                    <MapPin className="h-5 w-5 text-neutral-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-neutral-900">Delivery Address</h2>
                    <p className="text-sm text-neutral-500">Where should we deliver your order?</p>
                  </div>
                </div>

                {/* Saved Addresses */}
                {savedAddresses.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-neutral-700">Saved Addresses</p>
                    <div className="grid gap-3">
                      {savedAddresses.map((addr) => (
                        <label
                          key={addr.id}
                          className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${
                            !useNewAddress && selectedAddressId === addr.id
                              ? "border-neutral-900 bg-neutral-50"
                              : "border-neutral-200 hover:border-neutral-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="address"
                            checked={!useNewAddress && selectedAddressId === addr.id}
                            onChange={() => {
                              setUseNewAddress(false);
                              setSelectedAddressId(addr.id);
                            }}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-neutral-900">{addr.fullName}</p>
                            <p className="text-sm text-neutral-600">
                              {addr.addressLine1}
                              {addr.addressLine2 && `, ${addr.addressLine2}`}
                            </p>
                            <p className="text-sm text-neutral-600">
                              {addr.city}, {addr.state} - {addr.pincode}
                            </p>
                            <p className="text-sm text-neutral-500">{addr.phone}</p>
                          </div>
                          {addr.isDefault && (
                            <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded">
                              Default
                            </span>
                          )}
                        </label>
                      ))}
                    </div>
                    
                    <label className="flex items-center gap-2 text-sm text-neutral-600 cursor-pointer">
                      <input
                        type="radio"
                        name="address"
                        checked={useNewAddress}
                        onChange={() => setUseNewAddress(true)}
                      />
                      Add new address
                    </label>
                  </div>
                )}

                {/* New Address Form */}
                {(useNewAddress || savedAddresses.length === 0) && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={shippingAddress.fullName}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={shippingAddress.phone}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                        placeholder="9876543210"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={shippingAddress.email}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Address Line 1 *
                      </label>
                      <input
                        type="text"
                        name="addressLine1"
                        value={shippingAddress.addressLine1}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                        placeholder="House/Flat No., Building Name, Street"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Address Line 2
                      </label>
                      <input
                        type="text"
                        name="addressLine2"
                        value={shippingAddress.addressLine2}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                        placeholder="Landmark (Optional)"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={shippingAddress.city}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                        placeholder="Mumbai"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={shippingAddress.state}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                        placeholder="Maharashtra"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={shippingAddress.pincode}
                        onChange={handleAddressChange}
                        maxLength={6}
                        className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                        placeholder="400001"
                      />
                    </div>
                  </div>
                )}

                <Button className="w-full" size="lg" onClick={handleProceedToPayment}>
                  Continue to Payment
                </Button>
              </div>
            )}

            {(step === "payment" || step === "processing") && (
              <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-neutral-100 rounded-lg">
                    <CreditCard className="h-5 w-5 text-neutral-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-neutral-900">Payment Method</h2>
                    <p className="text-sm text-neutral-500">Choose how you want to pay</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <label
                    className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-colors ${
                      paymentMethod === "upi"
                        ? "border-neutral-900 bg-neutral-50"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "upi"}
                        onChange={() => setPaymentMethod("upi")}
                      />
                      <div>
                        <p className="font-medium text-neutral-900">UPI</p>
                        <p className="text-sm text-neutral-500">Pay using GPay, PhonePe, Paytm, etc.</p>
                      </div>
                    </div>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-medium">
                      Recommended
                    </span>
                  </label>

                  <label
                    className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-colors ${
                      paymentMethod === "card"
                        ? "border-neutral-900 bg-neutral-50"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "card"}
                        onChange={() => setPaymentMethod("card")}
                      />
                      <div>
                        <p className="font-medium text-neutral-900">Credit / Debit Card</p>
                        <p className="text-sm text-neutral-500">Visa, Mastercard, RuPay</p>
                      </div>
                    </div>
                  </label>
                </div>

                {/* Security badges */}
                <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-xl">
                  <Shield className="h-5 w-5 text-green-600" />
                  <p className="text-sm text-neutral-600">
                    Your payment is secured with 256-bit SSL encryption
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep("shipping")}
                    disabled={loading}
                  >
                    Back
                  </Button>
                  <Button
                    className="flex-1"
                    size="lg"
                    onClick={handlePayment}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `Pay ₹${total.toLocaleString("en-IN")}`
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-6">
              <h2 className="font-semibold text-neutral-900">Order Summary</h2>

              {/* Items */}
              <div className="space-y-4 max-h-[300px] overflow-y-auto">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.size}`} className="flex gap-4">
                    <div className="relative h-20 w-16 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                      {item.images?.[0]?.startsWith("http") ? (
                        <Image
                          src={item.images[0]}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-neutral-400 text-xl font-bold">
                          {item.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-neutral-900 truncate">{item.name}</p>
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

              <div className="border-t border-neutral-200 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Subtotal</span>
                  <span className="text-neutral-900">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Shipping</span>
                  <span className={shipping === 0 ? "text-green-600 font-medium" : "text-neutral-900"}>
                    {shipping === 0 ? "FREE" : `₹${shipping}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-neutral-500">
                    Free shipping on orders above ₹{freeShippingThreshold.toLocaleString("en-IN")}
                  </p>
                )}
                <div className="flex justify-between text-lg font-semibold pt-3 border-t border-neutral-200">
                  <span className="text-neutral-900">Total</span>
                  <span className="text-neutral-900">₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Trust badges */}
              <div className="space-y-2 pt-4 border-t border-neutral-200">
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <Truck className="h-4 w-4" />
                  <span>Free delivery on orders above ₹2,500</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <Shield className="h-4 w-4" />
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>7-day easy returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
