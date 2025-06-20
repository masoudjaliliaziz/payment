type Props = {
  title: {
    slag: string;
    data: string;
  };
};

function ChecksPreviewItem({ title }: Props) {
  const { slag, data } = title;

  return (
    <div className="flex flex-row-reverse  justify-center items-center bg-base-100 rounded-md p-1 gap-2 ">
      <span className="font-bold text-primary"> {slag} </span>
      {slag !== "وضعیت" && (
        <span className="text-base-content font-semibold text-sm m-0">
          {data}
        </span>
      )}
      {slag === "وضعیت" && (
        <span className="text-base-content font-semibold text-sm m-0">
          {data === "0"
            ? "در انتظار تایید کارشناس"
            : data === "1"
            ? "در انتظار تایید خزانه "
            : data === "2"
            ? "رد شده توسط کارشناس"
            : data === "3"
            ? "رد شده توسط خزانه"
            : "تایید نهایی"}
        </span>
      )}
    </div>
  );
}

export default ChecksPreviewItem;
