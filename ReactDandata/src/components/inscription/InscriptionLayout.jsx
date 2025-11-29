import React from 'react';
import './InscriptionLayout.css';
import SignInLeft from './InscriptionLeft';
import SignInRight from './InscriptionRight';
import '../../pages/theme.css';


export default function SignInLayout({ theme }) {
  return (
    <div className="inscription-layout">
      <div className="inscription-left">
        <SignInLeft theme={theme}/>
      </div>
      <div className="inscription-right">
        <SignInRight theme={theme} />
      </div>
    </div>
  );
}
