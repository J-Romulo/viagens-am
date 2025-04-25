import { JSX } from 'react';
import { ContentRenderer, Popover } from 'react-tiny-popover';

interface CustomPopoverProps {
  isOpen: boolean;
  content: JSX.Element | ContentRenderer;
  onClose: () => void;
  children: JSX.Element;
  zIndex?: string | undefined;
}
export function CustomPopover({
  children,
  isOpen,
  onClose,
  content,
  zIndex,
}: CustomPopoverProps) {
  return (
    <Popover
      isOpen={isOpen}
      positions={['bottom', 'left', 'right']} // preferred positions by priority
      onClickOutside={onClose}
      containerStyle={{ zIndex: zIndex }}
      content={content}
    >
      {children}
    </Popover>
  );
}
