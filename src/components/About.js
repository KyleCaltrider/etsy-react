import React from 'react';
import BriggsBanner from '../images/Briggs we got this_Blur_Large.png';

function About(props) {
    const description = props.renderElement("About", "description", "Loading Site Description..."),
          welcome = props.renderElement("About", "welcome", "Loading Site Welcome..."),
          motto = props.renderElement("About", "motto", "Loading Site Motto...");
    return(
        <div id="about">
            <h1 id="about-welcome">{welcome}</h1>
            <h2 id="about-motto">{motto}</h2>
            <img id="about-image" src={BriggsBanner} />
            <p id="about-description">{description}</p>
        </div>
    )
}

export default About;