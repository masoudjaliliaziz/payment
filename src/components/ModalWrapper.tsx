type ModalWrapperProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function ModalWrapper({
  isOpen,
  onClose,
  children,
}: ModalWrapperProps) {
  if (!isOpen) return null;

  return (
    <dialog open className="modal">
      <div className="modal-box">
        {children}

        <div className="modal-action">
          <form method="dialog">
            <button className="btn" onClick={onClose}>
              بستن
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
