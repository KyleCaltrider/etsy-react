import React from 'react';
import helpers from './helpers';
import './App.css';
import BriggsBanner from './images/Briggs we got this_Blur_Large.png';

// Component Imports
import About from './components/About';
import Shop from './components/Shop';
import Navigation from './components/Navigation';

const testListing = {
  "currency_code": "USD",
  "price": "0.20",
  "description": helpers.randomWords(40),
  "title": helpers.randomWords(4),  // "Test Item 1"
  "MainImage": {"url_570xN": "https://i.etsystatic.com/20648106/r/il/2bb914/1987336315/il_570xN.1987336315_hqs1.jpg"},
  "listing_id": "987583457",
  "url": "https://www.etsy.com/listing/706886826/test-item-1?utm_source=tntbriggsdesign&utm_medium=api&utm_campaign=api",
  "hover": ""
}


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nav: "",
      display: "Home",
      listings: []
    }
    this.logState = this.logState.bind(this);
    this.toggleNav = this.toggleNav.bind(this);
    this.changeDisplay = this.changeDisplay.bind(this);
    this.handleListingHover = this.handleListingHover.bind(this);
    this.renderDisplay = this.renderDisplay.bind(this);
  }

  logState() {
    if (this.state.listings.length < 1) {
      let testListings = [];
      for (let i = 0; i < 50; i++) {
        let newListing = Object.assign({}, testListing);
        newListing.listing_id = [...Array(10)].map(x => Math.floor(Math.random() * 10)).join("");
        testListings.push(newListing);
      }
      console.log(testListings);
      this.setState({listings: testListings});
    }
  };

  componentDidMount() {
    this.getListings();
  }

  toggleNav() {
    this.setState({nav: this.state.nav === "active" ? "" : "active"});
  }

  changeDisplay(view) {
    this.setState({display: view});
  }

  async getListings() {
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
            console.log(listings);
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

  handleListingHover(idx) {
    const newListings = this.state.listings.map((l, i) => {
      if (i === idx) {
        !l.hover.length ? l.hover = "active" : l.hover = "";
      }
      return l;
    })
    this.setState({listings: newListings});
  }

  renderDisplay() {
    const views = {
      'Home': <Shop handleListingHover={this.handleListingHover} listings={this.state.listings} />,
      'About': <About />
    };
    return views[this.state.display];
  };

  render() {
    let year = new Date();
    year = year.getFullYear();
    return (
      <div className="App">
        <button id="debug" onClick={this.logState}>DEBUG HELPER</button>
        <header id="home">
          <img src={BriggsBanner} alt="Banner reads: Briggs we got this"/>
          <p>T.n.T Briggs Design</p>
        </header>
        <Navigation toggleNav={this.toggleNav} nav={this.state.nav} changeDisplay={this.changeDisplay} />
        {this.renderDisplay()}
        <footer>
          <p>T.n.T Briggs Design {year} | Design by Kyle Caltrider</p>
        </footer>
      </div>
    );
  }
}

export default App;