import * as React from 'react';

import {
  TripleLayout,
  MainSection,
  MainSectionHeader,
  InfoSection,
  ActionSection,
} from './TripleLayout';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <TripleLayout>
        <ActionSection>Do some actions!</ActionSection>
        <MainSectionHeader>Simple header</MainSectionHeader>
        <MainSection>
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <p>
            a long line of texta long line of texta long line of texta long line
            of texta long line of texta long line of text
            a long line of texta long line of texta long line of texta long line
            of texta long line of texta long line of text
          </p>
        </MainSection>
        <InfoSection>Additional Info</InfoSection>
      </TripleLayout>
    </div>
  );
}

export default App;
