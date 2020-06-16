import * as React from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import {
  TripleLayout,
  MainSection,
  MainSectionHeader,
  InfoSection,
  ActionSection,
} from '../components/TripleLayout';
import { RootState, useAppDispatch } from '../store';
import { registerUser } from '../api/auth';
import { ConfirmModal } from '../components/ConfirmModal';

import { logIn } from './sessionSlice';
import { LoginForm } from './LoginForm';
import { SignUpForm } from './SignUpForm';

import 'public/public-dashboard/PublicDashboard.css';

export function PublicDashboard() {
  // const value = useSelector<RootState>((store) => store.publicDashboard.test);
  const dispatch = useAppDispatch();
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
          onRequestClose={() => setIsSignUpModalOpen(false)}
        >
          Konto stworzone, zaloguj się by kontynuować.
        </ConfirmModal>
      </MainSection>
      <InfoSection>Additional Info</InfoSection>
    </TripleLayout>
  );
}
