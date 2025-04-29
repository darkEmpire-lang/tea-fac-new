import React, { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

export function useNotifications() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notif) => {
    setNotifications((prev) => {
      // Avoid duplicate notifications for the same category and type
      if (prev.find(n => n.category === notif.category && n.type === notif.type)) return prev;
      return [...prev, notif];
    });
  };

  const removeNotification = (notif) => {
    setNotifications((prev) =>
      prev.filter(
        (n) =>
          n.category !== notif.category ||
          n.type !== notif.type
      )
    );
  };

  const clearNotifications = () => setNotifications([]);

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, removeNotification, clearNotifications }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
