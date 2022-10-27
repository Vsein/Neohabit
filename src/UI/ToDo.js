import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import '../styles/main.scss';
import Storage from '../modules/Storage';
import MainMenu from './MainMenu';
import Sidebar from './Sidebar';
import Editor from './Editor';
import Overlay from './Overlay';
import Task from '../modules/Task';
import Project from '../modules/Project';

export default function ToDo() {
  useEffect(() => {
    document.title = 'To-do list | Neohabit';
  });

  const [sidebarHidden, setSidebarHidden] = useState(false);
  const toggleSidebar = () => {
    setSidebarHidden(!sidebarHidden);
  };

  const [overlayContent, setOverlayContent] = useState({
    task: new Task(),
    project: new Project(),
    isNew: true,
  });
  const [overlayActive, setOverlayActive] = useState(false);
  const [currentID, setCurrentID] = useState({});

  const openOverlay = ({ isNew, task, project }) => {
    if (isNew) {
      setOverlayContent({
        task: new Task(),
        project: project || new Project(),
        isNew: true,
      });
      setOverlayActive(true);
    } else {
      setCurrentID({ taskName: task.name, projectName: project.name });
      setOverlayContent({ isNew, task, project });
      setOverlayActive(true);
    }
  };

  const closeOverlay = () => {
    setOverlayActive(false);
  };

  const submitTask = () => {
    if (overlayContent.isNew) {
      Storage.addTask(overlayContent.project.name, overlayContent.task);
    } else {
      Storage.changeTask(currentID.projectName, currentID.taskName, overlayContent.task);
    }
    closeOverlay();
  };

  return (
    <div id="content">
      <MainMenu toggleSidebar={toggleSidebar} />
      <Sidebar hidden={sidebarHidden}/>
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
        submit={submitTask}
      />
    </div>
  );
}
