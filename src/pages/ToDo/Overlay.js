import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
import ProjectTag from './ProjectTag';
import { fetchTaskByID } from '../../api/get';
// import bin from '../icons/trash-can-outline.svg';

export default function Overlay() {
  const { taskID } = useParams();
  const [task, setTask] = useState();
  const navigate = useNavigate();
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const defaultProject = { color: '#8a8a8a', name: '' };

  useEffect(() => {
    async function init() {
      const taskRes = await fetchTaskByID(taskID);
      setTask(taskRes);
      setTaskName(taskRes.name);
      setTaskDescription(taskRes.description);
    }
    init();
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
            <ProjectTag project={task ? task.project : defaultProject} />
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
