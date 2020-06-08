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
  ['General']: [{ name: 'Test', href: '' }],
};

export function PlayerDashboard() {
  return (
    <TripleLayout className="public-dashboard">
      <ActionSection>
        <ActionMenu items={Menu} />
      </ActionSection>
      <MainSectionHeader>Simple header</MainSectionHeader>
      <MainSection></MainSection>
      <InfoSection>Additional Info</InfoSection>
    </TripleLayout>
  );
}
