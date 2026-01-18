import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';

function AgentList() {
  const [agents, setAgents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Define an async function inside the effect
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8081/provframework/list/agents');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        setAgents(jsonData);
        setError(null);
      } catch (err) {
        setError(err.message);
        setAgents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // The empty dependency array ensures this effect runs only once after the initial render.
  }, []);

  if (isLoading) {
    return <div>Loading agents...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

return (
    <div>
        {agents.map((agent, idx) => (
            <Button key={agent ?? idx} variant="outline-secondary">
                {agent}
            </Button>
        ))}
    </div>
);
}

export default AgentList;
