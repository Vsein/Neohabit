import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import '../styles/main.scss';
import MainMenu from '../components/MainMenu';
import Sidebar from '../components/Sidebar';
import SidebarMobile from '../components/SidebarMobile';
import Editor from '../components/Editor';
import Overlay from '../components/Overlay';
import { fetchProjects, fetchFilters } from '../api/get';

export default function ToDo() {
  useEffect(() => {
    document.title = 'To-do list | Neohabit';
  });

  const [projects, setProjects] = useState([]);
  const [filters, setFilters] = useState([]);

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

  const toggleSidebar = () => {
    setSidebarHidden(!sidebarHidden);
  };

  return (
    <div id="content">
      <MainMenu toggleSidebar={toggleSidebar} />
      <Sidebar hidden={sidebarHidden} projects={projects} filters={filters} />
      <Routes>
        <Route path=":list/:projectID" element={<Editor />} >
          <Route path="task/:taskID" element={<Overlay />} />
        </Route>
        <Route path=":list" element={<Editor />} >
          <Route path="task/:taskID" element={<Overlay />} />
        </Route>
      </Routes>
      <SidebarMobile projects={projects} filters={filters} />
    </div>
  );
}
