import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { startOfDay, endOfDay, addDays } from 'date-fns';
import { Icon } from '@mdi/react';
import { mdiCalendar, mdiTimerOutline, mdiCalendarMultiselect } from '@mdi/js';
import useTitle from '../hooks/useTitle';
import { CellPeriod } from '../components/HeatmapCells';
import ExerciseProject from '../assets/project-exercise2.png';
import DevelopmentProject from '../assets/project-development3.png';
import NihongoProject from '../assets/project-nihongo3.png';
import SocialProject from '../assets/project-social2.png';
import CleaningProject from '../assets/project-cleaning.png';
import MedsProject from '../assets/project-medication.png';
import MiniLogo from '../logos/neohabit-mini-logo-50x50.png';
import Logo from '../logos/neohabit-mini-logo.png';

export default function Landing() {
  useTitle('Neohabit | A systemic, gradual habit-tracker');
  const [exampleValues, setExampleValues] = useState(
    [...Array(19)].map((e) => ~~(Math.random() * 2)),
  );
  const [exampleValues2, setExampleValues2] = useState(
    [...Array(10)].map((e) => Math.min(~~(Math.random() * 5), 1)),
  );
  const [exampleValues3, setExampleValues3] = useState(
    [...Array(10)].map((e) => ~~(Math.random() * 3)),
  );

  return (
    <div id="content-landing">
      <header className="landing-header-container">
        <div className="landing-header">
          <div className="landing-header-logo">
            <img src={MiniLogo} className="icon bigger" />
            <h1 className="neohabit" />
          </div>
          <ul className="landing-header-links">
            {/* <li> */}
            {/*   <NavLink to="/contact">Contact</NavLink> */}
            {/* </li> */}
            <li>
              <NavLink to="/signup">Sign up</NavLink>
            </li>
          </ul>
        </div>
      </header>
      <main className="landing">
        <section className="landing-intro">
          <h1 className="landing-intro-text">A fresh new look at habit-tracking</h1>
        </section>
        <section className="landing-about">
          <div className="landing-about-text">
            <h2 className="landing-about-text-header">The Precursor</h2>
            <p>
              Have you noticed that almost every self-improvement app has a system of streaks, in
              one way or another?
            </p>
            <p>
              We believe that thinking that relapses somehow ruin your progress is not only
              unhealthy, but can be outright dangerous when it comes to self-improvement. Not
              because you&apos;re building wrong habits, but just of the mindset you put yourself
              in.
            </p>
            <p>
              The people who have never ever learned that what they&apos;ve been doing for years is
              somehow wrong, might be better off than people who obsess with having a bad habit.
            </p>
            <br />
            <p>
              We aim to make your life easier by incorporating progressive overload into
              habit-building, so that you can have a better relationship with yourself!
            </p>
          </div>
        </section>
        <section className="landing-features-content">
          <div className="landing-features-container" style={{ minHeight: 'auto' }}>
            {/* <h2 className="landing-about-text-header">What those features allow you to do</h2> */}
            <h3 className="landing-features-title">New approach to habit-building</h3>
            <p>In a regular habit-tracker, you would probably have something like this:</p>
            <div
              className="overview-habit-cells landing-cells"
              // style={{ '--numeric-text-color': getNumericTextColor('#43d64e') }}
            >
              {exampleValues.map((exampleValue, Index) => (
                <CellPeriod
                  key={`habit-example-${Index}`}
                  color="#43d64e"
                  value={exampleValue}
                  targetValue={1}
                  dateStart={startOfDay(addDays(new Date(), Index))}
                  dateEnd={endOfDay(addDays(new Date(), Index))}
                  dummy={true}
                  vertical={false}
                />
              ))}
            </div>
            <p>
              Why not start small? For example, once in 4 days at the beginning. And you can change
              it as you get comfortable:
            </p>
            <div
              className="overview-habit-cells landing-cells"
              // style={{ '--numeric-text-color': getNumericTextColor(habit.color) }}
            >
              {exampleValues2.map(
                (exampleValue, Index) =>
                  Index < 2 && (
                    <CellPeriod
                      key={`habit-example-${Index}`}
                      color="#43d64e"
                      value={1}
                      targetValue={1}
                      dateStart={startOfDay(addDays(new Date(), Index * 3))}
                      dateEnd={endOfDay(addDays(new Date(), (Index + 1) * 3))}
                      dummy={true}
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
                      color="#43d64e"
                      value={1}
                      targetValue={1}
                      dateStart={startOfDay(addDays(new Date(), Index * 1))}
                      dateEnd={endOfDay(addDays(new Date(), (Index + 1) * 1))}
                      dummy={true}
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
                      color="#43d64e"
                      value={1}
                      targetValue={1}
                      dateStart={startOfDay(addDays(new Date(), Index))}
                      dateEnd={endOfDay(addDays(new Date(), Index))}
                      dummy={true}
                      vertical={false}
                    />
                  ),
              )}
            </div>
            <p style={{ marginBottom: '20px' }}>
              This approach eliminates the burnout which often comes when people start doing
              anything hard.
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
              // style={{ '--numeric-text-color': getNumericTextColor(habit.color) }}
            >
              {exampleValues3.map(
                (exampleValue, Index) =>
                  Index < 8 && (
                    <CellPeriod
                      key={`habit-example-${Index}`}
                      color="#25D4B5"
                      value={Math.min(exampleValue + 1, 1)}
                      targetValue={1}
                      dateStart={startOfDay(addDays(new Date(), Index))}
                      dateEnd={endOfDay(addDays(new Date(), Index))}
                      dummy={true}
                      vertical={false}
                    />
                  ),
              )}
              {exampleValues3.map(
                (exampleValue, Index) =>
                  Index < 6 && (
                    <CellPeriod
                      key={`habit-example-${Index}`}
                      color="#25D4B5"
                      value={Math.min(exampleValue + 2, 2)}
                      targetValue={2}
                      dateStart={startOfDay(addDays(new Date(), Index))}
                      dateEnd={endOfDay(addDays(new Date(), Index))}
                      dummy={true}
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
                      color="#25D4B5"
                      value={Math.min(exampleValue + 2, 3)}
                      targetValue={3}
                      dateStart={startOfDay(addDays(new Date(), Index))}
                      dateEnd={endOfDay(addDays(new Date(), Index))}
                      dummy={true}
                      vertical={false}
                    />
                  ),
              )}
            </div>
            <p>
              The same principle can be used in reverse for dropping addictions:
            </p>
            <div
              className="overview-habit-cells landing-cells"
              // style={{ '--numeric-text-color': getNumericTextColor(habit.color) }}
            >
              {exampleValues3.map(
                (exampleValue, Index) =>
                  Index >= 5 &&
                  Index < 10 && (
                    <CellPeriod
                      key={`habit-example-${Index}`}
                      color="#CE0705"
                      value={Math.min(exampleValue + 2, 3)}
                      targetValue={3}
                      dateStart={startOfDay(addDays(new Date(), Index))}
                      dateEnd={endOfDay(addDays(new Date(), Index))}
                      dummy={true}
                      vertical={false}
                    />
                  ),
              )}
              {exampleValues3.map(
                (exampleValue, Index) =>
                  Index < 6 && (
                    <CellPeriod
                      key={`habit-example-${Index}`}
                      color="#CE0705"
                      value={Math.min(exampleValue + 1, 2)}
                      targetValue={2}
                      dateStart={startOfDay(addDays(new Date(), Index))}
                      dateEnd={endOfDay(addDays(new Date(), Index))}
                      dummy={true}
                      vertical={false}
                    />
                  ),
              )}
              {exampleValues3.map(
                (exampleValue, Index) =>
                  Index < 8 && (
                    <CellPeriod
                      key={`habit-example-${Index}`}
                      color="#CE0705"
                      value={Math.min(exampleValue, 1)}
                      targetValue={1}
                      dateStart={startOfDay(addDays(new Date(), Index))}
                      dateEnd={endOfDay(addDays(new Date(), Index))}
                      dummy={true}
                      vertical={false}
                    />
                  ),
              )}
            </div>
            <p>
              {' '}
              It can be anything - packs of cigarettes, weed, alcohol, hours wasted on social
              media...{' '}
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
              <img alt="Nihongo project" src={NihongoProject} style={{ borderRadius: '10px' }} />
            </div>
            <div className="landing-project">
              <h2 className="landing-project-title">Stay in shape</h2>
              <img alt="Exercise project" src={ExerciseProject} style={{ borderRadius: '10px' }} />
            </div>
            <div className="landing-project">
              <h2 className="landing-project-title">Adjust your work-life balance</h2>
              <img
                alt="Development project"
                src={DevelopmentProject}
                style={{ borderRadius: '10px' }}
              />
            </div>
            <div className="landing-project">
              <h2 className="landing-project-title">Remind yourself to reach out</h2>
              <img alt="Social project" src={SocialProject} style={{ borderRadius: '10px' }} />
            </div>
            <div className="landing-project">
              <h2 className="landing-project-title">Clean up your house in your free time</h2>
              <img alt="Social project" src={CleaningProject} style={{ borderRadius: '10px' }} />
            </div>
            <div className="landing-project">
              <h2 className="landing-project-title">Never forget whether you took meds</h2>
              <img alt="Meds project" src={MedsProject} style={{ borderRadius: '10px' }} />
            </div>
          </div>
        </section>
        <section className="landing-features-content">
          <div className="landing-features-container" style={{ marginTop: '80px', paddingBottom: '5px' }}>
            {/* <h2 className="landing-about-text-header">What those features allow you to do</h2> */}
            <h3 className="landing-features-title">How does it compare with other tools?</h3>
            <div className="landing-features-section">
              <div className="landing-features-section-image centering">
                <Icon className="icon damn" path={mdiCalendar} />
              </div>
              <div>
                <h4>Calendars:</h4>
                <ul>
                  {/* <li className="landing-li">are more suited for appointments and meetings</li> */}
                  <li className="landing-li">are very rigid</li>
                  <li className="landing-li">require to set a time for every entry</li>
                  <li className="landing-li">often need rescheduling to work properly</li>
                </ul>
              </div>
            </div>
            <div className="landing-features-section">
              <div className="landing-features-section-image centering">
                <Icon className="icon damn" path={mdiTimerOutline} />
              </div>
              <div>
                <h4>Time-trackers:</h4>
                <ul>
                  <li className="landing-li">may provide insights on what you waste time on</li>
                  {/* <li className="landing-li">are good to use in the background</li> */}
                  <li className="landing-li">usually lead to over-optimization</li>
                </ul>
              </div>
            </div>
            <div className="landing-features-section">
              <div className="landing-features-section-image centering">
                <Icon className="icon damn" path={mdiCalendarMultiselect} />
              </div>
              <div>
                <h4>Regular habit-trackers:</h4>
                <ul>
                  <li className="landing-li">rarely have anything apart from daily habits</li>
                  <li className="landing-li">focus on streaks</li>
                  <li className="landing-li">can&apos;t incorporate all the info that calendars can</li>
                </ul>
              </div>
            </div>
            <div className="landing-features-section">
              <div className="landing-features-section-image centering">
                <img src={Logo} className="icon damn" />
              </div>
              <div>
                <h4>Neohabit:</h4>
                <ul>
                  <li className="landing-li">allows you to adjust the load</li>
                  <li className="landing-li">serves as a convenient overview</li>
                  <li className="landing-li">is a better replacement for a calendar</li>
                  <li className="landing-li">doesn&apos;t require a lot of time to set up/maintain</li>
                  <li className="landing-li">can be used as a reminder</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        <section className="landing-lastcall">
          <div className="landing-lastcall-container">
            <div className="landing-lastcall-header">
              <h1 className="landing-lastcall-title">Create your account</h1>
              <NavLink to="/signup" style={{ width: '100%' }}>
                <button className="button-default stretch big">Sign up</button>
              </NavLink>
            </div>
            <p>
              Follow our Telegram channel{' '}
              <a
                href="https://t.me/Neohabit_Official"
                className="landing-contact"
                target="_blank"
                rel="noopener noreferrer"
              >
                @Neohabit_Official
              </a>{' '}
              to know about any updates or upcoming feautres! If you have any suggestions, or wish
              to support us, feel free to reach out to{' '}
              <a
                href="https://t.me/VseinHanma"
                className="landing-contact"
                target="_blank"
                rel="noopener noreferrer"
              >
                @VseinHanma
              </a>
            </p>
          </div>
        </section>
      </main>
      <footer className="landing-footer-container">
        <div className="landing-footer">
          <h3> Copyright @ 2023 - 2024</h3>
        </div>
      </footer>
    </div>
  );
}

