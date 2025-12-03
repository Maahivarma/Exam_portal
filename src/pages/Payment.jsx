 import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  
  const testInfo = location.state?.testInfo || {
    title: "Premium Test",
    company: "Company",
    price: 199,
    originalPrice: 499
  };

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: ""
  });
  const [upiId, setUpiId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

  // Valid coupon codes
  const validCoupons = {
    "FIRST50": 50,
    "GTECHNO20": 20,
    "STUDENT30": 30,
    "PREMIUM10": 10
  };

  const applyCoupon = () => {
    const code = couponCode.toUpperCase();
    if (validCoupons[code]) {
      setDiscount(validCoupons[code]);
    } else {
      alert("Invalid coupon code!");
      setDiscount(0);
    }
  };

  const finalPrice = Math.round(testInfo.price * (1 - discount / 100));

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } });
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate success
    setIsProcessing(false);
    setPaymentSuccess(true);

    // Store purchase in localStorage
    const purchases = JSON.parse(localStorage.getItem("purchases") || "[]");
    purchases.push({
      testId: testInfo.id,
      testTitle: testInfo.title,
      company: testInfo.company,
      price: finalPrice,
      purchasedAt: new Date().toISOString(),
      userId: user?.id
    });
    localStorage.setItem("purchases", JSON.stringify(purchases));
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 shadow-2xl text-center max-w-md w-full">
          <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <span className="text-5xl">✅</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Payment Successful!</h1>
          <p className="text-slate-500 mb-6">
            Thank you for your purchase. You can now access "{testInfo.title}".
          </p>
          
          <div className="bg-slate-50 rounded-xl p-4 mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-slate-500">Amount Paid</span>
              <span className="font-bold text-green-600">₹{finalPrice}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Transaction ID</span>
              <span className="font-mono text-sm">GT{Date.now()}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
            >
              Start Test →
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
            >
              Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-3">
          🔒 Secure Payment
        </span>
        <h1 className="text-3xl font-bold text-slate-800">Complete Your Purchase</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Payment Form */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Payment Methods */}
            <div className="p-6 border-b">
              <h2 className="font-bold text-slate-800 mb-4">Select Payment Method</h2>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "card", label: "Card", icon: "💳" },
                  { id: "upi", label: "UPI", icon: "📱" },
                  { id: "netbanking", label: "Net Banking", icon: "🏦" }
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === method.id
                        ? "border-purple-500 bg-purple-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <span className="text-2xl block mb-1">{method.icon}</span>
                    <span className="text-sm font-medium">{method.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Form */}
            <form onSubmit={handlePayment} className="p-6">
              {paymentMethod === "card" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      value={cardDetails.number}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();
                        setCardDetails({ ...cardDetails, number: value });
                      }}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-purple-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-purple-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        maxLength={5}
                        value={cardDetails.expiry}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, "");
                          if (value.length > 2) value = value.slice(0, 2) + "/" + value.slice(2);
                          setCardDetails({ ...cardDetails, expiry: value });
                        }}
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-purple-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">CVV</label>
                      <input
                        type="password"
                        placeholder="***"
                        maxLength={3}
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, "") })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-purple-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "upi" && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">UPI ID</label>
                  <input
                    type="text"
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-purple-500 focus:outline-none"
                    required
                  />
                  <div className="mt-4 grid grid-cols-4 gap-3">
                    {["GPay", "PhonePe", "Paytm", "BHIM"].map((app) => (
                      <button
                        key={app}
                        type="button"
                        className="p-3 rounded-xl border border-slate-200 hover:border-purple-500 hover:bg-purple-50 transition-all text-sm font-medium"
                      >
                        {app}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {paymentMethod === "netbanking" && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Select Bank</label>
                  <div className="grid grid-cols-2 gap-3">
                    {["SBI", "HDFC", "ICICI", "Axis", "Kotak", "PNB", "BOB", "Other"].map((bank) => (
                      <button
                        key={bank}
                        type="button"
                        className="p-4 rounded-xl border-2 border-slate-200 hover:border-purple-500 hover:bg-purple-50 transition-all text-left"
                      >
                        <span className="font-medium">{bank}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className={`w-full mt-6 py-4 rounded-xl font-bold text-white transition-all ${
                  isProcessing
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg"
                }`}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Processing...
                  </span>
                ) : (
                  `Pay ₹${finalPrice}`
                )}
              </button>

              {/* Security Notice */}
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-500">
                <span>🔒</span>
                <span>Secured by 256-bit SSL encryption</span>
              </div>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
            <h2 className="font-bold text-slate-800 mb-4">Order Summary</h2>
            
            {/* Test Info */}
            <div className="bg-slate-50 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                  📝
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{testInfo.title}</h3>
                  <p className="text-sm text-slate-500">{testInfo.company}</p>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-slate-500">Original Price</span>
                <span className="text-slate-400 line-through">₹{testInfo.originalPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Sale Price</span>
                <span className="text-slate-800">₹{testInfo.price}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon Discount ({discount}%)</span>
                  <span>-₹{testInfo.price - finalPrice}</span>
                </div>
              )}
              <div className="border-t pt-3 flex justify-between">
                <span className="font-bold text-slate-800">Total</span>
                <span className="font-bold text-2xl text-purple-600">₹{finalPrice}</span>
              </div>
            </div>

            {/* Coupon Code */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">Have a coupon?</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-200 focus:border-purple-500 focus:outline-none text-sm"
                />
                <button
                  type="button"
                  onClick={applyCoupon}
                  className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 transition-colors"
                >
                  Apply
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-2">Try: FIRST50, GTECHNO20, STUDENT30</p>
            </div>

            {/* Features */}
            <div className="bg-green-50 rounded-xl p-4">
              <h4 className="font-medium text-green-800 mb-2">What you get:</h4>
              <ul className="space-y-2 text-sm text-green-700">
                <li className="flex items-center gap-2">
                  <span>✅</span> Lifetime access
                </li>
                <li className="flex items-center gap-2">
                  <span>✅</span> Detailed solutions
                </li>
                <li className="flex items-center gap-2">
                  <span>✅</span> Performance analytics
                </li>
                <li className="flex items-center gap-2">
                  <span>✅</span> Certificate on completion
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

