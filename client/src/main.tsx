import ReactDOM from "react-dom/client";
import RootRouter from "@/route";
import "./index.css";
import "normalize.css";
// import "@/assets/styles/default.less";
// import "@/assets/styles/global.less";
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(<RootRouter></RootRouter>);
console.log("vite mode:", import.meta.env.MODE);
console.log("vite is product:", import.meta.env.PROD);
console.log("vite is dev:", import.meta.env.DEV);