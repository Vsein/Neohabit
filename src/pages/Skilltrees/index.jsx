import React from 'react';
import SkilltreeList from '../../components/SkilltreeList';
import useTitle from '../../hooks/useTitle';

export default function SkillsPage() {
  useTitle('Skilltrees | Neohabit');

  return (
    <SkilltreeList />
  );
}
