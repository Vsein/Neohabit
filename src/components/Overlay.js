import React from 'react';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
// import bin from '../icons/trash-can-outline.svg';

export default function Overlay(props) {
  const { project, task, isNew, active, close, modify, submit } = props;

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
    <div className={`overlay ${active ? 'overlay-active' : ''}`} onClick={close}>
      <div className={`modal ${active ? 'modal-active' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="tag">
            <div className="centering">
              <div
                className="project-circle"
                style={{ backgroundColor: project.color }}
              ></div>
            </div>
            {project.name === 'Neohabit' ? (
              <p className="neohabit" />
            ) : (
              <p>{project.name}</p>
            )}
          </div>
          <button className="close-modal-button icon" onClick={close}>
            <Icon path={mdiClose} />
          </button>
        </div>
        <div className="modal-details">
          <label htmlFor="task-name">
            <textarea
              className="form-task-name"
              name="task-name"
              rows="1"
              placeholder="Change task name"
              value={task.name}
              onChange={handleNameChange}
            />
          </label>
          <label htmlFor="task-description">
            <textarea
              className="form-task-description"
              name="task-description"
              rows="1"
              placeholder="Change description"
              value={task.description}
              onChange={handleDescriptionChange}
            />
          </label>
        </div>
        <div className="modal-buttons">
          <button className="form-button" id="cancel-form-button" onClick={close}>
            Cancel
          </button>
          <button className="form-button" id="submit-form-button" onClick={submit}>
            {isNew ? 'Add task' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
