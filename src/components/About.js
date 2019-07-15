import React from 'react';
import BriggsBanner from '../images/Briggs we got this_Blur_Large.png';

function About(props) {
    const description = "This is a description of our business. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec finibus diam vitae enim ultrices sollicitudin. Integer viverra mi a dolor pulvinar bibendum. In hac habitasse platea dictumst. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Proin lacinia condimentum urna, eget tincidunt nibh semper at. Proin ultrices lobortis venenatis. Etiam consequat purus ullamcorper venenatis dignissim. Aliquam nulla erat, efficitur auctor nisi at, tempor ornare felis. Mauris pellentesque dignissim hendrerit. Nam euismod volutpat lobortis.",
          welcome = "Welcome",
          motto = "This is our motto..."
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