import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface ActionItem {
  name: string;
  path: string;
}

export interface ActionMenuProps {
  items: Record<string, ActionItem[]>;
}

export function ActionMenu({ items }: ActionMenuProps) {
  const location = useLocation();

  return (
    <aside className="menu action-menu">
      {Object.keys(items).map((category) => (
        <>
          <p className="menu-label">{category}</p>
          <ul className="menu-list">
            {items[category].map((item) => (
              <li key={item.name + ':' + item.path}>
                <Link
                  className={location.pathname === item.path ? 'is-active' : ''}
                  to={item.path}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </>
      ))}
    </aside>
  );
}
