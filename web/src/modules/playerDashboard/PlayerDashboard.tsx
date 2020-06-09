import 'public/static/modules/playerDashboard/PlayerDashboard.css';

import * as React from 'react';

import {
  TripleLayout,
  MainSection,
  MainSectionHeader,
  InfoSection,
  ActionSection,
} from '../../components/TripleLayout';
import { ActionMenu, ActionMenuProps } from '../../components/ActionMenu';

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
      <MainSectionHeader>Simple header</MainSectionHeader>
      <MainSection></MainSection>
      <InfoSection>Additional Info</InfoSection>
    </TripleLayout>
  );
}
