import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import useTitle from '../hooks/useTitle';
import { CellPeriod } from '../components/HeatmapCells';
import { startOfDay, endOfDay } from 'date-fns';

export default function Landing() {
  useTitle('Neohabit | A progressive-overload focused habit-tracker');
  const [value, setValue] = useState(0);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      if (value >= 102) {
        setValue(0);
        return;
      }
      if (value >= 18 && value < 100) {
        setValue(100);
        return;
      }
      setValue(value + 1);
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
        <section className="landing-features">
          <div className="landing-features-container">
            <h3 className="landing-features-text">Features you won&apos;t find anywhere else</h3>
            <div className="landing-cell-container">
              <CellPeriod
                color="#d700ff"
                value={value}
                dateStart={startOfDay(new Date())}
                dateEnd={endOfDay(new Date())}
                dummy={true}
              />
            </div>
            <div className="landing-cell-container">
              <CellPeriod
                color="#d700ff"
                value={value}
                dateStart={startOfDay(new Date())}
                dateEnd={endOfDay(new Date())}
                dummy={true}
                numeric={true}
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
                numeric={true}
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
            {/* Skill trees, habits, heatmaps */}
          </div>
        </section>
        <section className="landing-about">
          {/* Learn more about how it works, the blog or something */}
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
