// Astro ignores files/folders starting with "_" inside src/pages, so this
// is safe to co-locate here without becoming a route itself.
//
// import.meta.glob resolves its pattern relative to *this* file's location,
// so callers elsewhere (e.g. src/pages/[...path]/index.astro) still get the
// correct "./web/**" scan by importing this helper rather than calling
// import.meta.glob themselves.
const modules = import.meta.glob("./web/**/*.{astro,md,mdx,html}", {
  eager: false,
});

const subfolder = "./web/";

export function getOutsideRouteParts() {
  const flat = new Set();
  const indexed = new Set();

  for (const filePath of Object.keys(modules)) {
    const idx = filePath.indexOf(subfolder);
    if (idx === -1) continue;

    let routePart = filePath.slice(idx + subfolder.length);
    routePart = routePart.replace(/\.(astro|md|mdx|html)$/, "");

    if (routePart === "index" || routePart.endsWith("/index")) {
      indexed.add(routePart.replace(/(^|\/)index$/, ""));
    } else {
      flat.add(routePart);
    }
  }

  return { flat: [...flat], indexed: [...indexed] };
}
