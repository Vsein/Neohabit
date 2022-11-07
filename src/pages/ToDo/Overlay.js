import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
import ProjectTag from './ProjectTag';
import { fetchProject, fetchProjectByID, fetchTaskByID } from '../../api/get';
import { updateTask, createTask } from '../../api/post';
// import bin from '../icons/trash-can-outline.svg';

export default function Overlay() {
  const { taskID } = useParams();
  const [task, setTask] = useState();
  const navigate = useNavigate();
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [project, setProject] = useState({ name: 'Default', color: '#8a8a8a' });
  const location = useLocation();

  useEffect(() => {
    async function init() {
      if (taskID === 'new') {
        let url = location.pathname.split('/');
        if (!url[url.length - 1]) url.pop();
        if (url[url.length - 4] === 'project') {
          const projectFetched = await fetchProjectByID(url[url.length - 3]);
          setProject(projectFetched);
        } else {
          const projectFetched = await fetchProject({ is_default: true });
          setProject(projectFetched);
        }
        return;
      }
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

  const createNewTask = () => {
    const formData = new FormData();
    formData.append('name', taskName);
    formData.append('description', taskDescription);
    formData.append('projectID', project._id);
    createTask(formData);
    navigate('..');
  };

  const updateThisTask = () => {
    const formData = new FormData();
    formData.append('name', taskName);
    formData.append('description', taskDescription);
    formData.append('projectID', task.project._id);
    updateTask(taskID, formData);
    navigate('..');
  };

  return (
    <div className="overlay overlay-active" onClick={close}>
      <div className="modal modal-active" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="tag">
            <ProjectTag project={task ? task.project : project} />
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
          {
            task ? (
              <button className="form-button" id="submit-form-button" onClick={updateThisTask}>
                Save
              </button>
            ) : (
              <button className="form-button" id="submit-form-button" onClick={createNewTask}>
                Add task
              </button>
            )
          }
        </div>
      </div>
    </div>
  );
}
