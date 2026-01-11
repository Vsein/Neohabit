import React from 'react';
import { useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Icon } from '@mdi/react';
import { mdiMenuDown, mdiPencil, mdiDelete } from '@mdi/js';
import { differenceInDays } from 'date-fns';
import { useUpdateSettingsMutation } from '../state/services/settings';
import { useUpdateProjectMutation } from '../state/services/project';
import { changeTo } from '../state/features/overlay/overlaySlice';
import useDatePeriod from '../hooks/useDatePeriod';
import { HeatmapMonthsDaily, HeatmapDays } from './HeatmapDateAxes';
import { OverviewTopbarRight, NextPeriodButton, PreviousPeriodButton } from './DatePickers';
import { HabitOverview, HabitAddButton } from './HabitComponents';
import { generateShades } from '../hooks/usePaletteGenerator';

export default function Project({
  project,
  mobile,
  addPeriod,
  subPeriod,
  singular = false,
  globalDateStart = null,
  globalDateEnd = null,
  isPastPeriod = false,
  isFuturePeriod = false,
  dragHabitToProject,
}) {
  const vertical = false;

  const [updateSettings] = useUpdateSettingsMutation();
  const [updateProject] = useUpdateProjectMutation();

  const { colorShade, calmColorShade, textColor, calmTextColor } = generateShades(project.color);

  const dragHabitInProject = async (projectID, draggedHabitID, targetHabitID, insertAfter) => {
    const projecto = structuredClone(project);
    if (projecto && projectID === projecto.id && projecto.habits) {
      const draggedHabitPosition = projecto.habits.findIndex(
        (habit) => habit === draggedHabitID,
      );
      projecto.habits.splice(draggedHabitPosition, 1);
      const position = projecto.habits.findIndex((habit) => habit === targetHabitID);
      projecto.habits.splice(position + insertAfter, 0, draggedHabitID);
      await updateProject({ projectID, values: { habits: projecto.habits } });
    }
  };

  const Habits =
    project.habits &&
    project.habits.flatMap((habit, i) =>
      // TODO: First habit target check, check if the interval is archived
      differenceInDays(habit.created_at, globalDateStart) < 0 ?
        [] :
        (
          <HabitOverview
            key={i}
            habit={habit}
            dateStart={globalDateStart}
            dateEnd={globalDateEnd}
            heatmapData={habit.data}
            vertical={vertical}
            mobile={mobile}
            projectID={project.id}
            dragHabitInProject={dragHabitInProject}
            dragHabitToProject={dragHabitToProject}
          />
        )
    );

  const allowDrop = (e) => {
    e.preventDefault();
  }

  const drag = (e) => {
    e.dataTransfer.setData("text", e.target.id);
  }

  const HeaderName = () =>
    singular ? (
      <h3 style={{ color: colorShade, textAlign: 'center' }}>{project?.name}</h3>
    ) : (
      <NavLink to={`../project/${project?.id}`} title={project.name}>
        <h3 style={{ color: colorShade, textAlign: 'center' }}>{project?.name}</h3>
      </NavLink>
    );

  const drop = (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("text");
    const draggedProject = document.getElementById(data);

    if (!draggedProject || !draggedProject.classList.contains('overview-centering')) {
      return;
    };

    const projectsContainer = draggedProject.parentNode;
    const target = e.target.closest('.overview-centering')

    if (target.offsetTop < draggedProject.offsetTop) {
      projectsContainer.insertBefore(draggedProject, target);
    } else {
      const dropTo = target.nextSibling;
      projectsContainer.insertBefore(draggedProject, dropTo);
    }

    const ids = [...document.querySelectorAll('.contentlist > .overview-centering')].map(({ id }) => id);
    updateSettings({ values: { projects_order: ids, projects_enable_order: true } })
  }

  return (
    <div
      className={`overview-centering ${mobile ? 'mobile' : ''}`}
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
      onDrop={drop}
      onDragOver={allowDrop} draggable onDragStart={drag}
      id={project?.id}
    >
      <div
        className={`overview-header ${vertical ? 'vertical' : ''} ${mobile ? 'small' : ''} ${singular ? 'singular' : ''}`}
      >
        {mobile ? (
          <HeaderName />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 20px', gridArea: 'name' }}>
            <HeaderName />
            <PreviousPeriodButton onClick={subPeriod} alignRight vertical={vertical} style={{ transform: 'translateX(-4px)' }} isFuturePeriod={isFuturePeriod} />
          </div>
        )}
        {!mobile && (
          <>
            <HeatmapMonthsDaily dateStart={globalDateStart} dateEnd={globalDateEnd} />
            <HeatmapDays dateStart={globalDateStart} dateEnd={globalDateEnd} />
          </>
        )}
        <ProjectControls projectID={project?.id} mobile={mobile} addPeriod={addPeriod} isPastPeriod={isPastPeriod} />
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
                <PreviousPeriodButton onClick={subPeriod} alignRight vertical={vertical} isFuturePeriod={isFuturePeriod} />
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
            {Habits.length === 0 && <h5 className="overview-no-habits">No habits</h5>}
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

function ProjectControls({ projectID, mobile, addPeriod, isPastPeriod }) {
  const dispatch = useDispatch();

  return (
    <div className="overview-settings" style={{ [mobile ? 'width' : '']: '102px' }}>
      {!mobile && (
        <NextPeriodButton onClick={addPeriod} alignLeft style={{ transform: 'translateX(-6px)' }} isPastPeriod={isPastPeriod} />
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
  dragHabitToProject,
}) {
  const [dateEnd, setDateEnd, dateStart, setDateStart, { subPeriod, addPeriod, isPastPeriod, isFuturePeriod }] =
    useDatePeriod(datePeriodLength);

  return (
    <Project
      project={project}
      datePeriodLength={datePeriodLength}
      mobile={mobile}
      globalDateStart={dateStart}
      globalDateEnd={dateEnd}
      subPeriod={subPeriod}
      addPeriod={addPeriod}
      isPastPeriod={isPastPeriod}
      isFuturePeriod={isFuturePeriod}
      dragHabitToProject={dragHabitToProject}
    />
  );
}

export { ProjectWrapper };
