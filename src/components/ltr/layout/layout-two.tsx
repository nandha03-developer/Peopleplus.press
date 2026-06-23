import React, { ReactNode } from 'react';
import Footertwo from './footer-two';
import Header from './header';
import Footer from './footer';

type LayoutTwoProps = {
  children: ReactNode;
};

const LayoutTwo: React.FC<LayoutTwoProps> = ({ children }) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};

export default LayoutTwo;
