import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Icon } from '@mdi/react';
import { mdiMenuLeft, mdiMenuRight, mdiMenuUp, mdiMenuDown, mdiPencil, mdiDelete } from '@mdi/js';
import { differenceInDays, compareDesc, endOfDay } from 'date-fns';
import { useGetHabitsQuery } from '../state/services/habit';
import { useGetHeatmapsQuery } from '../state/services/heatmap';
import { changeTo } from '../state/features/overlay/overlaySlice';
import useDatePeriod from '../hooks/useDatePeriod';
import { HeatmapMonthsDaily, HeatmapDays } from './HeatmapDateAxes';
import { OverviewTopbarRight } from './DatePickers';
import { HabitOverview, HabitAddButton, ReturnButton } from './HabitComponents';
import { generateShades } from '../hooks/usePaletteGenerator';
import heatmapSort from '../utils/heatmapSort';

export default function Project({
  project,
  datePeriodLength,
  mobile,
  addPeriod,
  subPeriod,
  singular = false,
  globalDateStart = null,
  globalDateEnd = null,
  modal = false,
  onboardingSlide = 0,
}) {
  const heatmaps = useGetHeatmapsQuery();
  const habits = useGetHabitsQuery();
  const vertical = false;

  const { colorShade, calmColorShade, textColor, calmTextColor } = generateShades(project.color);

  if (heatmaps.isFetching || habits.isFetching) return <></>;

  const Habits =
    project.habits &&
    project.habits.flatMap((habito, i) => {
      // check if the habit ID was listed, not the habit itself
      const habit = habito?._id ? habito : habits.data.find((habitoo) => habitoo._id === habito);
      const heatmap = habit?._id
        ? heatmaps.data.find((heatmapo) => heatmapo.habit._id === habit._id)
        : heatmaps.data.find((heatmapo) => heatmapo.habit._id === habit);
      const dataSorted = heatmapSort(heatmap?.data, globalDateEnd);

      return (new Date(dataSorted[0].date).getTime() === endOfDay(globalDateEnd).getTime() &&
        dataSorted.length !== 1) ||
        (dataSorted.length > 2 &&
          dataSorted[dataSorted.length - 2].is_archive &&
          new Date(dataSorted[dataSorted.length - 2].date).getTime() < globalDateStart.getTime()) ? (
        []
      ) : (
        <HabitOverview
          key={i}
          habit={habit}
          dateStart={globalDateStart}
          dateEnd={globalDateEnd}
          heatmapData={dataSorted}
          heatmapID={heatmap?._id}
          vertical={vertical}
          mobile={mobile}
          projectID={project._id}
        />
      );
    });

  const HeaderName = () =>
    singular ? (
      <h3 style={{ color: colorShade, textAlign: 'center' }}>{project?.name}</h3>
    ) : (
      <NavLink to={`../project/${project?._id}`} title={project.name}>
        <h3 style={{ color: colorShade, textAlign: 'center' }}>{project?.name}</h3>
      </NavLink>
    );

  return (
    <div
      className={`overview-centering ${mobile ? 'mobile' : ''} slide-${onboardingSlide}`}
      style={{
        '--habits': Habits.length,
        '--length': differenceInDays(globalDateEnd, globalDateStart) + 1,
        '--vertical': vertical * 1,
        // '--multiplier': settings.data.cell_height_multiplier,
        '--multiplier': 1,
        '--cell-height': '15px',
        '--cell-width': '15px',
        '--datepicker-text-color': textColor,
        '--datepicker-calm-text-color': calmTextColor,
        [project.color !== '#8a8a8a' ? '--signature-color' : '']: colorShade,
        [project.color !== '#8a8a8a' ? '--bright-signature-color' : '']: colorShade,
        [project.color !== '#8a8a8a' ? '--calm-signature-color' : '']: `${colorShade}55`,
      }}
    >
        <div
          className={`overview-header ${vertical ? 'vertical' : ''} ${mobile ? 'small' : ''} ${singular ? 'singular' : ''}`}
        >
          {mobile ? (
            <HeaderName />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 20px', gridArea: 'name' }}>
              <HeaderName />
              <button
                className="centering right overview-date-button"
                onClick={subPeriod}
                title="Previous period [H]"
                style={{ transform: 'translateX(-4px)' }}
              >
                <Icon path={vertical ? mdiMenuUp : mdiMenuLeft} className="icon" />
              </button>
            </div>
          )}
          {!mobile && (
            <>
              <HeatmapMonthsDaily dateStart={globalDateStart} dateEnd={globalDateEnd} />
              <HeatmapDays dateStart={globalDateStart} dateEnd={globalDateEnd} />
            </>
          )}
          <ProjectControls projectID={project?._id} mobile={mobile} addPeriod={addPeriod} />
        </div>
        <div
          className={`overview-container ${vertical ? 'vertical' : ''} ${mobile ? 'mobile' : ''}`}
        >
          <div className={`overview ${vertical ? 'vertical' : ''} ${mobile ? 'mobile' : ''}`}>
            {mobile && (
              <>
                <div className="overview-topbar-left">
                  {/* {!vertical && ( */}
                  {/*   <YearPicker subYear={subYear} addYear={addYear} dateStart={dateStart} /> */}
                  {/* )} */}
                  <button
                    className="centering right overview-date-button"
                    onClick={subPeriod}
                    title="Previous period [H]"
                  >
                    <Icon path={vertical ? mdiMenuUp : mdiMenuLeft} className="icon" />
                  </button>
                </div>
                <HeatmapMonthsDaily dateStart={globalDateStart} dateEnd={globalDateEnd} />
                <HeatmapDays dateStart={globalDateStart} dateEnd={globalDateEnd} />
                <OverviewTopbarRight
                  vertical={vertical}
                  dateStart={globalDateStart}
                  // {/* subYear={subYear} */}
                  // {/* addYear={addYear} */}
                  addMonth={addPeriod}
                />
              </>
            )}
            <div className="overview-habits">
              {Habits.length === 0 && <h5 className="overview-no-habits">No habits?</h5>}
              {Habits}
            </div>
            {vertical && (
              <button
                className="overview-period-move-down"
                onClick={addPeriod}
                title="Next period [L]"
              >
                <Icon path={mdiMenuDown} className="icon" />
              </button>
            )}
          </div>
        </div>
      </div>
  );
}

