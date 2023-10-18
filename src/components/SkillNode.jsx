import React from 'react';
import { useDispatch } from 'react-redux';
import {
  differenceInHours,
  isSameWeek,
  differenceInCalendarWeeks,
  startOfWeek,
  endOfWeek,
  addMilliseconds,
  getTime,
} from 'date-fns';
import { hideTip, changeCellOffset, fixateCellTip } from './CellTip';
import { changeCellPeriodTo } from '../state/features/cellTip/cellTipSlice';
import { mixColors, hexToRgb, getNumericTextColor } from '../hooks/usePaletteGenerator';

export default function SkillNode({ skill, color }) {
  return (
    <div className="skill-node" style={{'--shadow-box-color': color}}>
      <h3>{skill.name}</h3>
    </div>
  );
}
