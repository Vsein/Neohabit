import React, { useEffect, useState, useReducer } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { startOfDay, endOfDay, addDays, getYear } from 'date-fns';
import { Icon } from '@mdi/react';
import {
  mdiCalendar,
  mdiTimerOutline,
  mdiCalendarMultiselect,
  mdiMoonWaxingCrescent,
  mdiWhiteBalanceSunny,
  mdiMenu,
  mdiLoginVariant,
  mdiGithub,
  mdiYoutube,
} from '@mdi/js';
import useTitle from '../hooks/useTitle';
import { useMediaColorScheme, getPreferredTheme } from '../hooks/useMediaColorScheme';
import changeTheme from '../utils/changeTheme';
import { getNumericTextColor } from '../hooks/usePaletteGenerator';
import useMenuToggler from '../hooks/useMenuToggler';
import { CellPeriod } from '../components/HeatmapCells';
import { MenuSection, GithubLink } from '../components/MainMenu';
import { ProfilePicture } from '../components/UI';
import mockProjectsData from '../assets/mockProjectsData';
import Reddit from '../logos/reddit.svg';

const progression = [
  0, 1, 2, 5, 10, 20, 50, 100, 500, 1_000, 5_000, 10_000, 100_000, 1_000_000, 10_000_000,
  100_000_000, 1_000_000_000,
];

