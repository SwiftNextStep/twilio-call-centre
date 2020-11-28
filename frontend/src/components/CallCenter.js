import React from 'react';
import CallProgress from './CallProgress';
import NavBar from './NavBar';

function CallCenter({ calls }) {
  return (
    <div>
      <NavBar />
      {calls.calls.map((call) => (
        <CallProgress call={call} />
      ))}
    </div>
  );
}

export default CallCenter;
