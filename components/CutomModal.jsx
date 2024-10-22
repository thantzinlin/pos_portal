// components/CustomModal.js
import React from "react";
import Modal from "react-modal";


Modal.setAppElement("html");

const CustomModal = ({ children }) => {
  return (
    // <Modal
    //   isOpen={showModel}
    //   onRequestClose={handleClose}
    //   contentLabel="Example Modal"
    //   style={customStyles}
    // >
    //
    // </Modal>
    
      <dialog id="my_modal_2" className="modal">
        <div className="modal-box" style={{ maxWidth: "40%", padding: "0" }}>
          {children}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
  );
};

export default CustomModal;
