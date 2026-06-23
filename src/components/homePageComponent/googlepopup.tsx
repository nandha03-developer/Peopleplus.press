import React, { useEffect, useState, } from 'react';
import GoogleSignIn from '../googleSignIn';

const App: React.FC = () => {
  const [showPopup, setShowPopup] = useState<boolean>(false);

  useEffect(() => {
    // Initialize Google One Tap
    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID, // Use your Google Client ID
      // callback: handleGoogleSignIn,
    });

    window.google.accounts.id.prompt(); // Automatically show the One Tap prompt

    // To enable the sign-in button
    // window.google.accounts.id.renderButton(
    //   document.getElementById('google-signin-button'),
    //   {
    //     theme: 'outline',
    //     size: 'large',
    //   }
    // );
  }, []);

  const overlayStyle = {
    position: 'fixed' as 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'flex-start' as 'flex-start', // Align to the top
    justifyContent: 'flex-end' as 'flex-end', // Align to the right
  };

  const popupStyle = {
    background: '#1d1d1f',
    borderRadius: '15px',
    width: '380px',
    padding: '16px',
    color: '#fff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    position: 'relative' as 'relative',
    margin: '20px', // Margin to prevent overlapping with the edge
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between' as 'space-between',
    marginBottom: '16px',
  };

  const bodyStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '16px',
  };

  const profilePictureStyle = {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    marginRight: '12px',
  };

  const continueButtonStyle = {
    width: '100%',
    padding: '12px',
    background: '#1a73e8', // Blue button color
    color: '#ffffff',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    fontWeight: 'bold' as 'bold',
    textAlign: 'center' as 'center',
    marginBottom: '16px',
  };

  const footerStyle = {
    fontSize: '12px',
    color: '#aaa',
    textAlign: 'center' as 'center',
    marginTop: '16px',
  };

  const closeButtonStyle = {
    position: 'absolute' as 'absolute',
    top: '15px',
    right: '10px',
    background: 'none',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '16px',
  };

 

  return (
    <div>
      <button onClick={() => setShowPopup(true)} style={{ padding: '10px', margin: '20px', borderRadius: '5px' }}>
        Show Popup
      </button>

      {showPopup && (
        <div style={overlayStyle}>
          <div style={popupStyle}>
            <button style={closeButtonStyle} onClick={() => setShowPopup(false)}>✕</button>
            <div style={headerStyle}>
            <div style={{ 
  display: 'flex', 
  alignItems: 'center', 
  borderBottom: '1px solid #ccc', // Adds the horizontal line
  paddingBottom: '8px', // Adds some space between the content and the line
  width: '100%'
}}>
  <span style={{ fontSize: '11px' }}>Sign in to peopleplus.press with google.com</span>
</div>

            </div>
            <div style={bodyStyle}>
              <div>
                <GoogleSignIn />
              </div>
            </div>
            <button style={continueButtonStyle} onClick={() => setShowPopup(false)}>
              Continue as nandha
            </button>
            <div style={footerStyle}>
              To continue, google.com will share your name, email address, and profile picture with this site.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
