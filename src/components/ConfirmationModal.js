import React from "react";
import PropTypes from "prop-types";

import { Modal, Button } from "react-bootstrap";
import { confirmable, createConfirmation } from "react-confirm";

const ConfirmationModal = ({
  proceedLabel,
  cancelLabel,
  title = "Please confirm",
  confirmation = "Are you sure?",
  show,
  proceed,
  enableEscape = true,
}) => {
  return (
    <div className="static-modal">
      <Modal
        show={show}
        onHide={() => proceed(false)}
        backdrop={enableEscape ? true : "static"}
        keyboard={enableEscape}
      >
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{confirmation}</Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={() => proceed(false)}>
            {cancelLabel}
          </Button>
          <Button variant="danger" onClick={() => proceed(true)}>
            {proceedLabel}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

ConfirmationModal.propTypes = {
  proceedLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  title: PropTypes.string,
  confirmation: PropTypes.string,
  show: PropTypes.bool,
  proceed: PropTypes.func, // called when ok button is clicked.
  enableEscape: PropTypes.bool,
};

export function confirm(
  confirmation,
  proceedLabel = "Delete now",
  cancelLabel = "Cancel",
  options = {}
) {
  return createConfirmation(confirmable(ConfirmationModal))({
    confirmation,
    proceedLabel,
    cancelLabel,
    ...options,
  });
}

export default ConfirmationModal;
