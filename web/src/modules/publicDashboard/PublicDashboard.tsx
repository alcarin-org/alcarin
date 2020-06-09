import 'public/static/modules/publicDashboard/PublicDashboard.css';

import * as React from 'react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

import {
  TripleLayout,
  MainSection,
  MainSectionHeader,
  InfoSection,
  ActionSection,
} from '../../components/TripleLayout';
import { useAppDispatch } from '../../store';
import { registerUser } from '../../api/auth';
import { ConfirmModal } from '../../components/ConfirmModal';

import { logIn } from './sessionSlice';
import { LoginForm } from './LoginForm';
import { SignUpForm } from './SignUpForm';

export function PublicDashboard() {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  return (
    <TripleLayout className="public-dashboard">
      <ActionSection>Do some actions!</ActionSection>
      <MainSectionHeader>Simple header</MainSectionHeader>
      <MainSection>
        <div className="card public-dashboard__card">
          <div className="card-header">
            <span className="card-header-title">Zaloguj się</span>
          </div>
          <div className="card-content">
            <LoginForm
              onSubmit={async (formData) => {
                await dispatch(logIn(formData));
                history.push('/dashboard');
              }}
            />
          </div>
        </div>

        <div className="card public-dashboard__card">
          <div className="card-header">
            <span className="card-header-title">Załóż nowe konto</span>
          </div>
          <div className="card-content">
            <SignUpForm
              onSubmit={async (formData) => {
                await registerUser(formData);
                setIsSignUpModalOpen(true);
              }}
            />
          </div>
        </div>

        <ConfirmModal
          isOpen={isSignUpModalOpen}
          onRequestClose={() => {
            setIsSignUpModalOpen(false);
          }}
        >
          Konto stworzone, zaloguj się by kontynuować.
        </ConfirmModal>
      </MainSection>
      <InfoSection>Additional Info</InfoSection>
    </TripleLayout>
  );
}
