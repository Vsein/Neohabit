import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useUpdateSettingsMutation } from '../state/services/settings';
import { useGetHabitsQuery } from '../state/services/habit';
import { HabitModalWrapper } from './Habit';

const Slides = [
  ...(window.APP_CONFIG.DEMO
    ? [
        {
          content: (
            <>
              <h3>This is a demo!</h3>
              <p>
                Changes will reset after you reload this page, and this banner will appear again.
                <br />
                <br />
                Click &quot;Next&quot; if you&apos;re not familiar with Neohabit&apos;s interface,
                or simply press &quot;Skip all&quot;. If you have no idea what this project is,
                check the{' '}
                <NavLink className="inline-link" to="/" target="_blank">
                  landing
                </NavLink>
                .
              </p>
            </>
          ),
          tag: 'demo',
        },
      ]
    : []),
  {
    content: (
      <>
        <h3>Before you start, I prepared a small UI introduction for you</h3>
        <p>
          If you click on one of the glowing arrows, you&apos;ll see how the other arrow changes
          color - it&apos;s an indicator of where you are relative to the current date.
          <br />
          <br />
          Also notice how {new Date().toLocaleDateString('en-US', { weekday: 'long' })} and{' '}
          {new Date().toLocaleDateString('en-US', { month: 'long' })} are highlighted.
        </p>
      </>
    ),
    tag: 'date-indicators',
  },
  {
    content: (
      <>
        <h3>Date pickers</h3>
        <p>
          Apart from the usual functionality, I added buttons in the datepicker dropdown to reset
          the date period relative to the current day, it&apos;ll be easier to see for yourself.
        </p>
      </>
    ),
    tag: 'date-pickers',
  },
  {
    content: (
      <>
        <h3>First completed action</h3>
        <p>
          I enabled the checkbox button for you. With it, you would check off habits that you
          completed today. Try clicking it.
        </p>
      </>
    ),
    tag: 'habit-datum',
  },
  {
    content: (
      <>
        <h3>Completing actions in bulk</h3>
        <p>
          This button is similar to the previous one, except it allows you to set the date and the
          number of completed actions.
        </p>
      </>
    ),
    tag: 'habit-data',
  },
  {
    content: (
      <>
        <h3>The target-setting button</h3>
        <p>
          This button is how you set goals, and plan out how you want to increase the habit
          frequency in the future. Three days is a good starting point for most habits.
        </p>
      </>
    ),
    tag: 'habit-targets',
  },
  {
    content: (
      <>
        <h3>Good luck!</h3>
        <p>
          The last three buttons allow you to open the stopwatch, edit the habit, and delete it. Of
          the three, editing the habit is the most interesting, so let&apos;s try that next!
        </p>
      </>
    ),
    tag: 'final',
  },
];

export default function Onboarding() {
  const [updateSettings] = useUpdateSettingsMutation();
  const habits = useGetHabitsQuery();
  const [slide, setSlide] = useState(1);
  const slidesInTotal = Slides.length;
  const skip = () => {
    updateSettings({ values: { hide_onboarding: true } });
  };

  if (habits.isLoading) return <></>;

  return (
    <div className="overlay overlay-active centering">
      <div className="modal modal-active modal-onboarding">
        <div className="modal-header" style={{ gridTemplateColumns: 'min-content' }}>
          <div className="tag">Introduction</div>
        </div>
        {Slides[slide - 1].content}
        <div className="contentlist end">
          {habits.data[0] ? (
            <HabitModalWrapper
              habit={habits.data[0]}
              onboardingSlideTag={Slides[slide - 1].tag}
              modal={true}
            />
          ) : (
            <></>
          )}
        </div>
        <div className="modal-buttons" style={{ width: '100%' }}>
          <button
            className="button-default stretch chameleon nowrap onboarding"
            onClick={skip}
            style={{ width: 'min-content' }}
          >
            Skip all
          </button>
          <div className="modal-buttons" style={{ width: 'min-content', alignItems: 'center' }}>
            <div className="centering right" style={{ width: '40px' }}>
              <h3>{`${slide}/${slidesInTotal}`} </h3>
            </div>
            <button
              type="button"
              className={`button-default stretch ${slide > 1 ? '' : 'cancel'} onboarding`}
              onClick={() => slide > 1 && setSlide(slide - 1)}
            >
              Previous
            </button>
            <button
              type="button"
              className={`button-default stretch border onboarding ${slide === slidesInTotal ? 'muted' : ''}`}
              onClick={() => (slide === slidesInTotal ? skip() : setSlide(slide + 1))}
            >
              {slide === slidesInTotal ? 'Complete' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
