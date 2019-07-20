import React from 'react';
import BriggsBanner from '../images/Briggs we got this_Blur_Large.png';
import ReactMarkdown from 'react-markdown';

function About(props) {
    const description = props.renderElement("About", "description", "Loading Site Description..."),
          welcome = props.renderElement("About", "welcome", "Loading Site Welcome..."),
          motto = props.renderElement("About", "motto", "Loading Site Motto...");
    return(
        <div id="about">
            <ReactMarkdown className="about-welcome" source={welcome} />
            <ReactMarkdown className="about-motto" source={motto} />
            <img id="about-image" src={BriggsBanner} />
            <ReactMarkdown className="about-description" source={description} />
        </div>
    )
}

export default About;