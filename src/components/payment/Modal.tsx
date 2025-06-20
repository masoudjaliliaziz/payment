type Props = {
  id: string; // آی‌دی مخصوص برای هر مدال
  title: {
    slag: string;
    data: string;
  };
};

function Modal({ id, title }: Props) {
  const { slag, data } = title;

  const openModal = () => {
    const dialog = document.getElementById(id) as HTMLDialogElement | null;
    if (dialog) dialog.showModal();
  };

  const closeModal = () => {
    const dialog = document.getElementById(id) as HTMLDialogElement | null;
    if (dialog) dialog.close();
  };

  return (
    <>
      <button type="button" className="btn text-primary" onClick={openModal}>
        {slag}
      </button>

      <dialog id={id} className="modal">
        <div className="modal-box flex flex-col items-end justify-center">
          <span className="font-bold text-lg text-base-content">{slag}</span>
          <span className="py-4 text-base-content">{data}</span>
          <div className="modal-action">
            <form method="dialog">
              <button type="button" className="btn" onClick={closeModal}>
                بستن
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}

export default Modal;
