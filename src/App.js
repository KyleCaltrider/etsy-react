import React from 'react';
import helpers from './helpers';
import './App.css';
import BriggsBanner from './images/Briggs we got this_Blur_Large.png';
import ReactMarkdown from 'react-markdown';

// Component Imports
import About from './components/About';
import Shop from './components/Shop';
import Navigation from './components/Navigation';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nav: "",
      display: "Home",
      listings: [],
      pages: []
    }
    this.toggleNav = this.toggleNav.bind(this);
    this.changeDisplay = this.changeDisplay.bind(this);
    this.handleListingHover = this.handleListingHover.bind(this);
    this.renderDisplay = this.renderDisplay.bind(this);
    this.updatePages = this.updatePages.bind(this);
    this.renderPageElement = this.renderPageElement.bind(this);
  }

  componentDidMount() {
    // On page mount, retrieve site content and Etsy shop listings
    this.updatePages();
    this.getListings();
  }

  toggleNav() {
    this.setState({nav: this.state.nav === "active" ? "" : "active"});
  }

  changeDisplay(view) {
    this.setState({display: view});
  }

  getListings() {
    const xhr = new XMLHttpRequest();
    xhr.onload = async () => {
      if (xhr.response) {
        try {
          let listings = await JSON.parse(xhr.response).map(l => {
            l.hover = "";
            l.description = helpers.cleanText(l.description);
            l.title = helpers.cleanText(l.title);
            return l;
          });
          if (listings.length > 0) {
            this.setState({listings: listings})
          }
        }
        catch(err) {
            console.error(err);
        }
      }
    }
    xhr.open('GET', "/api/get-listings");
    xhr.send();
  }

  updatePages() {
    const xhr = new XMLHttpRequest();
    xhr.onload = async() => {
      if (xhr.response) {
        try {
          let pages = await JSON.parse(xhr.response);
          console.log(pages);
          this.setState({pages: pages});
        }
        catch(err) {
          console.error(err);
        }
      }
    }
    xhr.open("GET", "/api/update");
    xhr.send();
  }

  handleListingHover(idx) {
    // Toggles a listings hover property
    // To be used primarily during mouse events
    const newListings = this.state.listings.map((l, i) => {
      if (i === idx) {
        !l.hover.length ? l.hover = "active" : l.hover = "";
      }
      return l;
    })
    this.setState({listings: newListings});
  }

  renderDisplay() {
    // Selectively renders View components based off the "display" state value.
    // This should probably be replaced by BrowserRouter...but currently it works.
    const views = {
      'Home': <Shop handleListingHover={this.handleListingHover} listings={this.state.listings} renderElement={this.renderPageElement} />,
      'About': <About pages={this.state.pages} renderElement={this.renderPageElement} />
    };
    return views[this.state.display];
  };

  renderPageElement(page, el, alt) {
    // Looks up and returns a particular site content element
    // given a page [String] it's on, and what it's called [el: String].
    // ex: page = "Home", el = "shop"
    // Falls back to the alt [String] argument
    
    const { pages } = this.state;
    page = pages.find(p => p.name === page);
    if (page) {
      return page.contents[el]
    }
    else return alt;
  }

  
  render() {
    let year = new Date();
    year = year.getFullYear();
    return (
      <div className="App">
        <header id="home">
          <img src={BriggsBanner} alt="Banner reads: Briggs we got this"/>
          <p>{this.renderPageElement("Home", "shop", "Loading Shop...")}</p>
        </header>
        <Navigation toggleNav={this.toggleNav} nav={this.state.nav} changeDisplay={this.changeDisplay} renderElement={this.renderPageElement} />
        {this.renderDisplay()}
        <footer>
          <ReactMarkdown source={this.renderPageElement("Home", "shop", "Loading Shop...") + " " + year + " | Design by Kyle Caltrider"} />
        </footer>
      </div>
    );
  }
}

export default App;
