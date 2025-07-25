// src/utils/polyfills.js
import { Buffer } from 'buffer';

// Polyfill global object
if (typeof global === 'undefined') {
  window.global = window;
}

// Polyfill Buffer
if (typeof window.Buffer === 'undefined') {
  window.Buffer = Buffer;
}

// Polyfill process
if (typeof window.process === 'undefined') {
  window.process = {
    env: {},
    version: '',
    nextTick: (callback) => setTimeout(callback, 0)
  };
}