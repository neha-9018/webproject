import React from 'react'
import { FaStar } from 'react-icons/fa';


const WatchList = () => {
  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: -1,
      background: `url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1500&q=80') center/cover no-repeat fixed`,
    }}>
      <div style={{
        padding: '2.5rem 1rem',
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(26,26,46,0.82)',
        borderRadius: '18px',
        boxShadow: '0 4px 24px rgba(255,180,0,0.10)',
        margin: '2rem auto',
        maxWidth: '500px',
        position: 'relative',
        top: 0
      }}>
        <FaStar size={64} color="#ffb400" style={{marginBottom: '1rem', filter: 'drop-shadow(0 2px 8px #ffb40088)'}} />
        <h2 style={{color: '#ffb400', marginBottom: '0.5rem', letterSpacing: '0.08em'}}>Your Watch List</h2>
        <p style={{color: '#fff', fontSize: '1.1rem', textAlign: 'center', maxWidth: '400px'}}>
          Save your favorite movies here and never miss a must-watch!<br/>
          <span style={{color: '#ffb400'}}>Feature coming soon...</span>
        </p>
      </div>
    </div>
  )
}

export default WatchList

