import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initializeDeliveryStore } from "./store/deliveryStore.ts";

// Rehydrate validated delivery location from localStorage
initializeDeliveryStore();

// Disable all console logs in production (excluding error)
if (!import.meta.env.DEV) {
  console.log = () => {};
  console.debug = () => {};
  console.info = () => {};
  console.warn = () => {};
}

createRoot(document.getElementById("root")!).render(<App />);
