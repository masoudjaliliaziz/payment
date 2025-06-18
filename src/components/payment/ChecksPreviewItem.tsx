type Props = {
  title: {
    slag: string;
    data: string;
  };
};

function ChecksPreviewItem({ title }: Props) {
  const { slag, data } = title;
  return (
    <div className="flex flex-row-reverse justify-center items-center bg-base-100 rounded-md p-1 gap-2 ">
      <span className="font-bold text-primary"> {slag} </span>
      <p> {data}</p>
    </div>
  );
}

export default ChecksPreviewItem;
