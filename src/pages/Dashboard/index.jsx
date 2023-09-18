import React from 'react';
import Icon from '@mdi/react';
import {
  mdiMagnify,
  mdiBell,
  mdiStarOutline,
  mdiEyeOutline,
  mdiShareVariantOutline,
} from '@mdi/js';
import PFP from '../../components/ProfilePicture';
import useTitle from '../../hooks/useTitle';

export default function Dashboard() {
  useTitle('Dashboard | Neohabit');

  return (
    <div id="content-dashboard">
      {/* <div className="dashboard-header"> */}
      {/*   <Icon path={mdiMagnify} alt="search" id="search-img" className="icon" /> */}
      {/*   <input type="search" className="searchbar" /> */}
      {/*   <Icon path={mdiBell} alt="bell" className="icon notifications"/> */}
      {/* </div> */}

      <div className="controls">
        <PFP type="big" />
        <div className="welcome">
          <p className="hello">Hello there,</p>
          <p className="username">Serene Coder (&#64;Vsein)</p>
        </div>
        <button className="dashboard-btn" id="new">
          New
        </button>
        <button className="dashboard-btn" id="upload">
          Upload
        </button>
        <button className="dashboard-btn" id="share-variant-outline">
          Share
        </button>
      </div>

      <div className="main">
        <div className="dashboard-habits">
          <h3>Your habits</h3>
          <div className="dashboard-habits-grid">
            <HabitCard />
            <HabitCard />
            <HabitCard />
            <HabitCard />
            <HabitCard />
            <HabitCard />
          </div>
        </div>

        <div className="news">
          <div className="announcements">
            <h3>Recent articles</h3>
            <div className="posts">
              <Post title="Importance of sacrifice" />
              <hr />
              <Post title="Don't speak unless words flow out of your mouth" />
              <hr />
              <Post title="Everything is a language" />
            </div>
          </div>

          <div className="trending">
            <h3>Trending skill trees</h3>
            <div className="trending-skills">
              <Skill color="#edad0e" name="Cooking" />
              <Skill color="#ffa500" name="Finance" />
              <Skill color="#00ed76" name="Languages" />
              <Skill color="#00c4cd" name="Maths" />
              <Skill color="#009acd" name="IT" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HabitCard() {
  return (
    <a className="card" tabIndex="0">
      <div className="card-text">
        <h4>Signup-form</h4>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua.
        </p>
      </div>
      <div className="card-footer">
        <button>
          <Icon path={mdiStarOutline} alt="fav" className="icon" />
        </button>
        <button>
          <Icon path={mdiEyeOutline} alt="github" className="icon" />
        </button>
        <button>
          <Icon path={mdiShareVariantOutline} alt="share-variant-outline" className="icon" />
        </button>
      </div>
    </a>
  );
}

function Post(props) {
  const { title } = props;
  return (
    <a className="post" tabIndex="0">
      <h4>{title}</h4>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua.
      </p>
    </a>
  );
}

function Skill(props) {
  const { color, name } = props;
  return (
    <button className="skill-icon" style={{ backgroundColor: color }}>
      {name}
    </button>
  );
}
