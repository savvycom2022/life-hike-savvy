import React from "react";
import Modal from "react-modal";
import { AiFillCloseCircle } from "react-icons/ai";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backGround: "none",
  },
};
export interface AppModalProps {
  isOpen: boolean;
  header?: string;
  afterOpenModal?: () => void;
  onClose: () => void;
  contentLabel?: "string";
}
export default function AppModal({
  header,
  isOpen,
  afterOpenModal,
  children,
  onClose,
  contentLabel,
}: React.PropsWithChildren<AppModalProps>) {
  return (
    <div>
      <Modal
        isOpen={isOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={onClose}
        contentLabel={contentLabel}
        style={customStyles}
        ariaHideApp={false}
      >
        <div className="w-screen h-screen opacity-50 bg-inspire bg-dark-100"></div>
        <div className="absolute top-0 flex items-center justify-center w-screen h-screen bg-none">
          <div className="absolute px-5 pb-10 rounded-lg bg-dark-500 app-modal-content-animations w-50vw">
            <div className="text-inspire">
              <div className="absolute pt-4 right-4"><AiFillCloseCircle className="w-5 h-5 cursor-pointer" onClick={onClose} /></div>
              <div className="w-full pt-10 text-xl text-center">{header}</div>
            </div>
            <div className="">{children}</div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
