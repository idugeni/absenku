import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-600 p-4 mt-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} AbsenKu. All rights reserved.</p>
        <p className="text-sm">Dibuat oleh Eliyanto Sarage</p>
      </div>
    </footer>
  );
};

export default Footer;