function FeaturesSection() {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const timerInterval = setTimeout(() => {
      function onTimeOut() {
        if (value >= 16) {
          setValue(0);
          return 0;
        }
        setValue(value + 1);
      }
      onTimeOut();
    }, 1000);
    return () => clearInterval(timerInterval);
  });

  return (
    <section className="landing-features-content">
      <div className="landing-features-container">
        <h3 className="landing-features-title">Features you won&apos;t find anywhere else</h3>
        <div className="landing-features" style={{ marginBlock: 'auto' }}>
          <div className="landing-feature-container">
            <div className="landing-feature centering">
              <div className="landing-cell-container">
                <CellPeriod
                  color="#d700ff"
                  value={value}
                  dateStart={startOfDay(new Date())}
                  dateEnd={endOfDay(new Date())}
                  dummy={true}
                />
              </div>
            </div>
            <p>Intuitive design for habits which happen more than once a day</p>
          </div>
          <div className="landing-feature-container">
            <div className="landing-feature centering">
              <div className="landing-cell-container">
                <CellPeriod
                  color="#d700ff"
                  value={value % 3}
                  targetValue={2}
                  dateStart={startOfDay(new Date())}
                  dateEnd={endOfDay(new Date())}
                  dummy={true}
                  numeric={false}
                />
              </div>
              <div className="landing-cell-container">
                <CellPeriod
                  color="#d700ff"
                  value={value % 5}
                  targetValue={4}
                  dateStart={startOfDay(new Date())}
                  dateEnd={endOfDay(new Date())}
                  dummy={true}
                  numeric={false}
                />
              </div>
              <div className="landing-cell-container">
                <CellPeriod
                  color="#d700ff"
                  value={value % 10}
                  targetValue={9}
                  dateStart={startOfDay(new Date())}
                  dateEnd={endOfDay(new Date())}
                  dummy={true}
                  numeric={false}
                />
              </div>
              <div className="landing-cell-container">
                <CellPeriod
                  color="#d700ff"
                  value={value}
                  targetValue={16}
                  dateStart={startOfDay(new Date())}
                  dateEnd={endOfDay(new Date())}
                  dummy={true}
                  numeric={false}
                />
              </div>
            </div>
            <p>Set daily goals and work your way up toward them</p>
          </div>
          <div className="landing-feature-container">
            <div className="landing-feature centering">
              <div className="landing-cell-container">
                <CellPeriod
                  color="#d700ff"
                  value={value}
                  targetValue={16}
                  dateStart={startOfDay(new Date())}
                  dateEnd={endOfDay(new Date())}
                  dummy={true}
                  numeric={true}
                />
              </div>
            </div>
            <p>Track any numeric values, i.e. workout reps, hours of sleep, or even test scores</p>
          </div>
          <div className="landing-feature-container">
            <div className="landing-feature centering">
              <div className="landing-cell-container" style={{ '--total-width': 3 }}>
                <CellPeriod
                  color="#d700ff"
                  value={value}
                  targetValue={16}
                  dateStart={startOfDay(new Date())}
                  dateEnd={endOfDay(addDays(new Date(), 2))}
                  dummy={true}
                  numeric={true}
                  vertical={false}
                />
              </div>
              <div className="landing-cell-container" style={{ '--total-width': 3 }}>
                <CellPeriod
                  color="#d700ff"
                  value={value % 3}
                  targetValue={2}
                  dateStart={startOfDay(new Date())}
                  dateEnd={endOfDay(addDays(new Date(), 2))}
                  dummy={true}
                  vertical={false}
                />
              </div>
            </div>
            <p>Set date periods for habits (weekly, monthly, once in X days)</p>
          </div>
        </div>
        {/* Skill trees, habits, heatmaps */}
      </div>
    </section>
  );
}
