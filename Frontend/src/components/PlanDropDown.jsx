import { useState } from "react";
import { ChevronDown } from "lucide-react";

const plans = [
  { label: "Free", value: "individual" },
  { label: "Startup - ₹499", value: "startup" },
  { label: "Company - ₹1999", value: "company" },
  { label: "BigTech - ₹4999", value: "bigtech" },
];

export default function PlanDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);

  const selected = plans.find((p) => p.value === value);

  return (
    <div className="relative">

      {/* 🔥 BUTTON */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-xl 
                   bg-[var(--bg-hover)] border border-[var(--border)] 
                   text-[var(--text-primary)] text-sm 
                   hover:border-[var(--accent)]/40 
                   transition"
      >
        {selected?.label || "Select Plan"}

        <ChevronDown
          size={16}
          className={`transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* 🔥 DROPDOWN */}
      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-xl 
                        bg-[var(--bg-secondary)] 
                        border border-[var(--border)] 
                        shadow-[0_10px_30px_rgba(0,0,0,0.4)] 
                        overflow-hidden">

          {plans.map((plan) => (
            <div
              key={plan.value}
              onClick={() => {
                onChange(plan.value);
                setOpen(false);
              }}
              className={`px-3 py-2 text-sm cursor-pointer transition
                ${
                  value === plan.value
                    ? "bg-[var(--accent)] text-white"
                    : "text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
                }`}
            >
              {plan.label}
            </div>
          ))}

        </div>
      )}
    </div>
  );
}