import React from "react";

type NationalIdType = "haghighi" | "hoghoghi";

type Props = {
  value: NationalIdType;
  onChange: (value: NationalIdType) => void;
  className?: string;
};

const NationalIdTypeDropdown: React.FC<Props> = ({
  value,
  onChange,
  className = "",
}) => {
  const nationalIdTypes = [
    {
      value: "haghighi" as NationalIdType,
      label: "شناسه حقیقی",
      description:
        "شناسه حقیقی مربوط به افراد حقیقی است که شامل کد ملی می‌شود.",
    },
    {
      value: "hoghoghi" as NationalIdType,
      label: "شناسه حقوقی",
      description:
        "شناسه حقوقی مخصوص شرکت‌ها و سازمان‌ها است و شامل شناسه ملی شرکت می‌شود.",
    },
  ];

  const selectedType = nationalIdTypes.find((type) => type.value === value);

  return (
    <details className={`dropdown ${className}`}>
      <summary className="btn m-1 bg-base-200 hover:bg-base-300 border-base-300 justify-end">
        {selectedType?.label || "انتخاب نوع شناسه"}
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
      <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-64 p-2 shadow-lg border border-base-300">
        {nationalIdTypes.map((type) => (
          <li key={type.value}>
            <button
              type="button"
              className={`w-full text-right p-3 justify-end ${
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
              <div className="flex flex-col items-end">
                <span className="font-semibold">{type.label}</span>
                <span className="text-xs opacity-70 mt-1">
                  {type.description}
                </span>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </details>
  );
};

export default NationalIdTypeDropdown;
