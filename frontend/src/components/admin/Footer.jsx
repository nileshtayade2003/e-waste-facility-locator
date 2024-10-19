// Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="main-footer" style={{position:'fixed', bottom:'0',left:'0',right:'0'}}>
      <div className="float-right d-none d-sm-inline">
        Anything you want
      </div>
      <strong>
        Copyright &copy; 2024 <a target='_blank'className='text-blue' href="https://www.linkedin.com/in/nilesh-tayade-541205244/">Nilesh Tayade</a>.
      </strong> All rights reserved.
    </footer>
  );
};

export default Footer;
