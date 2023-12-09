import React from 'react';
import Projectlist from '../components/Projectlist';
import useTitle from '../hooks/useTitle';

export default function ProjectsPage() {
  useTitle('Projects | Neohabit');

  return (
    <Projectlist />
  );
}
