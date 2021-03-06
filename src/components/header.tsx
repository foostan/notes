import React from 'react';

type Props = {
  title: string
};

const Header = ({ title }: Props) => {
  return (
    <div className="header">
      <nav className="navbar" role="navigation">
        <div className="navbar-menu">
          <a href="https://www.google.com/search?q=site:fstn.dev">Search</a>
          <a href="/archive">Archive</a>
          <a href="/feed.xml">Feed</a>
        </div>
      </nav>
      <h1><a href="/">{title}</a></h1>
    </div>
  );
};

export default Header;
