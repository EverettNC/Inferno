import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";

// Resolve __dirname in ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(async () => {
  const plugins: any[] = [react(), runtimeErrorOverlay()];

  // Conditionally load Replit-only plugin when available (development on Replit)
  if (process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined) {
    try {
      const m = await import("@replit/vite-plugin-cartographer");
      if (m && typeof m.cartographer === "function") {
        plugins.push(m.cartographer());
      }
    } catch (err) {
      // Non-fatal: missing dev-only plugin
      // eslint-disable-next-line no-console
      console.warn("Optional Replit plugin not available:", (err as any)?.message || err);
    }
  }

  return {
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "client", "src"),
        "@shared": path.resolve(__dirname, "shared"),
        "@assets": path.resolve(__dirname, "attached_assets"),
      },
    },
    root: path.resolve(__dirname, "client"),
    // Explicit dev server port so local tooling (curl) targets the right port
    server: {
      port: Number(process.env.PORT) || 5173,
      host: "0.0.0.0",
      strictPort: false,
    },
    build: {
      outDir: path.resolve(__dirname, "dist/public"),
      emptyOutDir: true,
    },
  };
});
export default defineConfig({
  server: {
    allowedHosts: ['christmanaipinferno.ngrok.app'],
    // If you want to allow all subdomains (optional)
    // allowedHosts: ['.ngrok.app']
  },
});

