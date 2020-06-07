import * as React from 'react';
import { useSelector } from 'react-redux';

import {
  TripleLayout,
  MainSection,
  MainSectionHeader,
  InfoSection,
  ActionSection,
} from '../components/TripleLayout';
import { RootState, useAppDispatch } from '../store';

import { signUp } from './publicDashboardSlice';
import { LoginForm } from './LoginForm';
import { SignUpForm } from './SignUpForm';

import 'public/public-dashboard/PublicDashboard.css';

export function PublicDashboard() {
  const value = useSelector<RootState>((store) => store.publicDashboard.test);
  const dispatch = useAppDispatch();

  return (
    <div className="public-dashboard">
      <TripleLayout>
        <ActionSection>
          Do some actions! - {value}
          <button
            onClick={() =>
              dispatch(
                signUp({ email: 'test@test.test', password: 'apdsasadssdass' })
              )
            }
          >
            Click
          </button>
        </ActionSection>
        <MainSectionHeader>Simple header</MainSectionHeader>
        <MainSection>
          <div className="card public-dashboard__card">
            <div className="card-header">
              <span className="card-header-title">Zaloguj się</span>
            </div>
            <div className="card-content">
              <LoginForm
                onSubmit={(data) => {
                  return new Promise((resolve) => setTimeout(resolve, 1000));
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
                onSubmit={(data) => {
                  return new Promise((resolve) => setTimeout(resolve, 1000));
                }}
              />
            </div>
          </div>
        </MainSection>
        <InfoSection>Additional Info</InfoSection>
      </TripleLayout>
    </div>
  );
}
