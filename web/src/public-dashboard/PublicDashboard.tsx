import * as React from 'react';

import {
  TripleLayout,
  MainSection,
  MainSectionHeader,
  InfoSection,
  ActionSection,
} from '../components/TripleLayout';

import 'public/public-dashboard/PublicDashboard.css';

import { LoginForm } from './LoginForm';
import { SignUpForm } from './SignUpForm';

export function PublicDashboard() {
  return (
    <div className="public-dashboard">
      <TripleLayout>
        <ActionSection>Do some actions!</ActionSection>
        <MainSectionHeader>Simple header</MainSectionHeader>
        <MainSection>
          <div className="card public-dashboard__card">
            <div className="card-header">
              <span className="card-header-title">Zaloguj się</span>
            </div>
            <div className="card-content">
              <LoginForm />
            </div>
          </div>

          <div className="card public-dashboard__card">
            <div className="card-header">
              <span className="card-header-title">Załóż nowe konto</span>
            </div>
            <div className="card-content">
              <SignUpForm />
            </div>
          </div>
        </MainSection>
        <InfoSection>Additional Info</InfoSection>
      </TripleLayout>
    </div>
  );
}
