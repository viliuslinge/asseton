require("esbuild")
  .build({
    entryPoints: ["src/index.ts"],
    outfile: "dist/index.js",
    bundle: true,
    minify: true,
    platform: "node",
    loader: { ".ts": "ts" },
  })
  .then(() => console.log("BUNDLING DONE"))
  .catch(() => process.exit(1));
