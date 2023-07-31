import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import replace from "@rollup/plugin-replace";

export default {
  input: "src/index.js",
  output: {
    file: "dist/bundle.js",
    format: "iife",
  },
  plugins: [
    nodeResolve({
      extensions: [".js", "jsx"],
    }),
    commonjs({ include: /node_modules/ }),
    babel({
      babelHelpers: "bundled",
      presets: ["@babel/preset-react"],
    }),
    replace({
      preventAssignment: false,
      "process.env.NODE_ENV": JSON.stringify("development"),
    }),
    serve({
      open: true,
      contentBase: ["dist", "public"],
      host: "localhost",
      port: 3000,
    }),
    livereload({ watch: "dist" }),
  ],
};
