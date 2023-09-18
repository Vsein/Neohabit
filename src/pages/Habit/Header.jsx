import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useGetHabitsQuery, useDeleteHabitMutation } from '../../state/services/habit';
import { changeTo, open } from '../../state/features/habitOverlay/habitOverlaySlice';

export default function Header() {
  const { habitID } = useParams();
  const habit =
    useGetHabitsQuery().data.find((habito) => habito._id == habitID) ??
    useGetHabitsQuery().data.find((habito) => habito.name == 'Default');
  const [deleteHabit] = useDeleteHabitMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const deleteThisHabit = (e) => {
    deleteHabit(habitID);
    navigate('...');
    navigate('/dashboard');
  };

  return (
    <div className="habitpage-header">
      <Link
        onClick={() => {
          dispatch(changeTo(habitID));
          dispatch(open());
        }}
      >
        <Skill color={habit.color} name={habit.name} />
      </Link>
      <div className="welcome">
        <p className="hello">Hello there,</p>
        <p className="username">Serene Coder (&#64;Vsein)</p>
      </div>
      <button className="dashboard-btn" id="new" onClick={deleteThisHabit}>
        Delete
      </button>
      <button className="dashboard-btn" id="upload">
        Upload
      </button>
      <button className="dashboard-btn" id="share-variant-outline">
        Share
      </button>
    </div>
  );
}

function Skill(props) {
  const { color, name } = props;
  return (
    <button className="skill-icon" style={{ backgroundColor: color }}>
      {name}
    </button>
  );
}
