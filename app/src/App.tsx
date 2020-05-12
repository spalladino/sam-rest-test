import React, { useRef, useState, useEffect } from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react'
import { createRelayer, Relayer, getRelayers } from './api/relayer';
import './App.css';

function App() {
  const [relayers, setRelayers] = useState<Relayer[]>([])
  const updateRelayers = () => { getRelayers().then(rs => setRelayers(rs)) };
  useEffect(updateRelayers, []);

  const form = useRef<HTMLFormElement>(null);
  const handleSubmit = async () => {
    if (form.current) {
      const { relayerName } = form.current;
      await createRelayer(relayerName.value);
      form.current.reset();
      updateRelayers();
    }
  }

  return (
    <div className="App">
      <div>
        <h1>Create a relayer</h1>
        <form ref={form}>
          <label>Name: </label>
          <input name="relayerName" />
        </form>
        <button type="button" onClick={handleSubmit}>Create</button>
      </div>
      <hr />
      <div>
        <h1>Relayers</h1>
        { relayers.map((relayer) => (
          <div key={relayer.relayerId}>{relayer.name} {relayer.relayerId}</div>
        ))}
      </div>
    </div>
  );
}

export default withAuthenticator(App);
