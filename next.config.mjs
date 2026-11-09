/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static HTML export: Vercel serves the generated files from the CDN.
  output: "export",

  // Canonical URLs must not alternate between /path and /path/.
  trailingSlash: false,

  // Emit no X-Powered-By header (irrelevant for static files, useful if the
  // project is ever switched back to a server runtime).
  poweredByHeader: false,

  // Enabled by default, but kept explicit: catches unsafe lifecycle code.
  reactStrictMode: true,

  // Vercel compresses static assets with Brotli/Gzip at the edge. This flag is
  // a no-op for `output: "export"`, but makes the intent explicit.
  compress: true,

  // Do not ship browser source maps to production visitors.
  productionBrowserSourceMaps: false,

  // Required for `output: "export"`: Next.js Image Optimization needs a server.
  // Use pre-optimized WebP/AVIF assets in /public and explicit width/height.
  images: {
    unoptimized: true,
  },

  // NOTE: With `output: "export"` Next.js does NOT support:
  //   - async redirects()
  //   - async headers()
  //   - async rewrites()
  //   - middleware.ts
  //   - Image Optimization API
  // Redirects and response headers for this deployment live in vercel.json,
  // which Vercel applies at the edge before serving the static files.
};

export default nextConfig;
