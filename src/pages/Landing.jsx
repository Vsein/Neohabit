import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { startOfDay, endOfDay, addDays } from 'date-fns';
import { Icon } from '@mdi/react';
import { mdiCalendar, mdiTimerOutline } from '@mdi/js';
import useTitle from '../hooks/useTitle';
import { CellPeriod } from '../components/HeatmapCells';
import ExerciseProject from '../assets/project-exercise2.png';
import DevelopmentProject from '../assets/project-development2.png';
import NihongoProject from '../assets/project-nihongo2.png';
import SocialProject from '../assets/project-social2.png';
import CleaningProject from '../assets/project-cleaning.png';
import MedsProject from '../assets/project-medication.png';

export default function Landing() {
  useTitle('Neohabit | A progressive-overload focused habit-tracker');
  const [value, setValue] = useState(0);
  const [exampleValues, setExampleValues] = useState(
    [...Array(19)].map((e) => ~~(Math.random() * 2)),
  );
  const [exampleValues2, setExampleValues2] = useState(
    [...Array(10)].map((e) => Math.min(~~(Math.random() * 5), 1)),
  );

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
    <div id="content-landing">
      <header className="landing-header-container">
        <div className="landing-header">
          <h1 className="neohabit" />
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
          <h1 className="landing-intro-text">Your self-improvement app which actually helps</h1>
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
          <div className="landing-features-container">
            <h3 className="landing-features-title">Features you won&apos;t find anywhere else</h3>
            <div className="landing-features">
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
                <p>
                  Track any numeric values, i.e. workout reps, hours of sleep, or even test scores
                </p>
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
        <section className="landing-features-content">
          <div className="landing-features-container">
            {/* <h2 className="landing-about-text-header">What those features allow you to do</h2> */}
            <h3 className="landing-features-title">What those features allow you to do</h3>
            <p style={{ marginBottom: '20px' }}>
              While the features above might not seem like a big deal by themselves, they have a
              numerous amount of applications. Let us show an example.
            </p>
            <p>In a regular habit-tracker, you would probably have something like this:</p>
            <div
              className="overview-habit-cells"
              style={{
                // '--numeric-text-color': getNumericTextColor("#43d64e"),
                '--cell-height': '30px',
                '--cell-width': '30px',
                marginTop: '10px',
                marginBottom: '30px',
              }}
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
              And while it is enough for tracking some of the habits, it certainly would help to
              have more control over the habit frequencies:
            </p>
            <div
              className="overview-habit-cells"
              style={{
                // '--numeric-text-color': getNumericTextColor(habit.color),
                '--cell-height': '30px',
                '--cell-width': '30px',
                marginTop: '10px',
                marginBottom: '30px',
              }}
            >
              {exampleValues2.map(
                (exampleValue, Index) =>
                  Index < 2 && (
                    <CellPeriod
                      key={`habit-example-${Index}`}
                      color="#43d64e"
                      value={exampleValue}
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
                      value={exampleValue}
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
                      value={exampleValue}
                      targetValue={1}
                      dateStart={startOfDay(addDays(new Date(), Index))}
                      dateEnd={endOfDay(addDays(new Date(), Index))}
                      dummy={true}
                      vertical={false}
                    />
                  ),
              )}
            </div>
            {/* <p style={{ marginBottom: '20px' }}> */}
            <p>
              This way, instead of trying to do the new habit every single day from the start, you
              start slow. In this example, it sets the first goal as once in 4 days. And as you get
              more comfortable, you can start challenging yourself more.
              {/* Or you can use the opposite process for an equal challenge of eliminating bad habits. */}
            </p>
            {/* <p> */}
            {/*   And even that is not the end of it. Imagine that you have a habit which you've already built, but you */}
            {/* </p> */}
          </div>
        </section>
        <section
          className="landing-about"
          style={{ flexDirection: 'column', height: 'min(800px, 125vh)' }}
        >
          <h2 className="landing-about-text-header" style={{ marginBlock: '20px' }}>
            Various ideas of habits you may track
          </h2>
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
          <div className="landing-features-container" style={{ height: '80%', marginTop: '80px' }}>
            {/* <h2 className="landing-about-text-header">What those features allow you to do</h2> */}
            <h3 className="landing-features-title">
              How does it compare with other forms of tools?
            </h3>
            <div className="landing-features-section">
              <div className="centering" style={{ height: '100%', marginLeft: '10px' }}>
                <Icon className="icon damn" path={mdiCalendar} />
              </div>
              <p style={{ marginBottom: '20px' }}>
                If you take calendars, they are very rigid. Most of the people don't really need to
                set the exact time for making something. And if they do, they end up putting
                themselves in very tough boundaries, from which it's hard to escape. Calendars are
                good for appointments, meetings, and things you know to be fixed. In all the other
                cases, it's better to allow yourself some breathing room both for the order of
                habits, and for the sudden desire to read, study, or go for a run.
              </p>
            </div>
            <div className="landing-features-section">
              <div className="centering" style={{ height: '100%', marginLeft: '10px' }}>
                <Icon className="icon damn" path={mdiTimerOutline} />
              </div>
              <p style={{ marginBottom: '20px' }}>
                Then you have time-trackers. Those things are good to use for a couple of days. If
                you use it as your primary productivity tool, you're doomed to either start
                optimizing your time (and all the fun of random things with it), or to think that
                more hours spent on something necessarily equals better results. Time is important,
                but less important than allowing yourself to rest often and properly. Neohabit has a
                pomodoro timer built in, and we believe it to be sufficient.
              </p>
            </div>
            <hr />
            <p style={{ marginTop: '20px' }}>
              Habit-trackers are a different kind of beast, but they all don't take human nature
              into consideration properly. They either focus on streaks, or they rarely have
              anything apart from daily habits. When building habits, it's important to understand
              that you shouldn't try to bite more than you can chew.
            </p>
            <p style={{ marginTop: '20px', marginBottom: '-30px' }}>
              Neohabit allows you to track habits of any complexity. Like laundry that you need to
              do once every two weeks, or reach out to someone when you feel like it once every blue
              moon. Noone in their right mind would do laundry every day, or think that working once
              a day for an hour is the most you can do. But for one reason or another habit-trackers
              miss that completely.
            </p>
          </div>
        </section>
        <section className="landing-lastcall">{/* Some things about billing */}</section>
      </main>
      <footer className="landing-footer-container">
        <div className="landing-footer">
          <h3> Copyright @ 2023</h3>
        </div>
      </footer>
    </div>
  );
}
