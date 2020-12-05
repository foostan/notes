import React from 'react';

type Props = {
  iconURL: string
};

const About = ({ iconURL }: Props) => {
  return (
    <div className="about">
      <div className="profile">
        <img src={`${iconURL}`} width="105px" height="105px" alt="icon" />
        <aside>
          <p>
            foostan<br />
          </p>
          <ul>
            <li><a href="https://twitter.com/foostan">Twitter</a></li>
            <li><a href="https://github.com/foostan">GitHub</a></li>
          </ul>
        </aside>
      </div>
    </div>
  );
};

export default About;