export default function Landing() {
  useTitle('Neohabit | A self-hosted, periodic habit-tracker');
  useMediaColorScheme();
  const [exampleValues, setExampleValues] = useState(
    [...Array(19)].map((e) => ~~(Math.random() * 2)),
  );
  const [exampleValues2, setExampleValues2] = useState(
    [...Array(10)].map((e) => Math.min(~~(Math.random() * 5), 1)),
  );
  const [exampleValues3, setExampleValues3] = useState(
    [...Array(10)].map((e) => ~~(Math.random() * 3)),
  );
  const firstPaneColor = '#43d64e';
  const secondPaneColor = '#1D60C1';
  const thirdPaneColor = '#CE0705';

  return (
    <div id="content-landing">
      <header className="landing-header-container">
        <div className="landing-header">
          <div className="landing-header-logo">
            <ProfilePicture type="small" />
            <h1 className="neohabit" />
          </div>
          <ul className="landing-header-links">
            {/* <li> */}
            {/*   <NavLink to="/contact">Contact</NavLink> */}
            {/* </li> */}
            <li>
              <ThemeToggle />
            </li>
            <li>
              <Link
                to="https://github.com/Vsein/Neohabit"
                target="_blank"
                className="landing-header-links-button centering"
              >
                <Icon className="icon big circle" path={mdiGithub} />
              </Link>
            </li>
            <li>
              <NavLink to="/login">Log in</NavLink>
            </li>
          </ul>
          <DropdownMenu />
        </div>
      </header>
      <main className="landing">
        <section className="landing-intro">
          <h1 className="landing-intro-text">A fresh new look at habit-tracking</h1>
        </section>
        <FeaturesSection />
        <section className="landing-features-content">
          <div
            className="landing-features-container"
            style={{ minHeight: 'auto', '--habit-color': firstPaneColor }}
          >
            {/* <h2 className="landing-about-text-header">What those features allow you to do</h2> */}
            <h3 className="landing-features-title">New approach to habit-building</h3>
            <p>In a regular habit-tracker, you would probably have something like this:</p>
            <div className="overview-habit-cells landing-cells">
              {exampleValues.map((exampleValue, Index) => (
                <CellPeriod
                  key={`habit-example-${Index}`}
                  value={exampleValue}
                  targetValue={1}
                  dateStart={startOfDay(addDays(new Date(), Index))}
                  dateEnd={endOfDay(addDays(new Date(), Index))}
                  vertical={false}
                />
              ))}
            </div>
            <p>
              Why not start small? For example, once in 4 days at the beginning. And you can change
              it as you get comfortable:
            </p>
            <div className="overview-habit-cells landing-cells">
              {exampleValues2.map(
                (exampleValue, Index) =>
                  Index < 2 && (
                    <CellPeriod
                      key={`habit-example-${Index}`}
                      value={1}
                      targetValue={1}
                      dateStart={startOfDay(addDays(new Date(), Index * 3))}
                      dateEnd={endOfDay(addDays(new Date(), (Index + 1) * 3))}
                      vertical={false}
                    />
                  ),
              )}
              {exampleValues2.map(
                (exampleValue, Index) =>
                  Index >= 2 &&
                  Index < 5 && (
                    <CellPeriod
                      key={`habit-example-${Index}`}
                      value={1}
                      targetValue={1}
                      dateStart={startOfDay(addDays(new Date(), Index * 1))}
                      dateEnd={endOfDay(addDays(new Date(), (Index + 1) * 1))}
                      vertical={false}
                    />
                  ),
              )}
              {exampleValues2.map(
                (exampleValue, Index) =>
                  Index >= 5 &&
                  Index < 10 && (
                    <CellPeriod
                      key={`habit-example-${Index}`}
                      value={1}
                      targetValue={1}
                      dateStart={startOfDay(addDays(new Date(), Index))}
                      dateEnd={endOfDay(addDays(new Date(), Index))}
                      vertical={false}
                    />
                  ),
              )}
            </div>
            <p style={{ marginBottom: '20px' }}>
              This approach prevents the burnout which often comes when people start doing something
              new too fast.
            </p>
            <hr />
            <p style={{ marginTop: '20px' }}>
              <b>The principle is the great flexibility:</b> The ability to set habits which happen
              X times in Y days. You can change the X and Y in the middle of the habit. It's not
              rigid like calendars, this way you won't feel burned out when you don't do something
              with exactly 3 days gaps, for example. Just in 3 day periods, at any time you want.
            </p>
          </div>
        </section>
        <section className="landing-features-content">
          <div className="landing-features-container" style={{ minHeight: 'auto' }}>
            {/* <h2 className="landing-about-text-header">What those features allow you to do</h2> */}
            <h3 className="landing-features-title">More ways to use this principle</h3>
            <p>
              Doing something once a day (or one hour a day) is rarely all that&apos;s required. So,
              once 1 hour becomes comfortable, make 2 the new standard:
            </p>
            <div
              className="overview-habit-cells landing-cells"
              style={{ '--habit-color': secondPaneColor }}
            >
              {exampleValues3.map(
                (exampleValue, Index) =>
                  Index < 8 && (
                    <CellPeriod
                      key={`habit-example-${Index}`}
                      value={Math.min(exampleValue + 1, 1)}
                      targetValue={1}
                      dateStart={startOfDay(addDays(new Date(), Index))}
                      dateEnd={endOfDay(addDays(new Date(), Index))}
                      vertical={false}
                    />
                  ),
              )}
              {exampleValues3.map(
                (exampleValue, Index) =>
                  Index < 6 && (
                    <CellPeriod
                      key={`habit-example-${Index}`}
                      value={Math.min(exampleValue + 2, 2)}
                      targetValue={2}
                      dateStart={startOfDay(addDays(new Date(), Index))}
                      dateEnd={endOfDay(addDays(new Date(), Index))}
                      vertical={false}
                    />
                  ),
              )}
              {exampleValues3.map(
                (exampleValue, Index) =>
                  Index >= 5 &&
                  Index < 10 && (
                    <CellPeriod
                      key={`habit-example-${Index}`}
                      value={Math.min(exampleValue + 2, 3)}
                      targetValue={3}
                      dateStart={startOfDay(addDays(new Date(), Index))}
                      dateEnd={endOfDay(addDays(new Date(), Index))}
                      vertical={false}
                    />
                  ),
              )}
            </div>
            <p>The same principle can be used in reverse for dropping addictions:</p>
            <div
              className="overview-habit-cells landing-cells"
              style={{ '--habit-color': thirdPaneColor }}
            >
              {exampleValues3.map(
                (exampleValue, Index) =>
                  Index >= 5 &&
                  Index < 10 && (
                    <CellPeriod
                      key={`habit-example-${Index}`}
                      value={Math.min(exampleValue + 2, 3)}
                      targetValue={3}
                      dateStart={startOfDay(addDays(new Date(), Index))}
                      dateEnd={endOfDay(addDays(new Date(), Index))}
                      vertical={false}
                    />
                  ),
              )}
              {exampleValues3.map(
                (exampleValue, Index) =>
                  Index < 6 && (
                    <CellPeriod
                      key={`habit-example-${Index}`}
                      value={Math.min(exampleValue + 1, 2)}
                      targetValue={2}
                      dateStart={startOfDay(addDays(new Date(), Index))}
                      dateEnd={endOfDay(addDays(new Date(), Index))}
                      vertical={false}
                    />
                  ),
              )}
              {exampleValues3.map(
                (exampleValue, Index) =>
                  Index < 8 && (
                    <CellPeriod
                      key={`habit-example-${Index}`}
                      value={Math.min(exampleValue, 1)}
                      targetValue={1}
                      dateStart={startOfDay(addDays(new Date(), Index))}
                      dateEnd={endOfDay(addDays(new Date(), Index))}
                      vertical={false}
                    />
                  ),
              )}
            </div>
            <p>
              {' '}
              It can be anything - hours wasted on social media, alcohol, packs of
              cigarettes...{' '}
            </p>
          </div>
        </section>
        <section className="landing-about" style={{ flexDirection: 'column', minHeight: 'auto' }}>
          <h1 className="landing-about-text-header" style={{ marginBlock: '20px' }}>
            Various ideas of habits you may track
          </h1>
          {/* Learn more about how it works, the blog or something */}
          <div className="landing-projects">
            <div className="landing-project">
              <h2 className="landing-project-title">Learn languages</h2>
              <MockProjectSection name="nihongo" />
            </div>
            <div className="landing-project">
              <h2 className="landing-project-title">Stay in shape</h2>
              <MockProjectSection name="exercise" />
            </div>
            <div className="landing-project">
              <h2 className="landing-project-title">Adjust your work-life balance</h2>
              <MockProjectSection name="development" />
            </div>
            <div className="landing-project">
              <h2 className="landing-project-title">Remind yourself to reach out</h2>
              <MockProjectSection name="social" />
            </div>
            <div className="landing-project">
              <h2 className="landing-project-title">Clean up your house in your free time</h2>
              <MockProjectSection name="cleaning" />
            </div>
            <div className="landing-project">
              <h2 className="landing-project-title">Never forget whether you took meds</h2>
              <MockProjectSection name="meds" />
            </div>
          </div>
        </section>
        <section className="landing-features-content">
          <div
            className="landing-features-container"
            style={{ marginTop: '80px', paddingBottom: '5px' }}
          >
            {/* <h2 className="landing-about-text-header">What those features allow you to do</h2> */}
            <h3 className="landing-features-title">How does it compare with other tools?</h3>
            <div className="landing-features-section">
              <div className="landing-features-section-image centering">
                <Icon className="icon gigantic" path={mdiCalendar} />
              </div>
              <div>
                <h4>Calendars:</h4>
                <ul>
                  <li className="landing-li">are more suited for appointments and meetings</li>
                  <li className="landing-li">are very rigid</li>
                  <li className="landing-li">require to set a time for every entry</li>
                  <li className="landing-li">often need rescheduling to work properly</li>
                </ul>
              </div>
            </div>
            <div className="landing-features-section">
              <div className="landing-features-section-image centering">
                <Icon className="icon gigantic" path={mdiTimerOutline} />
              </div>
              <div>
                <h4>Time-trackers:</h4>
                <ul>
                  <li className="landing-li">may provide insights on what you waste time on</li>
                  {/* <li className="landing-li">are good to use in the background</li> */}
                  <li className="landing-li">usually lead to over-optimization</li>
                  <li className="landing-li">require to start and end each entry</li>
                  <li className="landing-li">
                    are hard to automate for anything, except screen time
                  </li>
                </ul>
              </div>
            </div>
            <div className="landing-features-section">
              <div className="landing-features-section-image centering">
                <Icon className="icon gigantic" path={mdiCalendarMultiselect} />
              </div>
              <div>
                <h4>Regular habit-trackers:</h4>
                <ul>
                  <li className="landing-li">rarely have anything apart from daily habits</li>
                  <li className="landing-li">focus on streaks</li>
                  <li className="landing-li">
                    can&apos;t incorporate all the info that calendars can
                  </li>
                </ul>
              </div>
            </div>
            <div className="landing-features-section">
              <div className="landing-features-section-image centering">
                <ProfilePicture type="gigantic" />
              </div>
              <div>
                <h4>Neohabit:</h4>
                <ul>
                  <li className="landing-li">allows you to ease into new habits</li>
                  <li className="landing-li">serves as a convenient overview</li>
                  <li className="landing-li">is a good way to track any habit</li>
                  <li className="landing-li">
                    doesn&apos;t require a lot of time to set up/maintain
                  </li>
                  <li className="landing-li">can be used as a reminder</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        <SelfhostedSection />
      </main>
      <footer className="landing-footer-container">
        <div className="landing-footer">
          <h3> Copyright @ 2023 - {getYear(new Date())}</h3>
        </div>
      </footer>
    </div>
  );
}

