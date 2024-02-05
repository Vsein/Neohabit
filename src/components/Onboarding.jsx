import React, { useState } from 'react';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { useUpdateSettingsMutation } from '../state/services/settings';
import { useGetHeatmapsQuery } from '../state/wrappers/heatmap';
import { useGetHabitsQuery } from '../state/wrappers/habit';
import useDefaultProject from '../hooks/useDefaultProject';
import { HabitModalWrapper } from './Habit';

export default function Onboarding() {
  const [updateSettings] = useUpdateSettingsMutation();
  const habits = useGetHabitsQuery();
  const heatmaps = useGetHeatmapsQuery();
  const [slide, setSlide] = useState(1);
  const skip = () => {
    updateSettings({ values: { hide_onboarding: true } });
  };

  const { width } = useWindowDimensions();
  const mobile = width < 850;

  const [defaultProject] = useDefaultProject();

  if (habits.isLoading || heatmaps.isLoading) return <></>;

  return (
    <div className="overlay overlay-active centering">
      <div className={`modal modal-active modal-onboarding ${mobile ? 'modal-mobile' : ''}`}>
        <div className="modal-header" style={{ gridTemplateColumns: 'min-content' }}>
          <div className="tag">Introduction</div>
        </div>
        <Slides slide={slide} />
        <div className="contentlist">
          {defaultProject.habits[0] ? (
            <HabitModalWrapper
              heatmap={heatmaps.data.find(
                (heatmapo) => heatmapo.habit._id === defaultProject.habits[0]._id,
              )}
              habit={defaultProject.habits[0]}
              onboardingSlide={slide}
              modal={true}
            />
          ) : (
            <></>
          )}
        </div>
        <div className="modal-buttons right" style={{ width: 'min-content', alignItems: 'center' }}>
          <div className="centering" style={{ width: '40px' }}>
            <h3>{`${slide}/5`} </h3>
          </div>
          <button
            type="button"
            className="button-default stretch cancel onboarding"
            onClick={() => slide > 1 && setSlide(slide - 1)}
            title="Cancel [c]"
          >
            Previous
          </button>
          <button
            className="button-default stretch border onboarding"
            type="button"
            onClick={() => slide <= 5 && (slide === 5 ? skip() : setSlide(slide + 1))}
          >
            {slide === 5 ? 'Complete' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Slides({ slide }) {
  return (
    <>
      {slide === 1 && (
        <>
          <h3>Before you start, we&apos;d like you to get to know our interface!</h3>
          <p>
            We prepared a test habit for you to play around with. Try playing around with the dates,
            set the start date, the date end, try resetting it from the dropdown.
          </p>
        </>
      )}
      {slide === 2 && (
        <>
          <h3>First completed action</h3>
          <p>
            We have enabled one button for you. With it, you would check off habits that you
            completed today. Try clicking it.
          </p>
        </>
      )}
      {slide === 3 && (
        <>
          <h3>Completing actions in bulk</h3>
          <p>
            This button is similar to the previous one, except it allows you to set the date and the
            number of completed actions.
          </p>
        </>
      )}
      {slide === 4 && (
        <>
          <h3>The goal-setting button</h3>
          <p>
            This button is how you set goals, and maybe even plan how you want to increase the habit
            frequency in the future. Three days is a good starting point for most habits.
          </p>
        </>
      )}
      {slide === 5 && (
        <>
          <h3>Good luck!</h3>
          <p>
            The last three buttons allow you to set the pomodoro timer, edit the habit, and delete
            it. There are more things you&apos;ll figure out, but what you just learned will do!
          </p>
        </>
      )}
    </>
  );
}
