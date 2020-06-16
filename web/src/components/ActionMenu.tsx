import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface ActionItem {
  name: string;
  path: string;
}

export type ActionItems = Record<string, ActionItem[]>;

export interface ActionMenuProps {
  items: ActionItems;
}

export function ActionMenu({ items }: ActionMenuProps) {
  const location = useLocation();

  return (
    <aside className="menu action-menu">
      {Object.keys(items).map((category) => (
        <div key={category}>
          <p className="menu-label">{category}</p>
          <ul className="menu-list">
            {items[category].map((item) => (
              <ActionMenuItem
                key={item.name + ':' + item.path}
                item={item}
                currPath={location.pathname}
              />
            ))}
          </ul>
        </div>
      ))}
    </aside>
  );
}

function ActionMenuItem({
  item,
  currPath,
}: {
  item: ActionItem;
  currPath: string;
}) {
  return (
    <li>
      <Link
        className={currPath === item.path ? 'is-active' : ''}
        to={item.path}
      >
        {item.name}
      </Link>
    </li>
  );
}
