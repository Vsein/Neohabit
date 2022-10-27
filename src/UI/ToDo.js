import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import '../styles/main.scss';
import { endOfToday, endOfWeek } from 'date-fns';
import Storage from '../modules/Storage';
import MainMenu from './MainMenu';
import Sidebar from './Sidebar';
import Editor from './Editor';
import Overlay from './Overlay';
import Task from '../modules/Task';
import Project from '../modules/Project';

export default function ToDo() {
  const [overlayContent, setOverlayContent] = useState({
    task: new Task(),
    project: new Project(),
    isNew: true,
  });
  const [overlayActive, setOverlayActive] = useState(false);

  const openOverlay = ({ isNew, task, project }) => {
    if (isNew) {
      setOverlayContent({
        task: new Task(),
        project: new Project(),
        isNew: true,
      });
      setOverlayActive(true);
    } else {
      setOverlayContent({ isNew, task, project });
      setOverlayActive(true);
    }
  };

  const closeOverlay = () => {
    setOverlayActive(false);
  };

  return (
    <div id="content">
      <MainMenu />
      <Sidebar />
      <Routes>
        <Route path=":list" element={<Editor open={openOverlay} />} />
      </Routes>
      <Overlay
        project={overlayContent.project}
        task={overlayContent.task}
        isNew={overlayContent.isNew}
        active={overlayActive}
        close={closeOverlay}
        modify={setOverlayContent}
      />
    </div>
  );
}

// static closeModal() {
//   const overlay = document.querySelector('.overlay');
//   overlay.classList.remove('overlay-active');

//   const modals = document.querySelectorAll('.modal');
//   modals.forEach((modal) => modal.classList.remove('modal-active'));

//   const listName = document.getElementById('list-name');
//   Editor.changeListTo(listName.textContent);
// }

// static initModal() {
//   document.querySelector('.overlay').addEventListener('click', UI.closeModal);
//   document
//     .querySelector('.modal')
//     .addEventListener('click', (e) => e.stopPropagation());
//   document
//     .getElementById('cancel-form-button')
//     .addEventListener('click', UI.closeModal);
//   document
//     .getElementById('submit-form-button')
//     .addEventListener('click', UI.submitTask);
//   document
//     .querySelector('.close-modal-button')
//     .addEventListener('click', UI.closeModal);
// }

// static getTask() {
//   const title = document.querySelector('.form-task-name').value;
//   const description = document.querySelector('.form-task-description').value;
//   const listName = document.querySelector('#list-name').textContent;
//   if (Storage.getToDoList().isFilter(listName)) {
//     if (listName === 'Today') {
//       return new Task(title, description, endOfToday());
//     }
//     if (listName === 'This Week') {
//       return new Task(title, description, endOfWeek(endOfToday(), { weekStartsOn: 1 }));
//     }
//     if (listName === 'Important') {
//       return new Task(title, description, '', false, true);
//     }
//   }
//   return new Task(title, description);
// }

// static submitTask(e) {
//   e.preventDefault();
//   const projectName = document.querySelector('.modal .tag p').textContent;
//   const taskName = document.querySelector('.form-task-name').textContent;
//   const task = UI.getTask();
//   if (document.querySelector('#submit-form-button').textContent === 'Save') {
//     Storage.changeTask(projectName, taskName, task);
//   } else {
//     Storage.addTask(projectName, task);
//   }
//   UI.closeModal();
// }
// }
