import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { googleAuth } from '../api'; // Adjust the path to your API utility
import { Button } from './ui/button';

const GoogleLogin = () => {
  const navigate = useNavigate();

  const responseGoogle = async (authResult) => {
    try {
      if (authResult['code']) {
        const result = await googleAuth(authResult['code']);
        const { email, name, image } = result.data.user;
        const token = result.data.token;

        // Save token and user info
        const obj = { email, name, image, token };
        localStorage.setItem('user-info', JSON.stringify(obj));
        localStorage.setItem('token', token);

        console.log('Token saved in localStorage:', localStorage.getItem('token'));
        console.log('User info saved in localStorage:', localStorage.getItem('user-info'));

        // Navigate to dashboard after saving the token
        navigate('/');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: (error) => console.log('Login Failed:', error),
    flow: 'auth-code',
  });

  return (
    <Button
      onClick={() => googleLogin()}
      className="bg-blue-500 text-white hover:bg-blue-600"
    >
      Log In with Google
    </Button>
  );
};

export default GoogleLogin;