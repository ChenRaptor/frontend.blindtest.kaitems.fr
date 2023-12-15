"use client"
import React, { useEffect, useRef } from 'react';

const AudioPlayer = ({ path }: { path: string }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Met à jour le chemin source de l'audio lorsque la prop path change
    if (audioRef.current) {
      audioRef.current.src = path;
      audioRef.current.load(); // Charge à nouveau l'audio
      audioRef.current.play(); // Joue l'audio
    }
  }, [path]);

  return (
    <div className='invisible fixed'>
      <h2>Audio Player</h2>
      <div className="audio-player-container">
        <audio ref={audioRef} controls autoPlay>
          <source src={path} type="audio/mp3" />
          Votre navigateur ne prend pas en charge l&apos;élément audio.
        </audio>
      </div>
    </div>
  );
};

export default AudioPlayer;
