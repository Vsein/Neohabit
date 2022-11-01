import React from 'react';
import { NavLink } from 'react-router-dom';
import Icon from '@mdi/react';
import Storage from '../modules/Storage';

export default function SidebarMobile() {
  return (
    <aside className="sidebar-mobile">
      <ul className="filters-mobile">
        {Storage.getToDoList()
          .getFilters()
          .map((filter, i) => (
            <FilterMobile
              filter={filter}
              key={`filter-${i}`}
            />
          ))}
      </ul>
      <ul className="projects-mobile">
      </ul>
    </aside>
  );
}

function FilterMobile(props) {
  const { filter } = props;

  const linkify = (str) => str.replace(/\s+/g, '-').toLowerCase();

  return (
    <li>
      <NavLink
        className={({ isActive }) => (isActive ? 'filter-mobile active' : 'filter-mobile')}
        to={`/${linkify(filter.name)}`}
        tabIndex="0"
      >
        <Icon path={filter.image} />
      </NavLink>
    </li>
  );
}
