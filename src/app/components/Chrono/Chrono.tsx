import React, { useState, useEffect } from 'react';

export default function Chrono() {
  const [seconds, setSeconds] = useState(15);

  

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
    }, 1000);

    // Nettoyer l'intervalle lors de la suppression du composant
    return () => clearInterval(interval);
  }, [seconds]);

  return (
    <p className='text-5xl'>{seconds}</p>
  );
};