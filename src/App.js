import React, { useState } from "react";
import './App.css';
import ClientComponent from "./components/ClientComponent";


function App() {
  const [loadClient, setLoadClient] = useState(true);

  return (
    <>
      {/* Load or unload the client */}
      <button onClick={() => setLoadClient(prevState => !prevState)}>
        {loadClient ? 'STOP CLIENT' : 'Start Client'}
      </button>
      {/* Socekt IO client */}
      {loadClient ? <ClientComponent loadClient={loadClient}/> : null}
    </>
  );
}

export default App;