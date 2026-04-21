import React, { useState } from "react";
import MovingLogos from "../components/MovingLogos";
import Testimonials from "../components/Testimonals";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Individual",
    price: { monthly: "Free", yearly: "Free" },
    desc: "Best for personal use",
    features: [
      "1 Member",
      "1 Workspace",
      "Basic Chat",
      "Limited Storage",
    ],
  },
  {
    name: "Startup",
    price: { monthly: "₹499", yearly: "₹399" },
    desc: "For growing teams",
    popular: true,
    features: [
      "Up to 10 Members",
      "Multiple Workspaces",
      "Real-time Chat",
      "File Sharing",
      "Basic Analytics",
    ],
  },
  {
    name: "Company",
    price: { monthly: "₹1999", yearly: "₹1599" },
    desc: "For scaling organizations",
    features: [
      "50+ Members",
      "Departments",
      "Video Calls",
      "Advanced Analytics",
      "Priority Support",
    ],
  },
  {
    name: "Big Tech",
    price: { monthly: "₹4999", yearly: "₹3999" },
    desc: "Enterprise solution",
    features: [
      "Unlimited Members",
      "AI Chatbot",
      "Smart Assignment",
      "Full Analytics",
      "24/7 Support",
    ],
  },
];

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--bg-main)] px-6">
        <Navbar />

      <div className="max-w-7xl mx-auto pt-15">

        {/* 🔥 HERO */}
        <div className="text-center mb-16 relative">

          {/* glow */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-20 w-[400px] h-[400px] bg-[var(--accent)]/20 blur-3xl opacity-30 rounded-full" />

          <h1 className="text-4xl md:text-5xl font-semibold text-[var(--text-primary)]">
            Pricing that grows with you
          </h1>

          <p className="text-[var(--text-secondary)] mt-4 max-w-xl mx-auto">
            Start for free, upgrade when you need more power. No hidden costs.
          </p>

          {/* 🔥 TOGGLE */}
          <div className="mt-8 inline-flex items-center gap-3 
                          bg-[var(--bg-secondary)] 
                          border border-[var(--border)] 
                          rounded-full p-1">

            <button
              onClick={() => setYearly(false)}
              className={`px-4 py-1 rounded-full text-sm transition ${
                !yearly
                  ? "bg-[var(--accent)] text-white"
                  : "text-[var(--text-secondary)]"
              }`}
            >
              Monthly
            </button>

            <button
              onClick={() => setYearly(true)}
              className={`px-4 py-1 rounded-full text-sm transition ${
                yearly
                  ? "bg-[var(--accent)] text-white"
                  : "text-[var(--text-secondary)]"
              }`}
            >
              Yearly (Save 20%)
            </button>

          </div>

        </div>

        {/* 🔥 CARDS */}
        <div
         onClick={() => navigate('/dashboard')}
          className="grid cursor-pointer grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {plans.map((plan, i) => (
            <div
              key={i}
              className={`group relative rounded-2xl p-6 
              bg-[var(--bg-secondary)] 
              border border-[var(--border)] 
              transition-all duration-500 
              hover:-translate-y-3 hover:scale-[1.03]
              
              ${
                plan.popular
                  ? "border-[var(--accent)] shadow-[0_0_40px_var(--accent-glow)]"
                  : "shadow-sm"
              }`}
            >

              {/* POPULAR */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 
                                bg-[var(--accent)] text-white text-xs px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}

              {/* TITLE */}
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                {plan.name}
              </h3>

              {/* PRICE */}
              <div className="mt-4">
                <span className="text-3xl font-bold text-[var(--text-primary)]">
                  {yearly ? plan.price.yearly : plan.price.monthly}
                </span>
                {plan.price.monthly !== "Free" && (
                  <span className="text-sm text-[var(--text-secondary)]">
                    /month
                  </span>
                )}
              </div>

              {/* DESC */}
              <p className="text-sm text-[var(--text-secondary)] mt-2">
                {plan.desc}
              </p>

              {/* FEATURES */}
              <ul className="mt-6 space-y-3 text-sm">
                {plan.features.map((f, idx) => (
                  <li key={idx} className="flex gap-2 text-[var(--text-secondary)]">
                    <span className="text-[var(--accent)]">✔</span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* BUTTON */}
              <button
                className={`mt-8  w-full py-2 rounded-xl text-sm font-medium transition-all duration-300
                
                ${
                  plan.popular
                    ? "bg-[var(--accent)] text-white hover:bg-[var(--accent-soft)] hover:shadow-[0_0_20px_var(--accent-glow)]"
                    : "bg-[var(--bg-hover)] text-[var(--text-primary)] hover:bg-[var(--accent)] hover:text-white"
                }`}
              >
                Get Started
              </button>

              {/* glow hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 
                              transition duration-500 
                              bg-[radial-gradient(circle_at_top,rgba(255,106,0,0.15),transparent_70%)]" />
            </div>
          ))}

        </div>

        <MovingLogos />
        <Testimonials />
        <Footer />

      </div>
    </div>
  );
}