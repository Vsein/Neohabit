import React from 'react';

export default function HabitTag(props) {
  const { habit } = props;
  return (
    <>
      <div className="centering">
        <div className="habit-circle" style={{ backgroundColor: habit.color }}></div>
      </div>
      <p>{habit.name}</p>
    </>
  );
}
