import * as React from 'react';

interface SignUpConfirmModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

export function ConfirmModal({
  isOpen,
  onRequestClose,
  children,
}: React.PropsWithChildren<SignUpConfirmModalProps>) {
  // TODO:
  // add `is-clipped` class to body when modal is open
  return (
    <section className={`modal ${isOpen ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={onRequestClose}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Potwierdź</p>
        </header>
        <section className="modal-card-body">{children}</section>
        <footer className="modal-card-foot">
          <button className="button is-success" onClick={onRequestClose}>
            OK
          </button>
        </footer>
      </div>

      <button
        className="modal-close is-large"
        aria-label="close"
        onClick={onRequestClose}
      ></button>
    </section>
  );
}
