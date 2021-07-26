import Modal from "react-modal";

export interface ModalProps {
  children?: React.ReactNode;
  afterOpenModal: () => void;
  closeModal: () => void;
  modalIsOpen: boolean;
}

export const MyModal = ({
  children,
  modalIsOpen,
  afterOpenModal,
  closeModal,
}: ModalProps) => {
  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        className="bg-gray-100 max-w-sm mx-auto my-20 p-5"
      >
        <header className="flex flex-row justify-between px-3">
          <h2>Add Variant</h2>
          <button onClick={closeModal}>close</button>
        </header>
        {children}
      </Modal>
    </div>
  );
};
