import React from 'react';
import FacebookLogo from '../icons/etsy_white_on_black.svg';
import EtsyLogo from '../icons/etsy_white_on_black.svg';

function Navigation(props) {
    return(
        <div id="nav-mobile">
        <div id="nav-handle" onClick={props.toggleNav}>
          <div id="bar1" className={"bar "+props.nav} />
          <div id="bar2" className={"bar "+props.nav} />
          <div id="bar3" className={"bar "+props.nav} />
        </div>
        <div id="nav-overlay" className={props.nav} onClick={props.toggleNav}>
          <div id="social">
            <a id="etsy" href={process.env.REACT_APP_ETSY}><img className="social-icon" src={EtsyLogo} alt="etsy link"></img></a>
            <a id="facebook" href={process.env.REACT_APP_FACEBOOK}><img className="social-icon" src={FacebookLogo} alt="facebook link"></img></a>
          </div>
          <div id="navigation">
            <p className="nav-text" onClick={() => {props.changeDisplay('Home'); props.toggleNav();}}>Home</p>
            <p className="nav-text" onClick={() => {props.changeDisplay('About'); props.toggleNav();}}>About</p>
            <a id="email" className="nav-text" href={"mailto:"+props.renderElement("Home", "email", "")}>Email</a>
          </div>
        </div>
      </div>
    )
}

export default Navigation;