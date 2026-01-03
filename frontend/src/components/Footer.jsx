import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between text-sm">
        
        {/* Left */}
        <p className="text-center md:text-left">
          © {new Date().getFullYear()} All rights reserved.
        </p>

        {/* Right */}
        <p className="mt-2 md:mt-0 text-center md:text-right">
          Developed by{" "}
          <a
            href="https://www.thinksync.solutions"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
          >
            ThinkSync Solutions
          </a>
        </p>

      </div>
    </footer>
  );
};

export default Footer;
