import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';

function EntityList() {
  const [entitys, setEntitys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Define an async function inside the effect
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8081/provframework/list/entities');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        setEntitys(jsonData);
        setError(null);
      } catch (err) {
        setError(err.message);
        setEntitys([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // The empty dependency array ensures this effect runs only once after the initial render.
  }, []);

  if (isLoading) {
    return <div>Loading entitys...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

return (
    <div>
        {entitys.map((entity, idx) => (
            <Button key={entity ?? idx} variant="outline-secondary">
                {entity}
            </Button>
        ))}
    </div>
);
}

export default EntityList;
