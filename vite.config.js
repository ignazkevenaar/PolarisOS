import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import fs from "fs";
import path from "path";
import process from "process";

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
          const query = req.url.includes("?")
            ? req.url.slice(req.url.indexOf("?"))
            : "";

          const filePath = path.join(
            import.meta.dirname,
            "public/web",
            urlPath,
          );

          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            next();
            return;
          }

          // File-type: <path>.html exists → canonical URL has no trailing slash
          const pathWithoutSlash = urlPath.endsWith("/")
            ? urlPath.slice(0, -1)
            : urlPath;
          const htmlFilePath = path.join(
            import.meta.dirname,
            "public/web",
            pathWithoutSlash + ".html",
          );

          if (fs.existsSync(htmlFilePath)) {
            if (urlPath.endsWith("/")) {
              res.statusCode = 301;
              res.setHeader("Location", "/web" + pathWithoutSlash + query);
              res.end();
              return;
            }
            req.url = pathWithoutSlash + ".html";
            next();
            return;
          }

          // Directory-type: <path>/index.html exists → canonical URL has trailing slash
          const indexPath = path.join(
            import.meta.dirname,
            "public/web",
            pathWithoutSlash,
            "index.html",
          );

          if (fs.existsSync(indexPath)) {
            if (!urlPath.endsWith("/")) {
              res.statusCode = 301;
              res.setHeader("Location", "/web" + urlPath + "/" + query);
              res.end();
              return;
            }
            req.url = urlPath + "index.html";
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
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
});
