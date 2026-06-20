import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import fs from "fs";
import path from "path";

export default defineConfig({
  plugins: [
    vue(),
    {
      name: "web-404",
      configureServer(server) {
        // This plugin is required because Vite is in SPA mode by default,
        // which is nice for the "desktop", but we serve the internal
        // "internet" pages as actual static html pages. We need to actually
        // check if they don't exist so the desktop is not loaded as a fallback.
        server.middlewares.use("/web", (req, res, next) => {
          const urlPath = req.url.split("?")[0];
          const filePath = path.join(
            import.meta.dirname,
            "public/web",
            urlPath,
          );

          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            next();
            return;
          }

          if (fs.existsSync(filePath + ".html")) {
            req.url = urlPath + ".html";
            next();
            return;
          }

          const indexPath = path.join(filePath, "index.html");
          if (fs.existsSync(indexPath)) {
            req.url = (urlPath.endsWith("/") ? urlPath : urlPath + "/") + "index.html";
            next();
            return;
          }

          const notFoundPage = fs.readFileSync(
            path.join(import.meta.dirname, "public/404.html"),
            "utf-8",
          );
          res.statusCode = 404;
          res.setHeader("Content-Type", "text/html");
          res.end(notFoundPage);
        });
      },
    },
  ],
});
