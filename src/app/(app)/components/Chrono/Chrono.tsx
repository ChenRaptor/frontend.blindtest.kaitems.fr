import React, { useState, useEffect } from 'react';
import { useCountdown } from 'usehooks-ts';

interface ChronoProps {
  count: number
}

export default function Chrono({count}: ChronoProps) {
  return (
    <p className='text-5xl'>{count}</p>
  );
};