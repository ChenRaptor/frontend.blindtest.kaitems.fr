import React, { useState } from 'react';
import axios from 'axios';

const YouTubeAudioExtractor = () => {
  const [videoId, setVideoId] = useState('');
  const [audioUrl, setAudioUrl] = useState('');

  const getAudioUrl = async () => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=AIzaSyDrT1WTB-EHddkk0KtP-TpzPOEAYmqDuWg&part=snippet`
      );

      const videoInfo = response.data.items[0].snippet;
      console.log(videoInfo);
      const audioUrl = `https://www.youtube.com/watch?v=${videoId}`;

      setAudioUrl(audioUrl);
    } catch (error) {
      console.error('Error fetching video information', error);
    }
  };

  return (
    <div>
      <label>
        Enter YouTube Video ID:
        <input
          type="text"
          value={videoId}
          onChange={(e) => setVideoId(e.target.value)}
        />
      </label>
      <button onClick={getAudioUrl}>Get Audio URL</button>

      {audioUrl && (
        <div>
          <p>Audio URL: {audioUrl}</p>
        </div>
      )}
    </div>
  );
};

export default YouTubeAudioExtractor;
