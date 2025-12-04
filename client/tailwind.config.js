// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {
//       colors: {
//         // We'll define a custom dark theme palette later
//         background: "#0f172a", // Slate 900
//         surface: "#1e293b",    // Slate 800
//         primary: "#3b82f6",    // Blue 500
//       }
//     },
//   },
//   plugins: [],
// }

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // The HTML uses 'dark' class
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6",
        "background-light": "#f3f4f6", // gray-100
        "background-dark": "#111827", // gray-900
        "surface-light": "#ffffff",
        "surface-dark": "#1f2937", // gray-800
        "border-light": "#e5e7eb", // gray-200
        "border-dark": "#374151", // gray-700
        "text-primary-light": "#111827", // gray-900
        "text-primary-dark": "#f9fafb", // gray-50
        "text-secondary-light": "#4b5563", // gray-600
        "text-secondary-dark": "#9ca3af", // gray-400
        "text-tertiary-light": "#6b7280", // gray-500
        "text-tertiary-dark": "#6b7280", // gray-500
        
        // Method Colors
        "method-get": "#2563eb",
        "method-post": "#16a34a",
        "method-put": "#f59e0b",
        "method-delete": "#dc2626",
        "method-patch": "#8b5cf6", // Added Patch color
        
        // Status Colors
        "status-200": "#22c55e",
        "status-400": "#facc15",
        "status-500": "#ef4444",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
        mono: ['JetBrains Mono', 'monospace'], // Keep mono for code
      },
    },
  },
  plugins: [],
}