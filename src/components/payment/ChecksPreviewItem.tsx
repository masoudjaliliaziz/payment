type Props = {
  title: {
    slag: string;
    data: string | null | undefined;
  };
};

export default function ChecksPreviewItem({ title }: Props) {
  const { slag, data } = title;

  const safeData = data ?? "—"; // اگه null یا undefined بود، "—" نشون بده

  return (
    <div
      className={`flex justify-center items-center bg-base-100 rounded-md p-1 gap-2 ${
        slag === "شناسه صیادی" || slag === "نام صاحب چک"
          ? "flex-col"
          : "flex-row-reverse"
      }`}
    >
      <span className="font-bold text-primary text-sm">{slag}</span>
      {slag !== "وضعیت" && (
        <span className="text-base-content font-semibold text-sm m-0">
          {safeData}
        </span>
      )}
      {slag === "وضعیت" && (
        <span className="text-base-content font-semibold text-sm m-0">
          {safeData === "0"
            ? "در انتظار تایید کارشناس"
            : safeData === "1"
            ? "در انتظار تایید خزانه "
            : safeData === "2"
            ? "رد شده توسط کارشناس"
            : safeData === "3"
            ? "رد شده توسط خزانه"
            : "تایید نهایی"}
        </span>
      )}
    </div>
  );
}
