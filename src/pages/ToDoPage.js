import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import '../styles/main.scss';
import Storage from '../modules/Storage';
import MainMenu from '../components/MainMenu';
import Sidebar from '../components/Sidebar';
import SidebarMobile from '../components/SidebarMobile';
import Editor from '../components/Editor';
import Overlay from '../components/Overlay';
import Task from '../modules/Task';
import Project from '../modules/Project';
import { fetchProjects, fetchFilters } from '../api/get';

export default function ToDo() {
  useEffect(() => {
    document.title = 'To-do list | Neohabit';
  });

  const [projects, setProjects] = useState([]);
  const [filters, setFilters] = useState([]);
  const [id, setId] = useState('');

  useEffect(() => {
    async function init() {
      const [projectsFetched, filtersFetched] = await Promise.all([
        fetchProjects(),
        fetchFilters(),
      ]);

      setProjects(projectsFetched);
      setFilters(filtersFetched);
    }
    init();
  }, []);

  const [sidebarHidden, setSidebarHidden] = useState(false);
  const [overlayContent, setOverlayContent] = useState({
    task: new Task(),
    project: new Project(),
    isNew: true,
  });
  const [overlayActive, setOverlayActive] = useState(false);
  const [currentID, setCurrentID] = useState({});

  const toggleSidebar = () => {
    setSidebarHidden(!sidebarHidden);
  };

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
      <Sidebar hidden={sidebarHidden} projects={projects} filters={filters} setId={setId}/>
      <Routes>
        <Route path=":list/:id" element={<Editor open={openOverlay} />} />
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
      <SidebarMobile projects={projects} filters={filters} />
    </div>
  );
}
