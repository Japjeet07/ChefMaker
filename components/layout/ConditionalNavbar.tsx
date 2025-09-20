'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import HomepageNavbar from './HomepageNavbar';
import VerticalNavbar from './VerticalNavbar';

const ConditionalNavbar: React.FC = () => {
  const pathname = usePathname();
  const isHomepage = pathname === '/';

  return (
    <>
      {isHomepage ? (
        <HomepageNavbar />
      ) : (
        <VerticalNavbar />
      )}
    </>
  );
};

export default ConditionalNavbar;
