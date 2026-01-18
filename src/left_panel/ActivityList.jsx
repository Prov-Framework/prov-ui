import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';

function ActivityList() {
  const [activitys, setActivitys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Define an async function inside the effect
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8081/provframework/list/activities');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        setActivitys(jsonData);
        setError(null);
      } catch (err) {
        setError(err.message);
        setActivitys([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // The empty dependency array ensures this effect runs only once after the initial render.
  }, []);

  if (isLoading) {
    return <div>Loading activitys...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

return (
    <div>
        {activitys.map((activity, idx) => (
            <Button key={activity ?? idx} variant="outline-secondary">
                {activity}
            </Button>
        ))}
    </div>
);
}

export default ActivityList;
