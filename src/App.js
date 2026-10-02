import React from 'react';

function App() {
  const playlist = [
    { id: 1, title: 'Amazing', artist: 'Rex Orange County' },
    { id: 2, title: 'THE SHADE', artist: 'Rex Orange County' },
    { id: 3, title: 'Sunflower', artist: 'Rex Orange County' }
  ];

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Mi Reproductor - Music Box</h1>
      <p>Pipeline CI/CD en ejecución</p>
      <ul>
        {playlist.map(song => (
          <li key={song.id}>
            <strong>{song.title}</strong> - {song.artist}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;