import React, { useCallback, useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";

function App() {
  const { loading, data } = useQuery(gql`
    {
      # Fetch from localStorage
      greeting {
        message
      }
      # Call SpaceX API
      launchNext {
        mission_id
        mission_name
        launch_date_utc
      }
    }
  `);
  const [updateMessage] = useMutation(gql`
    mutation updateMessage($message: String!) {
      setGreeting(message: $message) {
        message
      }
    }
  `);
  const [message, setMessage] = useState(data?.greeting.message);

  const handleInput = useCallback((e) => {
    setMessage(e.target.value);
  }, []);
  const handleMutate = useCallback(
    (e) => {
      e.preventDefault();
      updateMessage({ variables: { message } });
    },
    [message, updateMessage]
  );

  useEffect(() => {
    setMessage(data?.greeting.message);
  }, [data?.greeting.message]);

  return (
    <div className="App">
      <h2>Greeting (local schema):</h2>
      {loading ? (
        "Loading..."
      ) : (
        <form onSubmit={handleMutate}>
          <input defaultValue={message} onInput={handleInput} />
          <button type="submit">Update</button>
        </form>
      )}

      <h2>Next mission (remote schema):</h2>
      <pre>{JSON.stringify(data?.launchNext ?? null, null, 2)}</pre>
    </div>
  );
}

export default App;
