// utils/eventBus.js
const listeners = {};

export const on = (event, callback) => {
  if (!listeners[event]) {
    listeners[event] = [];
  }
  listeners[event].push(callback);
};

export const emit = (event, data) => {
  if (listeners[event]) {
    listeners[event].forEach((callback) => callback(data));
  }
};
