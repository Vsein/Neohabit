import React from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Icon from '@mdi/react';
import {
  addHours,
  subMilliseconds,
  startOfDay,
  differenceInHours,
  differenceInWeeks,
  startOfWeek,
  endOfWeek,
} from 'date-fns';
import {
  mdiMenuLeft,
  mdiMenuRight,
  mdiMenuUp,
  mdiMenuDown,
  mdiCalendarEnd,
  mdiCalendarStart,
  mdiCalendarRefresh,
  mdiPlus,
} from '@mdi/js';
import { useGetSettingsQuery } from '../state/services/settings';
import { changeTo, open } from '../state/features/projectOverlay/projectOverlaySlice';
import useLoaded from '../hooks/useLoaded';
import useDatePeriod from '../hooks/useDatePeriod';
import { OverviewMonths, OverviewDays, OverviewYear, OverviewDates } from './OverviewHeaders';
import OverviewHeatmap from './OverviewHeatmap';
import { HeatmapMonths, HeatmapWeekdays } from './HeatmapHeaders';
import ProjectControls from './ProjectComponents';
import useKeyPress from '../hooks/useKeyPress';

export default function Project({ heatmap, project }) {
  const [loaded] = useLoaded();
  const settings = useGetSettingsQuery();
  const vertical = true;

  const datePeriodLength = 365;
  const [
    dateEnd,
    setDateEnd,
    dateStart,
    setDateStart,
    { subMonth, addMonth, subYear, addYear, setToPast, setToFuture, reset },
  ] = useDatePeriod(364);

  useKeyPress(['h'], subMonth);
  useKeyPress(['l'], addMonth);

  const dispatch = useDispatch();
  const openOverlay = () => {
    dispatch(open());
    dispatch(changeTo(''));
  };
  useKeyPress(['a'], openOverlay);

  const diffWeeks = differenceInWeeks(addHours(endOfWeek(dateEnd), 1), startOfWeek(dateStart));

  return (
    <div className="overview-centering" style={{ '--projects': 7 }}>
      <div
        className={`overview-header ${datePeriodLength < 14 ? 'small' : ''}`}
        style={{ '--length': diffWeeks - 21 }}
      >
        <h3>Heatmap</h3>
        <OverviewDates
          dateStart={dateStart}
          setDateStart={setDateStart}
          dateEnd={dateEnd}
          setDateEnd={setDateEnd}
        />
        <ProjectControls project={project} heatmap={heatmap} header={true} />
      </div>
      <div
        className={`project-heatmap-container ${vertical ? 'vertical' : ''}`}
        style={{
          '--multiplier': 1,
          '--cell-height': '11px',
          '--cell-width': '11px',
          '--length': diffWeeks,
          '--weeks': diffWeeks - 1,
          '--vertical': vertical * 1,
        }}
      >
        <div className={`project-heatmap ${vertical ? 'vertical' : ''}`}>
          <OverviewYear subYear={subYear} addYear={addYear} dateStart={dateStart} />
          <HeatmapMonths dateStart={dateStart} dateEnd={dateEnd} />
          <HeatmapWeekdays dateStart={dateStart} dateEnd={dateEnd} />
          <OverviewHeatmap
            heatmap={heatmap}
            project={project}
            dateStart={dateStart}
            dateEnd={dateEnd}
            vertical={vertical}
            isOverview={false}
          />
        </div>
      </div>
    </div>
  );
}
