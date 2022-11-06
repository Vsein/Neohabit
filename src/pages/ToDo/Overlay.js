import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
import ProjectTag from './ProjectTag';
// import bin from '../icons/trash-can-outline.svg';

export default function Overlay() {
  const { taskID } = useParams();
  const { project, task } = useOutletContext();
  const navigate = useNavigate();
  const [taskName, setTaskName] = useState(task.name);
  const [taskDescription, setTaskDescription] = useState(task.description);

  useEffect(() => {
    console.log(task);
    console.log(taskID);
    setTaskName(task.name);
    setTaskDescription(task.description);
  }, [taskID]);

  const close = (e) => {
    e.stopPropagation();
    navigate('..');
  };

  return (
    <div className="overlay overlay-active" onClick={close}>
      <div className="modal modal-active" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="tag">
            <ProjectTag project={project} />
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
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />
          </label>
          <label htmlFor="task-description">
            <textarea
              className="form-task-description"
              name="task-description"
              rows="1"
              placeholder="Change description"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
            />
          </label>
        </div>
        <div className="modal-buttons">
          <button className="form-button" id="cancel-form-button" onClick={close}>
            Cancel
          </button>
          {/* <button className="form-button" id="submit-form-button" onClick={submit}> */}
          {/*   {isNew ? 'Add task' : 'Save'} */}
          {/* </button> */}
        </div>
      </div>
    </div>
  );
}
