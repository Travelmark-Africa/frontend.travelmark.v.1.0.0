import React, { useState } from 'react';
import { Info, AlertTriangle, X } from 'lucide-react';

interface AlertProps {
  type: 'info' | 'warning';
  description: string;
  closable?: boolean;
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({ type, description, closable = true, onClose }) => {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return null;
  }

  const handleClose = () => {
    setVisible(false);
    if (onClose) {
      onClose();
    }
  };

  const alertIcon =
    type === 'info' ? (
      <Info className='text-primary' size={18} />
    ) : (
      <AlertTriangle className='text-yellow-700' size={18} />
    );
  const alertBackground = type === 'info' ? 'bg-blue-50' : 'bg-yellow-50';
  const alertBorder = type === 'info' ? 'border-blue-200' : 'border-yellow-200';
  const alertText = type === 'info' ? 'text-primary' : 'text-yellow-700';

  return (
    <div className={`flex items-start p-2 rounded-lg w-full border ${alertBackground} ${alertBorder}`}>
      <div className='flex-shrink-0 mr-3'>{alertIcon}</div>
      <div className='flex-grow'>
        <p className={`text-sm ${alertText}`}>{description}</p>
      </div>
      {closable && (
        <button
          className='flex-shrink-0 ml-4 text-gray-500 hover:text-gray-800 focus:outline-none'
          onClick={handleClose}
          aria-label='Close'
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default Alert;
