import React, { useState, useEffect } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";

interface SafeDatePickerProps {
  value?: DateObject | null;
  onChange?: (date: DateObject | null) => void;
  placeholder?: string;
  format?: string;
  inputClass?: string;
  maxDate?: DateObject;
  minDate?: DateObject;
  disabled?: boolean;
  className?: string;
}

const SafeDatePicker: React.FC<SafeDatePickerProps> = ({
  value,
  onChange,
  placeholder = "تاریخ را انتخاب کنید",
  format = "YYYY/MM/DD",
  inputClass = "input input-bordered w-full",
  maxDate,
  minDate,
  disabled = false,
  className,
}) => {
  const [calendar, setCalendar] = useState<any>(null);
  const [locale, setLocale] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadDatePickerConfig = async () => {
      try {
        const persian = await import("react-date-object/calendars/persian");
        const persian_fa = await import("react-date-object/locales/persian_fa");

        setCalendar(persian.default);
        setLocale(persian_fa.default);
        setIsLoaded(true);
      } catch (error) {
        console.error("Error loading DatePicker config:", error);
        setIsLoaded(true); // Still render without calendar/locale
      }
    };

    loadDatePickerConfig();
  }, []);

  const handleChange = (date: DateObject | null) => {
    try {
      if (onChange) {
        onChange(date);
      }
    } catch (error) {
      console.error("DatePicker onChange error:", error);
    }
  };

  if (!isLoaded) {
    return (
      <div className={className}>
        <input
          type="text"
          className={inputClass}
          placeholder={placeholder}
          disabled
        />
      </div>
    );
  }

  return (
    <div className={className}>
      <DatePicker
        calendar={calendar}
        locale={locale}
        value={value}
        onChange={handleChange}
        inputClass={inputClass}
        placeholder={placeholder}
        format={format}
        maxDate={maxDate}
        minDate={minDate}
        disabled={disabled}
      />
    </div>
  );
};

export default SafeDatePicker;