function ThemeToggle() {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  return (
    <button
      className="landing-header-links-theme-toggle centering"
      title="Theme toggle"
      onClick={() => {
        changeTheme(getPreferredTheme() === 'dark' ? 'light' : 'dark');
        forceUpdate();
      }}
    >
      <Icon
        path={mdiWhiteBalanceSunny}
        className={`icon big ${getPreferredTheme() === 'light' ? 'active' : ''}`}
      />
      <Icon
        path={mdiMoonWaxingCrescent}
        className={`icon big ${getPreferredTheme() === 'dark' ? 'active' : ''}`}
      />
    </button>
  );
}

function ThemeToggleMenu() {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const theme = getPreferredTheme();

  return (
    <li>
      <button
        className="menu-section"
        title="Theme toggle"
        onClick={() => {
          changeTheme(theme === 'dark' ? 'light' : 'dark');
          forceUpdate();
        }}
      >
        <Icon
          path={theme === 'dark' ? mdiMoonWaxingCrescent : mdiWhiteBalanceSunny}
          className="icon"
        />
        <p className="link">{`Theme: ${theme}`}</p>
      </button>
    </li>
  );
}

function DropdownMenu() {
  const [menuOpened, { toggleMenu }] = useMenuToggler();

  return (
    <nav className="menu landing-mobile-menu">
      <button
        className={`centering menu-toggle ${menuOpened ? 'active' : ''}`}
        onClick={toggleMenu}
        title="Toggle menu [i]"
      >
        <Icon path={mdiMenu} className="icon medium" />
      </button>
      <ul
        className={`menu-container ${menuOpened ? 'active' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <ThemeToggleMenu />
        <GithubLink />
        <hr />
        <MenuSection path={mdiLoginVariant} title="Login" to="/login" />
      </ul>
    </nav>
  );
}

function FeaturesSection() {
  const [value, setValue] = useState(0);
  const preferDark = document.documentElement.classList.contains('dark');
  const color = preferDark ? '#1D93FF' : '#8FE9EF';

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setValue((prev) => (prev >= 16 ? 0 : prev + 1));
    }, 1000);
    return () => clearInterval(timerInterval);
  }, []);

  return (
    <section className="landing-features-content">
      <div className="landing-features-container">
        <h3 className="landing-features-title">Features you won&apos;t find anywhere else</h3>
        <div
          className="landing-features"
          style={{
            marginBlock: 'auto',
            '--numeric-text-color': getNumericTextColor(color),
            '--habit-color': color,
          }}
        >
          <div className="landing-feature-container">
            <div className="landing-feature centering">
              <div className="landing-cell-container">
                <CellPeriod
                  value={value}
                  dateStart={startOfDay(new Date())}
                  dateEnd={endOfDay(new Date())}
                />
              </div>
            </div>
            <p>Intuitive design for habits that happen more than once a day</p>
          </div>
          <div className="landing-feature-container">
            <div className="landing-feature centering">
              <div className="landing-cell-container">
                <CellPeriod
                  value={value % 3}
                  targetValue={2}
                  dateStart={startOfDay(new Date())}
                  dateEnd={endOfDay(new Date())}
                  numeric={false}
                />
              </div>
              <div className="landing-cell-container">
                <CellPeriod
                  value={value % 5}
                  targetValue={4}
                  dateStart={startOfDay(new Date())}
                  dateEnd={endOfDay(new Date())}
                  numeric={false}
                />
              </div>
              <div className="landing-cell-container">
                <CellPeriod
                  value={value % 10}
                  targetValue={9}
                  dateStart={startOfDay(new Date())}
                  dateEnd={endOfDay(new Date())}
                  numeric={false}
                />
              </div>
              <div className="landing-cell-container">
                <CellPeriod
                  value={value}
                  targetValue={16}
                  dateStart={startOfDay(new Date())}
                  dateEnd={endOfDay(new Date())}
                  numeric={false}
                />
              </div>
            </div>
            <p>Set daily goals and work your way up toward them</p>
          </div>
          <div className="landing-feature-container">
            <div className="landing-feature centering">
              <div className="landing-cell-container" style={{ '--total-width': 3 }}>
                <CellPeriod
                  value={value}
                  dateStart={startOfDay(new Date())}
                  dateEnd={endOfDay(addDays(new Date(), 2))}
                  vertical={false}
                />
              </div>
              <div
                className="landing-cell-container"
                style={{ '--total-width': 3, '--max-value': 16 }}
              >
                <CellPeriod
                  value={value}
                  dateStart={startOfDay(new Date())}
                  dateEnd={endOfDay(addDays(new Date(), 2))}
                  vertical={false}
                  monochromatic
                />
              </div>
            </div>
            <p>Set date periods for habits (weekly, monthly, once in X days/weeks)</p>
          </div>
          <div className="landing-feature-container">
            <div className="landing-feature centering">
              <div className="landing-cell-container" style={{ '--total-width': 3, '--is-big': 1 }}>
                <CellPeriod
                  value={progression[value]}
                  targetValue={1e9}
                  dateStart={startOfDay(new Date())}
                  dateEnd={endOfDay(addDays(new Date(), 2))}
                  numeric={true}
                  vertical={false}
                />
              </div>
              <div className="landing-cell-container" style={{ '--is-big': 1 }}>
                <CellPeriod
                  value={progression[value]}
                  targetValue={1e9}
                  dateStart={startOfDay(new Date())}
                  dateEnd={endOfDay(new Date())}
                  numeric={true}
                />
              </div>
            </div>
            <p>Track any numeric values, i.e. scores, spendings, calories or workout reps</p>
          </div>
        </div>
        {/* Skill trees, habits, heatmaps */}
      </div>
    </section>
  );
}

function MockProjectSection({ name }) {
  return (
    <div className="landing-habits">
      {mockProjectsData[name].map((habit, index) => (
        <div
          key={index}
          className="landing-habit"
          style={{
            '--length': 16,
            '--numeric-text-color': getNumericTextColor(habit.color),
            '--habit-color': habit.color,
          }}
        >
          <div className="landing-habit-name">{habit.name}</div>
          <div className="landing-habit-cells">
            {habit.data.map((value, Index) => (
              <CellPeriod
                key={`habit-example-${Index}`}
                value={value}
                targetValue={habit.target[Index]}
                dateStart={startOfDay(addDays(new Date(), Index))}
                dateEnd={endOfDay(addDays(new Date(), Index + habit.cell_length[Index] - 1))}
                vertical={false}
                numeric={habit.numeric}
                dummy={(habit?.is_dummy && habit.is_dummy[Index]) || false}
              />
            ))}
          </div>
          <div />
        </div>
      ))}
    </div>
  );
}

function PrecursorSection() {
  return (
    <section className="landing-about">
      <div className="landing-about-text">
        <h2 className="landing-about-text-header">The Precursor</h2>
        {/* <p> */}
        {/*   Have you noticed that almost every self-improvement app has a system of streaks, in */}
        {/*   one way or another? */}
        {/* </p> */}
        <p>
          In the lifting communitiy, progressive overload is a concept where you try to go slightly
          further each week, while still remaining comfortable.
        </p>
        <p>
          Why won't habit-trackers incorporate that principle for building habits? Why would you
          focus on streaks and doing something daily from the very start, instead of starting small?
        </p>
        <p>
          Why is it so hard to see the correlations between different habits/addictions on those
          apps, when it should be their main goal?
        </p>
        <p>
          Also, once something like studying/immersing for 1 hour a day becomes a habit, why
          isn&apos;t there a better way to display trying to study more than that?
        </p>
        <br />
        <p>All those questions led to the creation of Neohabit.</p>
      </div>
    </section>
  );
}

function SelfhostedSection() {
  return (
    <section className="landing-lastcall">
      <div className="landing-lastcall-container">
        <div className="landing-lastcall-header">
          <h1 className="landing-lastcall-title">Self-host</h1>
          <Link to="https://github.com/Vsein/Neohabit" target="_blank" style={{ width: '100%' }}>
            <button className="landing-lastcall-social-links button-default stretch big centering">
              Installation guide
              <Icon className="icon medium" path={mdiGithub} />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function SignupSection() {
  return (
    <section className="landing-lastcall">
      <div className="landing-lastcall-container">
        <div className="landing-lastcall-header">
          <h1 className="landing-lastcall-title">Create your account</h1>
          <NavLink to="/signup" style={{ width: '100%' }}>
            <button className="button-default stretch big">Sign up</button>
          </NavLink>
        </div>
        <div className="landing-lastcall-social">
          <h3 className="landing-lastcall-social-header">And stay tuned for the latest updates:</h3>
          <div className="landing-lastcall-social-links">
            <Link to="https://www.reddit.com/user/VseinSama/" target="_blank">
              <img src={Reddit} className="icon big circle" />
            </Link>
            <Link to="https://github.com/Vsein/Neohabit" target="_blank">
              <Icon className="icon big circle" path={mdiGithub} />
            </Link>
            {/* <Link */}
            {/*   to="https://www.youtube.com/@Neohabit" */}
            {/*   target="_blank" */}
            {/* > */}
            {/*   <Icon className="icon big circle" path={mdiYoutube} /> */}
            {/* </Link> */}
          </div>
        </div>
      </div>
    </section>
  );
}
