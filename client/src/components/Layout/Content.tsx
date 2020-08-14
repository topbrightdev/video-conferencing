import React from 'react';

interface ContentProps {}

const Content: React.FC<ContentProps> = ({ children }) => {
    return <main className="page-content w-full h-full">{children}</main>;
};

export default Content;
