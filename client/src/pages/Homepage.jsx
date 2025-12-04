import React, { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import { Link } from 'react-router-dom';

import Navbar from '../components/Navbar/Navbar';
import Hero from '../components/Hero/Hero';
import Features from '../components/Features/Features';
import PreFooter from '../components/PreFooter/PreFooter';
import Footer from '../components/Footer/Footer';


const Homepage = () => {
  useEffect(() => {
    const lenis = new Lenis();
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => {
      lenis.destroy();
    };
  }, []);
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <PreFooter />
      <Footer />
    </>
  );
};

export default Homepage;
