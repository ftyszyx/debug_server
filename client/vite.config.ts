import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path, { resolve } from "path";
import conditionalCompile from "./vite_ifdef";
import tailwindcss from "tailwindcss";
import autoprefier from "autoprefixer";
function pathResolve(dir) {
  const res = resolve(process.cwd(), ".", dir);
  // console.log("curpath:",process.cwd(),"res:",res)
  return res;
}

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:3000",
        changeOrigin: true,
        rewrite: (path) => {
          // console.log("get path", path);
          return path;
          // return path.replace(/^\/api/, "");
        },
      },
    },
  },
  base: "./",
  plugins: [react(), conditionalCompile()],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
    postcss: {
      plugins: [tailwindcss, autoprefier],
    },
  },
  resolve: {
    alias: [
      {
        find: /^@\//,
        replacement: `${pathResolve("src")}/`,
      },
    ],
  },
});
