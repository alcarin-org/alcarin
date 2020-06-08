import * as React from 'react';

interface ActionItem {
  name: string;
  href: string;
}

export interface ActionMenuProps {
  items: Record<string, ActionItem[]>;
}

export function ActionMenu({ items }: ActionMenuProps) {
  return (
    <aside className="menu">
      {Object.keys(items).map((category) => (
        <>
          <p className="menu-label">{category}</p>
          <ul className="menu-list">
            {items[category].map((item) => (
              <li key={item.name + ':' + item.href}>
                <a>{item.name}</a>
              </li>
            ))}
          </ul>
        </>
      ))}
    </aside>
  );
}
