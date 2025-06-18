import React, { useState, useEffect } from 'react';
import SignInDialog from './SignInDialog';
import SignUpDialog from './SignUpDialog';

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'signin' | 'signup';
}

const AuthDialog: React.FC<AuthDialogProps> = ({ isOpen, onClose, defaultMode = 'signin' }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(defaultMode);

  // Reset mode when dialog opens or defaultMode changes
  useEffect(() => {
    if (isOpen) {
      setMode(defaultMode);
    }
  }, [isOpen, defaultMode]);

  const handleSwitchToSignUp = () => {
    setMode('signup');
  };

  const handleSwitchToSignIn = () => {
    setMode('signin');
  };

  if (!isOpen) return null;

  return (
    <>
      {mode === 'signin' && (
        <SignInDialog
          isOpen={isOpen}
          onClose={onClose}
          onSwitchToSignUp={handleSwitchToSignUp}
        />
      )}
      {mode === 'signup' && (
        <SignUpDialog
          isOpen={isOpen}
          onClose={onClose}
          onSwitchToSignIn={handleSwitchToSignIn}
        />
      )}
    </>
  );
};

export default AuthDialog; 