function ProjectControls({ projectID, mobile, addPeriod }) {
  const dispatch = useDispatch();

  return (
    <div className="overview-settings" style={{ [mobile ? 'width' : '']: '102px' }}>
      {!mobile && (
        <button
          className="centering left overview-date-button"
          onClick={addPeriod}
          title="Next period [L]"
          style={{ transform: 'translateX(-6px)' }}
        >
          <Icon path={mdiMenuRight} className="icon" />
        </button>
      )}
      <HabitAddButton projectID={projectID} standalone={projectID === 'default'} />
      {projectID !== 'default' && (
        <>
          <button
            className="overview-open-settings active"
            onClick={() => dispatch(changeTo({ projectID, type: 'project' }))}
            title="Edit the project"
          >
            <Icon path={mdiPencil} className="icon small centering" />
          </button>
          <button
            className="overview-open-settings active"
            onClick={() => dispatch(changeTo({ projectID, type: 'deleteProject' }))}
            title="Delete the project"
          >
            <Icon path={mdiDelete} className="icon small centering" />
          </button>
        </>
      )}
    </div>
  );
}

function ProjectWrapper({
  project,
  datePeriodLength,
  mobile,
  globalDateStart = null,
  globalDateEnd = null,
}) {
  const [dateEnd, setDateEnd, dateStart, setDateStart, { subPeriod, addPeriod }] =
    useDatePeriod(datePeriodLength);

  useEffect(() => {
    if (globalDateStart && globalDateEnd) {
      setDateStart(globalDateStart);
      setDateEnd(globalDateEnd);
    }
  }, [globalDateStart, globalDateEnd]);

  return (
    <Project
      project={project}
      datePeriodLength={datePeriodLength}
      mobile={mobile}
      globalDateStart={dateStart}
      globalDateEnd={dateEnd}
      subPeriod={subPeriod}
      addPeriod={addPeriod}
    />
  );
}

export { ProjectWrapper };
