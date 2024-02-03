import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Icon from '@mdi/react';
import { isSameDay } from 'date-fns';
import PFP from '../../components/ProfilePicture';
import { LotsOfRandom } from '../../components/HeatmapData';
import useTitle from '../../hooks/useTitle';

export default function Landing() {
  useTitle('About | Neohabit');
  const dateEnd = new Date();
  const dateStart = new Date(new Date().setYear(dateEnd.getFullYear() - 1));

  return (
    <div id="content-landing">
      <header className="landing-header-container">
        <div className="landing-header">
          <h1 className="neohabit" />
          <ul className="landing-header-links">
            <li>
              <NavLink to="/contact">Contact</NavLink>
            </li>
            <li>
              <NavLink to="/signup">Sign up</NavLink>
            </li>
          </ul>
        </div>
      </header>
      <main className="landing">
        <section className="landing-intro">
          <h1 className="landing-intro-text">
            Your self-improvement app which actually helps
          </h1>
        </section>
        <section className="landing-about">
          <div className="landing-about-text">
            <h2 className="landing-about-text-header">
              The Precursor
            </h2>
            <p>
              Have you noticed that almost every self-improvement app has a
              system of streaks, in one way or another?
            </p>
            <p>
              We believe that thinking that relapses somehow ruin your progress
              is not only unhealthy, but can be outright dangerous when it
              comes to self-improvement. Not because you're building wrong
              habits, but just of the mindset you put yourself in.
            </p>
            <p>
              The people who have never ever learned that what they've been
              doing for years is somehow wrong, might be better off than people
              who obsess with having a bad habit.
            </p>
            <br />
            <p>
              We aim to make your life easier by incorporating progressive
              overload into habit-building, so that you can have a better
              relationships with yourself!
            </p>
          </div>
        </section>
        <section className="landing-features">
          <div className="landing-features-container">
            <h3 className="landing-features-text">
              Features you won't find anywhere else
            </h3>
            {/* Skill trees, projects, heatmaps */}
          </div>
        </section>
        <section className="landing-about">
          <Heatmap
            data={LotsOfRandom()}
            // colorFunc={({ alpha }) => `rgba(3, 160, 3, ${alpha})`}
            colorFunc={({ alpha }) => `rgba(132, 221, 73, ${alpha})`}
            // colorFunc={({ alpha }) => `rgba(20, 78, 18, ${alpha})`}
            dateStart={dateStart}
            dateEnd={dateEnd}
          />
          {/* Learn more about how it works, the blog or something */}
        </section>
        <section className="landing-lastcall">
          {/* Some things about billing */}
        </section>
      </main>
      <footer className="landing-footer-container">
        <div className="landing-footer">
          <h3> Copyright @ 2022</h3>
        </div>
      </footer>
    </div>
  );
}

function Cell({ color, date, value, height, width }) {
  const style = {
    backgroundColor: color,
    height: 11 * height + 2 * 2 * (height - 1),
    width: 11 * width + 2 * 2 * (width - 1),
  };
  return <div className="landing-heatmap-cells-cell" style={style} />;
}

function Heatmap({ dateStart, colorFunc, data }) {
  const cells = Array.from(new Array(data.length));

  const min = Math.min(0, ...data.map((d) => d.value));
  const max = Math.max(...data.map((d) => d.value));

  const colorMultiplier = 1 / (max - min);

  return (
    <div className="landing-heatmap-cells">
      {cells.map((_, index) => {
        const date = new Date(
          new Date().setDate(dateStart.getDate() + index - 365),
        );
        const dataPoint = data.find((d) => isSameDay(date, d.date));
        const value = dataPoint ? dataPoint.value : 0;
        const height = dataPoint ? dataPoint.height : 1;
        const width = dataPoint ? dataPoint.width : 1;
        const alpha = colorMultiplier * value;
        const colorRGB = hexToRgb(mixColors(hexToRgb('#3BCDE8'), hexToRgb('#23FFCB'), Math.random() * 0.7));
        const color = `rgba(${colorRGB.r}, ${colorRGB.g}, ${colorRGB.b}, ${alpha})`;

        return (
          <Cell
            key={index}
            index={index}
            value={value}
            date={date}
            height={height}
            width={width}
            color={color}
          />
        );
      })}
    </div>
  );
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function componentToHex(c) {
  const hex = c.toString(16);
  return hex.length === 1 ? '0' + hex : hex;
}

function rgbToHex(r, g, b) {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function mixColors(base, goal, alpha) {
  const rgb = {
    r: Math.round(base.r + (goal.r - base.r) * alpha),
    g: Math.round(base.g + (goal.g - base.g) * alpha),
    b: Math.round(base.b + (goal.b - base.b) * alpha),
  };
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

const RED = 0.2126;
const GREEN = 0.7152;
const BLUE = 0.0722;

const GAMMA = 2.4;

function luminance(r, g, b) {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** GAMMA;
  });
  return a[0] * RED + a[1] * GREEN + a[2] * BLUE;
}

function contrast(rgb1, rgb2) {
  const lum1 = luminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = luminance(rgb2.r, rgb2.g, rgb2.b);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

function generatePalette(base, goal) {
  const palette = [];
  for (let i = 0; i <= 10; i++) {
    const rgb = mixColors(base, goal, 0.1 * i);
    palette.push(rgb);
  }
  return palette;
}

function getNumericTextColor(color) {
  if (contrast(hexToRgb(color), hexToRgb('#efefef')) > 1.95) {
    return '#efefef';
  }
  return contrast(hexToRgb(color), hexToRgb('#efefef')) >
    contrast(hexToRgb(color), hexToRgb('#000000'))
    ? '#efefef'
    : '#000000';
}
