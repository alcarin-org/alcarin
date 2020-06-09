import 'public/static/modules/playerDashboard/PlayerDashboard.css';

import * as React from 'react';

import { PrivateRoute } from '../../shared/router';
import {
  TripleLayout,
  MainSection,
  MainSectionHeader,
  InfoSection,
  ActionSection,
} from '../../components/TripleLayout';
import { ActionMenu, ActionMenuProps } from '../../components/ActionMenu';

import { CreateNewCharacter } from './CreateNewCharacter';

const Menu: ActionMenuProps['items'] = {
  ['General']: [
    { name: 'Home', path: '/dashboard' },
    { name: 'Create new character', path: '/dashboard/create-char' },
  ],
};

export function PlayerDashboard() {
  return (
    <TripleLayout className="player-dashboard">
      <ActionSection>
        <ActionMenu items={Menu} />
      </ActionSection>
      <MainSection>
        <PrivateRoute path="/dashboard" exact>
          Chars list here
        </PrivateRoute>
        <PrivateRoute path="/dashboard/create-char">
          <CreateNewCharacter />
        </PrivateRoute>
      </MainSection>
      <InfoSection>Additional Info</InfoSection>
    </TripleLayout>
  );
}
