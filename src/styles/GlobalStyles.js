// src/styles/GlobalStyles.js
import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

  :root {
    --primary: #2563eb;
    --primary-dark: #1d4ed8;
    --primary-light: #3b82f6;
    --secondary: #0f172a;
    --accent: #06b6d4;
    --success: #10b981;
    --success-light: #d1fae5;
    --warning: #f59e0b;
    --warning-light: #fef3c7;
    --danger: #ef4444;
    --danger-light: #fee2e2;
    --info: #6366f1;
    --info-light: #e0e7ff;
    --background: #f8fafc;
    --background-alt: #f1f5f9;
    --surface: #ffffff;
    --border: #e2e8f0;
    --border-light: #f1f5f9;
    --text-primary: #0f172a;
    --text-secondary: #64748b;
    --text-muted: #94a3b8;
    --text-inverse: #ffffff;
    --shadow: 0 1px 3px rgba(15, 23, 42, 0.08);
    --shadow-md: 0 4px 6px -1px rgba(15, 23, 42, 0.1), 0 2px 4px -2px rgba(15, 23, 42, 0.1);
    --shadow-lg: 0 10px 15px -3px rgba(15, 23, 42, 0.1), 0 4px 6px -4px rgba(15, 23, 42, 0.1);
    --shadow-xl: 0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.1);
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background-color: var(--background);
    color: var(--text-primary);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 700;
    margin-bottom: 0.75rem;
    line-height: 1.3;
    color: var(--text-primary);
  }

  h1 { font-size: 2.5rem; font-weight: 800; }
  h2 { font-size: 2rem; font-weight: 700; }
  h3 { font-size: 1.5rem; font-weight: 600; }
  h4 { font-size: 1.25rem; font-weight: 600; }
  h5 { font-size: 1rem; font-weight: 600; }
  h6 { font-size: 0.875rem; font-weight: 600; }

  p {
    margin-bottom: 1rem;
    color: var(--text-secondary);
  }

  button {
    cursor: pointer;
    font-family: inherit;
    border: none;
    outline: none;
    transition: all 0.2s ease;
  }

  a {
    text-decoration: none;
    color: var(--primary);
    transition: color 0.2s ease;
  }

  a:hover {
    color: var(--primary-dark);
  }

  input, textarea, select {
    font-family: inherit;
    font-size: 1rem;
  }

  ::selection {
    background-color: var(--primary);
    color: var(--text-inverse);
  }

  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: var(--background-alt);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--text-muted);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--text-secondary);
  }

  /* Animations */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out;
  }

  .animate-slideUp {
    animation: slideUp 0.4s ease-out;
  }
`;

export default GlobalStyles;