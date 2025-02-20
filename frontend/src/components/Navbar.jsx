import React, { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <a href="/" className="navbar-brand">
                    Video App
                </a>

                <div className="hamburger" onClick={toggleMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                <ul className={`navbar-menu ${isMenuOpen ? 'open' : ''}`}>
                    <li className="navbar-item">
                        <a href="/upload" className="navbar-link">
                            Upload
                        </a>
                    </li>
                    <li className="navbar-item">
                        <a href="/view" className="navbar-link">
                            View Videos
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
