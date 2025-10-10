import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Info } from 'lucide-react';

const notificationIcons = {
  success: <CheckCircle className="w-6 h-6 text-white" />,
  error: <XCircle className="w-6 h-6 text-white" />,
  info: <Info className="w-6 h-6 text-white" />,
};

const notificationStyles = {
  success: 'bg-green-600/90',
  error: 'bg-red-600/90',
  info: 'bg-blue-600/90',
};

const Notification = ({ message, type = 'info', onClear }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClear();
    }, 4000); // Auto-dismiss after 4 seconds

    return () => clearTimeout(timer);
  }, [onClear]);

  return (
    <div className={`fixed bottom-5 right-5 z-[100] flex items-center gap-4 p-4 rounded-xl shadow-2xl text-white ${notificationStyles[type]} backdrop-blur-md animate-fade-in-up`}>
      {notificationIcons[type]}
      <p className="font-semibold">{message}</p>
    </div>
  );
};

export default Notification;