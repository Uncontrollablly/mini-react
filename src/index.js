import React from "react";
import ReactDOM from "react-dom";
import { Didact } from "./didact";

/** @jsx Didact.createElement */
function Counter() {
  console.log("Counter");
  const [state, setState] = Didact.useState(1);
  return <h1 onClick={() => setState((c) => c + 1)}>Count: {state}</h1>;
}

/** @jsx Didact.createElement */
function App() {
  console.log("App");
  return <Counter />;
}

const container = document.getElementById("root");
/** @jsx Didact.createElement */
Didact.render(<App />, container);
