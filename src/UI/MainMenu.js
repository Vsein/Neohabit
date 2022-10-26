import React, { useState } from 'react';
import Icon from '@mdi/react';
import {
  mdiHome,
  mdiFamilyTree,
  mdiTrendingUp,
  mdiCheckboxMultipleMarked,
  mdiPost,
  mdiCog,
  mdiMenu,
  mdiApps,
} from '@mdi/js';

function MenuSection(props) {
  const { path, href, title, status, raw, active } = props;
  return (
    <a className={`menu-section ${active ? 'active' : ''}`} href={href}>
      <Icon path={path} className="icon" />
      <p className="link">{title}</p>
      <div className={`ribbon ribbon-top-right ${raw ? 'ribbon-raw' : ''}`}>
        <span>{status}</span>
      </div>
    </a>
  );
}

export default function MainMenu() {
  const [menuOpened, setMenuOpened] = useState(false);

  const toggleMenu = () => {
    setMenuOpened(!menuOpened);
  };

  // useEffect(() => {
  //   document.querySelector('.sidebar-toggle-container').addEventListener('click', () => {
  //     document.querySelector('.sidebar').classNameList.toggle('sidebar-hidden')
  //   });
  // });

  return (
    <div className="menu">
      <div className="logo-section sidebar-toggle-container">
        <Icon path={mdiMenu} className="icon sidebar-toggle" />
      </div>
      <h2 className="logo neohabit"></h2>
      <div className="logo-section menu-toggle" onClick={toggleMenu}>
        <Icon path={mdiApps} className="icon" />
      </div>
      <div className={`menu-container ${menuOpened ? 'active' : ''}`}>
        <MenuSection
          path={mdiHome}
          title="Dashboard"
          status="raw"
          href="https://vsein.github.io/profile-page/"
          raw="true"
        />
        <MenuSection
          path={mdiFamilyTree}
          title="Skill trees"
          status="Coming soon"
        />
        <MenuSection path={mdiTrendingUp} title="Habits" status="Coming soon" />
        <MenuSection
          path={mdiCheckboxMultipleMarked}
          title="To-do"
          active="true"
        />
        <MenuSection path={mdiPost} title="Blog" status="Coming soon" />
        <MenuSection path={mdiCog} title="Settings" status="Coming soon" />
      </div>
    </div>
  );
}
