import 'public/static/components/TripleLayout.css';

import * as React from 'react';

type LayoutSection = typeof MainSection;

interface TripleLayoutProps {
  children: React.ReactElement[];
  className?: string;
}

export function TripleLayout({ children, className }: TripleLayoutProps) {
  const mainSection = children.find((child) => child.type === MainSection);
  const actionSection = children.find((child) => child.type === ActionSection);
  const infoSection = children.find((child) => child.type === InfoSection);
  const mainSectionHeader = children.find(
    (child) => child.type === MainSectionHeader
  );

  return (
    <div className={`triple-layout ${className || ''}`}>
      {actionSection && (
        <section className="triple-layout__action">{actionSection}</section>
      )}
      <section className="triple-layout__main">
        <div className="triple-layout__main-content">
          {mainSectionHeader && (
            <header className="triple-layout__header">
              {mainSectionHeader}
            </header>
          )}
          <main>{mainSection}</main>
        </div>
      </section>
      {infoSection && (
        <section className="triple-layout__info">{infoSection}</section>
      )}
    </div>
  );
}

export function MainSection({ children }: React.PropsWithChildren<{}>) {
  return <>{children}</>;
}

export function ActionSection({ children }: React.PropsWithChildren<{}>) {
  return <>{children}</>;
}

export function InfoSection({ children }: React.PropsWithChildren<{}>) {
  return <>{children}</>;
}

export function MainSectionHeader({ children }: React.PropsWithChildren<{}>) {
  return <>{children}</>;
}
