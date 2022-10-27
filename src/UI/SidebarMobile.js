import React from 'react';
import { NavLink } from 'react-router-dom';
import Icon from '@mdi/react';
import Storage from '../modules/Storage';

export default function SidebarMobile() {
  return (
    <div className="sidebar-mobile">
      <div className="filters-mobile">
        {Storage.getToDoList()
          .getFilters()
          .map((filter, i) => (
            <FilterMobile
              filter={filter}
              key={`filter-${i}`}
            />
          ))}
      </div>
      <div className="projects-mobile">
      </div>
    </div>
  );
}

function FilterMobile(props) {
  const { filter } = props;

  const linkify = (str) => str.replace(/\s+/g, '-').toLowerCase();

  return (
    <NavLink
      className={({ isActive }) => (isActive ? 'filter-mobile active' : 'filter-mobile')}
      to={`/${linkify(filter.name)}`}
    >
      <Icon path={filter.image} />
    </NavLink>
  );
}
