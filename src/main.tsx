import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initializeDeliveryStore } from "./store/deliveryStore.ts";

// Rehydrate validated delivery location from localStorage
initializeDeliveryStore();

createRoot(document.getElementById("root")!).render(<App />);
