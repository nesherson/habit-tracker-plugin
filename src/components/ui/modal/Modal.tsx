import { X } from 'lucide-react';
import { ReactNode, useEffect, useRef, MouseEvent } from 'react';

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: ReactNode;
	footer?: ReactNode;
	children: ReactNode;
}

export default function Modal({
	isOpen,
	onClose,
	title,
	footer,
	children,
}: ModalProps) {
	const dialogRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!isOpen) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
		};

		activeDocument.addEventListener('keydown', handleKeyDown);
		activeDocument.body.addClass('overflow-hidden');

		return () => {
			activeDocument.removeEventListener('keydown', handleKeyDown);
			activeDocument.body.removeClass('overflow-hidden');
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget) onClose();
	};

	return (
		<div className="modal-backdrop" onClick={handleBackdropClick}>
			<div
				className="modal"
				ref={dialogRef}
				role="dialog"
				aria-modal="true"
			>
				<div className="modal-header">
					<h1 className="modal-title">{title}</h1>
					<button
						className="modal-close"
						onClick={onClose}
						aria-label="Close"
					>
						<X size={12} />
					</button>
				</div>

				<div className="modal-body">{children}</div>

				{footer && <div className="modal-footer">{footer}</div>}
			</div>
		</div>
	);
}
