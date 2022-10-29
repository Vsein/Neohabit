import React, { useEffect } from 'react';
import '../styles/main.scss';
import Icon from '@mdi/react';
import {
  mdiHome,
  mdiFamilyTree,
  mdiTrendingUp,
  mdiCheckboxMultipleMarked,
  mdiPost,
  mdiCog,
  mdiMagnify,
  mdiBell,
  mdiStarOutline,
  mdiEyeOutline,
  mdiShareVariantOutline,
} from '@mdi/js';
import pfp from '../assets/pfp.jpg';

export default function Signup() {
  useEffect(() => {
    document.title = 'Dashboard | Neohabit';
  });

  return (
    <div id="content-dashboard">
      <div className="dashboard-menu">
        <h2 className="logo neohabit" />
        <Icon path={mdiHome} alt="home" id="dashboard-img" className="icon" />
        <p className="link" id="dashboard">
          Dashboard
        </p>

        <Icon
          path={mdiFamilyTree}
          alt="tree"
          id="skills-img"
          className="icon"
        />
        <p className="link" id="skills">
          Skill trees
        </p>

        <Icon
          path={mdiTrendingUp}
          alt="trending-up"
          id="habits-img"
          className="icon"
        />
        <p className="link" id="habits">
          Current habits
        </p>

        <Icon
          path={mdiCheckboxMultipleMarked}
          alt="to-do"
          id="to-do-img"
          className="icon"
        />
        <p className="link" id="to-do">
          To-do
        </p>

        <Icon path={mdiPost} alt="post" id="blog-img" className="icon" />
        <p className="link" id="blog">
          Blog
        </p>

        <Icon path={mdiCog} alt="cog" id="settings-img" className="icon" />
        <p className="link" id="settings">
          Settings
        </p>
      </div>

      <div className="dashboard-header">
        <Icon path={mdiMagnify} alt="search" id="search-img" className="icon" />
        <input type="search" className="searchbar" />
        <div className="header-bot"> </div>
        <Icon path={mdiBell} alt="bell" id="notifications" className="icon" />
        <img
          src={pfp}
          alt="profile pic"
          id="pfp-small"
          className="pfp"
        />
        <p className="name">Serene Coder</p>
      </div>

      <div className="controls">
        <img
          src={pfp}
          alt="profile pic"
          id="pfp-big"
          className="pfp"
        />
        <div className="welcome">
          <p className="hello">Hello there,</p>
          <p className="username">Serene Coder (&#64;Vsein)</p>
        </div>
        <button className="dashboard-btn" id="new">New</button>
        <button className="dashboard-btn" id="upload">Upload</button>
        <button className="dashboard-btn" id="share-variant-outline">Share</button>
      </div>

      <div className="main">
        <div className="dashboard-projects">
          <h3>Your projects</h3>
          <div className="dashboard-projects-grid">
            <ProjectCard />
            <ProjectCard />
            <ProjectCard />
            <ProjectCard />
            <ProjectCard />
            <ProjectCard />
          </div>
        </div>

        <div className="news">
          <div className="announcements">
            <h3>Recent articles</h3>
            <div className="posts">
              <div className="post">
                <h4>Importance of sacrifice</h4>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
              <hr />
              <div className="post">
                <h4>Don&apos;t speak unless words flow out of your mouth</h4>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
              <hr />
              <div className="post">
                <h4>Everything is a language</h4>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
            </div>
          </div>

          <div className="trending">
            <h3>Trending skill trees</h3>
            <div className="trending-skills">
              <div className="trending-skill">
                <div className="skill-icon" id="cooking">
                  Cooking
                </div>
              </div>
              <div className="trending-skill">
                <div id="finance" className="skill-icon">
                  Finance
                </div>
              </div>
              <div className="trending-skill">
                <div id="languages" className="skill-icon">
                  Languages
                </div>
              </div>
              <div className="trending-skill">
                <div id="maths" className="skill-icon">
                  Maths
                </div>
              </div>
              <div className="trending-skill">
                <div id="IT" className="skill-icon">
                  IT
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectCard() {
  return (
    <div className="card">
      <div className="card-text">
        <h4>Signup-form</h4>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>
      <div className="card-footer">
        <Icon path={mdiStarOutline} alt="fav" className="icon" />
        <Icon path={mdiEyeOutline} alt="github" className="icon" />
        <Icon
          path={mdiShareVariantOutline}
          alt="share-variant-outline"
          className="icon"
        />
      </div>
    </div>
  );
}
