import { ReactNode, useEffect } from "react";
import Modal from "react-modal";
import { IoClose } from "react-icons/io5";

interface ModalProps {
    children: ReactNode;
	isOpen: boolean;
	headerTitle?: string;
    onRequestClose(
		event: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element>
	): void;
}

export function CustomModal({
	isOpen,
    onRequestClose,
	children,
	headerTitle,
}: ModalProps) {
    useEffect(() => {
        Modal.setAppElement('body');
    }, []);

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            style={{
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    zIndex: 50
                },
                content: {
                    position: 'relative',
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    transform: 'translate(-50%, -50%)',
                    width: '100%',
                    maxWidth: '28rem',
                    padding: '1.5rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }
            }}
            contentLabel={headerTitle}
        >
            <div className="bg-white">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl text-primary-500 font-semibold">{headerTitle}</h2>
                    <button
                        onClick={onRequestClose}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                        <IoClose className="w-6 h-6" />
                    </button>
                </div>
                {children}
            </div>
        </Modal>
    )
}
