import React from 'react';
import './AuthLayout.css';
import AuthLeft from './AuthLeft';
import AuthRight from './AuthRight';
import '../../pages/theme.css';


export default function AuthLayout({ theme }) {
  return (
    <div className="auth-layout">
      <div className="auth-left">
        <AuthLeft theme={theme}/>
      </div>
      <div className="auth-right">
        <AuthRight theme={theme} />
      </div>
    </div>
  );
}
