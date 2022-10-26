import React from 'react';
import plus from '../icons/plus.svg';
// import bin from '../icons/trash-can-outline.svg';

export default function Overlay(props) {
  const { project, task, isNew, active, close, modify } = props;

  const handleNameChange = (e) => {
    modify((prevState) => {
      const tmp = { ...prevState };
      tmp.task.name = e.target.value;
      return tmp;
    });
  };

  const handleDescriptionChange = (e) => {
    modify((prevState) => {
      const tmp = { ...prevState };
      tmp.task.description = e.target.value;
      return tmp;
    });
  };

  return (
    <div className={`overlay ${active ? 'overlay-active' : ''}`}>
      <div className={`modal ${active ? 'modal-active' : ''}`}>
        <div className="modal-header">
          <div className="tag">
            <div className="centering">
              <div
                className="project-circle"
                style={{ backgroundColor: project.color }}
              ></div>
            </div>
            {project.name === 'Neohabit' ? (
              <div className="neohabit" />
            ) : (
              <p>{project.name}</p>
            )}
          </div>
          <div className="close-modal-button icon" onClick={close}>
            <img src={plus} />
          </div>
        </div>
        <div className="modal-details">
          <div>
            <label htmlFor="task-name"></label>
            <textarea
              className="form-task-name"
              name="task-name"
              rows="1"
              placeholder="Change task name"
              value={task.name}
              onChange={handleNameChange}
            />
          </div>
          <div>
            <label htmlFor="task-description"></label>
            <textarea
              className="form-task-description"
              name="task-description"
              rows="1"
              placeholder="Change description"
              value={task.description}
              onChange={handleDescriptionChange}
            />
          </div>
        </div>
        <div className="modal-buttons">
          <button className="form-button" id="cancel-form-button" onClick={close}>
            Cancel
          </button>
          <button className="form-button" id="submit-form-button">
            {isNew ? 'Add task' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
