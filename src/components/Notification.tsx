"use client";

import React from 'react';
import { useNotification } from '../context/NotificationContext';

const Notification: React.FC = () => {
  const { notification } = useNotification();
  if (!notification) return null;

  const bgColor = notification.type === 'success' ? 'bg-green-500' : 'bg-red-500';

  return (
    <div className={`fixed top-4 right-4 p-4 text-white rounded shadow ${bgColor}`} role="alert" aria-live="assertive">
      {notification.message}
    </div>
  );
};

export default Notification;