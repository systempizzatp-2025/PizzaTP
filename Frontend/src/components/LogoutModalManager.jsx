import React, { useState, useCallback, createContext, useContext, useEffect } from 'react';
import ReactDOM from 'react-dom';

const LogoutModalContext = createContext();

export const useLogoutModal = () => {
  const context = useContext(LogoutModalContext);
  if (!context) {
    throw new Error('useLogoutModal must be used within LogoutModalProvider');
  }
  return context;
};

export const LogoutModalProvider = ({ children }) => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    onConfirm: null,
    onCancel: null,
    title: 'Xác nhận đăng xuất',
    message: 'Bạn có chắc chắn muốn đăng xuất không?'
  });

  const showModal = useCallback(({ onConfirm, onCancel, title, message }) => {
    setModalState({
      isOpen: true,
      onConfirm,
      onCancel,
      title: title || 'Xác nhận đăng xuất',
      message: message || 'Bạn có chắc chắn muốn đăng xuất không?'
    });
  }, []);

  const hideModal = useCallback(() => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  }, []);

  const ModalComponent = () => {
    useEffect(() => {
      if (!modalState.isOpen) return;

      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          hideModal();
          modalState.onCancel?.();
        }
      };

      document.body.classList.add('modal-open');
      document.addEventListener('keydown', handleEscape);

      return () => {
        document.body.classList.remove('modal-open');
        document.removeEventListener('keydown', handleEscape);
      };
    }, [modalState.isOpen, hideModal]);

    if (!modalState.isOpen) return null;

    const handleConfirm = () => {
      modalState.onConfirm?.();
      hideModal();
    };

    const handleCancel = () => {
      modalState.onCancel?.();
      hideModal();
    };

    const handleBackdropClick = (e) => {
      if (e.target === e.currentTarget) {
        handleCancel();
      }
    };

    const modalContent = (
      <div 
        className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60"
        onClick={handleBackdropClick}
      >
        <div 
          className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-3">
            {modalState.title}
          </h3>
          
          <p className="text-center text-gray-600 mb-8 text-lg">
            {modalState.message}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              type="button"
              onClick={handleCancel}
              className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-semibold text-lg transition-colors"
            >
              Hủy
            </button>
            <button 
              type="button"
              onClick={handleConfirm}
              className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl font-semibold text-lg hover:bg-red-600 transition-all"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    );

    return ReactDOM.createPortal(modalContent, document.body);
  };

  return (
    <LogoutModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      <ModalComponent />
    </LogoutModalContext.Provider>
  );
};