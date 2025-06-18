type Props = {
  title: {
    slag: string;
    data: string;
  };
};

function ChecksPreviewItem({ title }: Props) {
  const { slag, data } = title;
  return (
    <div className="flex flex-row-reverse justify-center items-center bg-base-200 rounded-md p-1 gap-2 ">
      <span className="font-bold"> {slag} </span>
      <p> {data}</p>
    </div>
  );
}

export default ChecksPreviewItem;
