type Props = {
  title: {
    slag: string;
    data: string;
  };
};

function Collapse({ title }: Props) {
  const { slag, data } = title;
  return (
    <div className="bg-base-200 collapse ">
      <input type="checkbox" className="peer" />
      <div className="collapse-title bg-base  peer-checked:bg-primary peer-checked:text-secondary-content text-end w-1/6">
        {slag}
      </div>
      <div className="collapse-content bg-primary text-primary-content peer-checked:bg-primary peer-checked:text-secondary-content flex flex-col items-end justify-start pt-6">
        <p>{data}</p>
      </div>
    </div>
  );
}

export default Collapse;
