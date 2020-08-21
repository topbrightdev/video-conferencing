import React from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {
    title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = 'Meet X' }) => {
    return (
        <header className="h-12 bg-green-700 flex items-center px-4">
            <Link to="/" className="text-white text-xl"> {title}</Link>
        </header>
    );
};

export default Header;
