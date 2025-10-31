import { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { SetType } from '../types/Templatetypes';

export const typeColorMap: Record<SetType, string> = {
  F: 'text-red-500 border-red-400',
  W: 'text-yellow-500 border-yellow-400',
  N: 'text-blue-500 border-blue-400',
};

interface CustomDropdownProps {
  value: SetType;
  onChange: (selected: SetType) => void;
  className?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  value,
  onChange,
  className,
}: CustomDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const options: SetType[] = ['F', 'W', 'N'];

  // Position dropdown under the button
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutsideOrScroll = (event: MouseEvent | Event) => {
      if (
        buttonRef.current &&
        !(
          event instanceof MouseEvent &&
          buttonRef.current.contains(event.target as Node)
        )
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutsideOrScroll);
      window.addEventListener('scroll', handleClickOutsideOrScroll, true);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideOrScroll);
      window.removeEventListener('scroll', handleClickOutsideOrScroll, true);
    };
  }, [isOpen]);

  const handleSelect = (option: SetType) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <>
      <div className={`relative inline-block ${className}`}>
        <button
          ref={buttonRef}
          className={`w-[40px] text-xs py-1 border rounded bg-white focus:outline-none ${typeColorMap[value]}`}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {value}
        </button>
      </div>

      {/* Dropdown with animation */}
      {ReactDOM.createPortal(
        <div
          style={{
            top: position.top,
            left: position.left,
            width: position.width,
            position: 'absolute',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? 'translateY(0)' : 'translateY(-10px)',
            pointerEvents: isOpen ? 'auto' : 'none',
            zIndex: 9999,
          }}
          className="bg-white border border-gray-300 rounded shadow-lg"
        >
          {options.map((option) => (
            <div
              key={option}
              className="px-2 py-1 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSelect(option)}
            >
              <div className={`${typeColorMap[option]}`}>{option}</div>
            </div>
          ))}
        </div>,
        document.body,
      )}
    </>
  );
};

export default CustomDropdown;
