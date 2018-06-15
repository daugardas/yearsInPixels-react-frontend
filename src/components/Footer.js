import React, { Component } from 'react';
import githubLogo from './../GitHub-Mark-120px-plus.png';

export class Footer extends Component{
  render(){
    return(
      <div className="footer">
          <p>Made by Daugardas Lukšas -</p>
          <a target="_blank" rel="noopener noreferrer" href="https://github.com/daugardas"><img className="github-link" alt="GitHub icon" src={githubLogo} /></a>
        </div>
    );
  }
}