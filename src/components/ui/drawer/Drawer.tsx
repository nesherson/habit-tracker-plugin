import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

interface DrawerProps {
	isOpen: boolean;
	onClose: () => void;
	title?: ReactNode;
	children: ReactNode;
}

export function Drawer({ isOpen, onClose, title, children }: DrawerProps) {
	useEffect(() => {
		if (!isOpen) return;
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
		};
		activeDocument.addEventListener('keydown', handleKeyDown);
		return () =>
			activeDocument.removeEventListener('keydown', handleKeyDown);
	}, [isOpen, onClose]);

	return (
		<div
			className={`ht-drawer-overlay ${isOpen ? 'ht-drawer-overlay--open' : ''}`}
			onClick={onClose}
		>
			<div
				className={`ht-drawer ${isOpen ? 'ht-drawer--open' : ''}`}
				onClick={(e) => e.stopPropagation()}
			>
				<div className="ht-drawer-header">
					{title && <span className="ht-drawer-title">{title}</span>}
					<button
						className="ht-drawer-close"
						onClick={onClose}
						aria-label="Close drawer"
					>
						<X size={18} />
					</button>
				</div>
				<div className="ht-drawer-body">{children}</div>
			</div>
		</div>
	);
}
