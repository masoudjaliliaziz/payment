import React from "react";

type PaymentType = "check" | "cash";

type Props = {
  value: PaymentType;
  onChange: (value: PaymentType) => void;
  className?: string;
};

const PaymentTypeDropdown: React.FC<Props> = ({
  value,
  onChange,
  className = "",
}) => {
  const paymentTypes = [
    { value: "check" as PaymentType, label: "ثبت چک" },
    { value: "cash" as PaymentType, label: "واریز نقدی" },
  ];

  const selectedType = paymentTypes.find((type) => type.value === value);

  return (
    <details className={`dropdown ${className}`}>
      <summary className="btn m-1 bg-base-200 hover:bg-base-300 border-base-300 justify-end">
        {selectedType?.label || "انتخاب نوع پرداخت"}
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </summary>
      <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow-lg border border-base-300">
        {paymentTypes.map((type) => (
          <li key={type.value}>
            <button
              type="button"
              className={`w-full text-right justify-end ${
                value === type.value ? "bg-primary text-primary-content" : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                onChange(type.value);
                // Close the dropdown
                const details = e.currentTarget.closest("details");
                if (details) {
                  details.removeAttribute("open");
                }
              }}
            >
              {type.label}
            </button>
          </li>
        ))}
      </ul>
    </details>
  );
};

export default PaymentTypeDropdown;
