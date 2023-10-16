import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import Messenger from "./pages/Messenger";

// interface MyButtonProps {
//   /** The text to display inside the button */
//   title: string;
//   /** Whether the button can be interacted with */
//   disabled: boolean;
// }

function App() {
  const [message, setMessage] = useState();
  useEffect(() => {
    fetch("/api/")
      .then((res) => res.json())
      .then((res) => setMessage(res.message))
      .catch(console.error);
  }, [setMessage]);
  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{message || "Loading..."}</p>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}

      <Messenger />
    </div>
  );
}

export default App;
