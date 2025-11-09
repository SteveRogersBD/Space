import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';

export default function Profile() {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [token, setToken] = useState(null);
  const [userMetadata, setUserMetadata] = useState(null);

  useEffect(() => {
    const getToken = async () => {
      if (isAuthenticated) {
        try {
          const accessToken = await getAccessTokenSilently({
            authorizationParams: {
              audience: import.meta.env.VITE_AUTH0_AUDIENCE,
              scope: 'openid profile email offline_access',
            },
          });
          setToken(accessToken);
        } catch (error) {
          console.error('Error getting access token:', error);
        }
      }
    };

    getToken();
  }, [isAuthenticated, getAccessTokenSilently]);

  if (isLoading) {
    return <div className="profile-container">Loading...</div>;
  }

  if (!isAuthenticated || !user) {
    return <div className="profile-container">Please log in to view your profile.</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img
          src={user.picture || 'https://via.placeholder.com/100'}
          alt={user.name || 'User'}
          className="profile-avatar"
        />
        <div className="profile-info">
          <h2>{user.name || 'User'}</h2>
          <p>{user.email}</p>
        </div>
      </div>
      <div className="profile-details">
        <div className="profile-detail-item">
          <strong>Email:</strong>
          <span>{user.email}</span>
        </div>
        {user.email_verified !== undefined && (
          <div className="profile-detail-item">
            <strong>Email Verified:</strong>
            <span>{user.email_verified ? 'Yes' : 'No'}</span>
          </div>
        )}
        {user.nickname && (
          <div className="profile-detail-item">
            <strong>Nickname:</strong>
            <span>{user.nickname}</span>
          </div>
        )}
        {user.sub && (
          <div className="profile-detail-item">
            <strong>User ID:</strong>
            <span>{user.sub}</span>
          </div>
        )}
        {token && (
          <div className="profile-detail-item">
            <strong>Access Token:</strong>
            <span style={{ wordBreak: 'break-all', fontSize: '0.8rem' }}>
              {token.substring(0, 50)}...
            </span>
          </div>
        )}
        {userMetadata && (
          <div className="profile-detail-item">
            <strong>Metadata:</strong>
            <pre style={{ fontSize: '0.8rem', overflow: 'auto' }}>
              {JSON.stringify(userMetadata, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

