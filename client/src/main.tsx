import { createRoot } from "react-dom/client";
import { PORTFOLIO_ASSETS } from "@/assets/portfolioAssets";
import App from "./App";
import "./index.css";

document.querySelectorAll<HTMLLinkElement>("link[data-portfolio-favicon]").forEach((link) => {
  link.href = PORTFOLIO_ASSETS.favicon;
});

createRoot(document.getElementById("root")!).render(<App />);
