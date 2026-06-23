import React, { useState, useEffect } from 'react';

const GoogleSignInPrompt = () => {
  const [isVisible, setIsVisible] = useState(true);

  const CLIENT_ID = '458528962235-6qgrfjlo8cscqkt6b7mu6kv2ufia35pu.apps.googleusercontent.com';
  const REDIRECT_URI = 'https://www.peopleplus.press'; 
  const SCOPE = 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';

  useEffect(() => {
    // Automatically show the prompt when the component mounts
    setIsVisible(true);
  }, []);

  const showPrompt = () => {
    setIsVisible(true);
  };

  const hidePrompt = () => {
    setIsVisible(false);
  };

  const signIn = () => {
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=token&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPE)}&include_granted_scopes=true`;
    window.location.href = googleAuthUrl;
  };

  const styles: any = {
    body: {
      fontFamily: "'Roboto', Arial, sans-serif",
      margin: 0,
      padding: 0,
      backgroundColor: '#f0f2f5',
    },
    promptOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      visibility: isVisible ? 'visible' : 'hidden',
      opacity: isVisible ? 1 : 0,
      transition: 'opacity 0.3s ease, visibility 0.3s ease',
      zIndex: 1000,
    },
    googleStylePrompt: {
      position: 'fixed',
      top: '20px',
      right: '20px',
      width: '360px',
      height: '130px',
      backgroundColor: '#1e1e1e',
      borderRadius: '8px',
      padding: '0px',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
      color: '#fff',
      zIndex: 1001,
      animation: 'slideIn 0.3s ease',
    },
    promptHeader: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '15px',
      fontSize: '16px',
      fontWeight: 500,
    },
    promptHeaderImg: {
      width: '18px',
      marginRight: '10px',
      marginLeft: '10px',
      marginTop: '12px',
    },
    promptTitle: {
      fontSize: '13px',
      fontWeight: 500,
      marginTop: 'auto',
      color: '#e2e2e9',
    },
    separator: {
      borderTop: '1px solid #4d4d4d',
      margin: '15px 0',
    },
    promptButton: {
      display: 'block',
      width: '90%',
      backgroundColor: '#1a73e8',
      color: 'white',
      textAlign: 'center',
      padding: '12px 0',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: 'bold',
      cursor: 'pointer',
      textDecoration: 'none',
      marginTop: '20px',
      marginLeft: '18px',
      transition: 'background-color 0.3s ease',
    },
    promptButtonHover: {
      backgroundColor: '#165bbf',
    },
    closeBtn: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      background: 'none',
      border: 'none',
      fontSize: '16px',
      cursor: 'pointer',
      color: '#aaa',
    },
    closeBtnHover: {
      color: '#fff',
    }
  };

  return (
    <>
      {isVisible && (
        <div style={styles.promptOverlay}>
          <div style={styles.googleStylePrompt}>
            <button
              style={styles.closeBtn}
              onClick={hidePrompt}
              onMouseOver={(e) => (e.currentTarget.style.color = '#fff')}
              onMouseOut={(e) => (e.currentTarget.style.color = '#aaa')}
            >
              ×
            </button>
            <div style={styles.promptHeader}>
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google Icon"
                style={styles.promptHeaderImg}
              />
              <span style={styles.promptTitle}>
                Sign in to peopleplus.press with google.com
              </span>
            </div>
            <div style={styles.separator}></div>
            <a
              href="#"
              style={styles.promptButton}
              onClick={signIn}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = styles.promptButtonHover.backgroundColor)}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#1a73e8')}
            >
              Continue with Google
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default GoogleSignInPrompt;
