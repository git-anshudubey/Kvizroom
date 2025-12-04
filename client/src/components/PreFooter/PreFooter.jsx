import React from 'react';
import './PreFooter.css';
import { Link } from 'react-router-dom';
import formIcon from '../../assets/Muhafiz_icon_02.png';
import dashIcon from '../../assets/Muhafiz_icon_01.png';



const PreFooter = () => {
  return (
    <div className="prefooter-wrapper">
      <section className="get-started">
        <h2>Ready to Experience Smart Proctoring?</h2>
        <a href="/login" className="btn green-btn">Get Started</a>
      </section>

      <section className="integration-section">
        <div className="integration-content">
          <div className="integration-left">
            <img src={formIcon} alt="Forms" className="integration-icon" />
            <p className="integration-line">
              <span className="subtext">Effortlessly integrates with </span>
              <strong>Google Forms or Microsoft Surveys</strong>
            </p>
          </div>

          <div className="integration-right">
            <img src={dashIcon} alt="Dashboard" className="integration-icon" />
            <p className="integration-line">
              <span className="subtext">The best part? </span>
              <strong>Live Status on Admin Dashboard</strong>
            </p>
          </div>
        </div>

        <div className="integration-cta">
          <p>And it’s <strong>free.</strong><br /><strong>What are you waiting for?</strong></p>
          <Link to="/create-test" className="btn shared-btn">Create Test</Link>
          <Link to="/admin" className="btn shared-btn">Admin Dashboard</Link>
        </div>
      </section>
    </div>
  );
};

export default PreFooter;