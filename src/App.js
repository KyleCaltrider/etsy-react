import React from 'react';
import './App.css';
import BriggsBanner from './images/Briggs we got this_Blur_Large.png';

function randomWords(count) {
  const randomNumb = () => {
    let num = 91;
    while ([91, 92, 93, 94, 95, 96].includes(num)){
      num = Math.floor(Math.random() * (123 - 65) + 65);
    }
    return num;
  }
  const randomLength = () => Math.floor(Math.random() * (12 - 2) + 2);
  const response = [];
  for (let i = 0; i < count; i++) {
    let word   = "",
        length = randomLength();
    for (let i = 0; i < length; i++) {
      word += String.fromCharCode(randomNumb());
    }
    response.push(word);
  }
  return response.join(' ');
}

function cleanText(text) {
  // Unicode to ASCII conversion
  text = text.replace(/&#\d+;/gi, unicode => String.fromCharCode(unicode.match(/\d+/)[0]));
  text = text.replace(/&quot;/gi, '"');
  // Scrub Any HTML Links/Elements
  const webAddresses = text.match(/\S*www.\S*|http\S*|\S*\.\w+\/\S+/gi);
  for (let i in webAddresses) {
    text = text.replace(webAddresses[i], "Etsy");
    // Making an assumption that all embedded links are to Etsy Product or Store,
    // which should make them redundent here anyway since the listing is a link
  }
  text = text.replace(/<.+>/g, "");

  return text;
}

const testListing = {
  "currency_code": "USD",
  "price": "0.20",
  "description": randomWords(40)+"&#39;",
  "title": randomWords(10),  // "Test Item 1"
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
      about: "",
      listings: []
    }
    this.logState = this.logState.bind(this);
    this.toggleNav = this.toggleNav.bind(this);
    this.toggleAbout = this.toggleAbout.bind(this);
    this.unrollListing = this.unrollListing.bind(this);
    this.handleListingHover = this.handleListingHover.bind(this);
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
    console.log("Nav State:", this.state.nav === "active" ? "" : "active")
    this.setState({nav: this.state.nav === "active" ? "" : "active"});
  }

  toggleAbout() {
    this.setState({about: this.state.nav === "active" ? "" : "active"});
  }

  async getListings() {
    const xhr = new XMLHttpRequest();
    xhr.onload = async () => {
      if (xhr.response) {
        try {
          let listings = await JSON.parse(xhr.response).map(l => {
            l.hover = "";
            l.description = cleanText(l.description);
            l.title = cleanText(l.title);
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

  unrollListing(listing, stateIdx) {
    let length = listing.title.length,
        fontSize = 0.01 * length + 0.5,  //  Use style font-size: XX% to compensate for font-family differences
        titleHeight = 0.1 * length + 70;
    fontSize = fontSize > 1.2 ? 1.2 : fontSize < 0.8 ? 0.8 : fontSize;
    titleHeight = titleHeight > 100 ? 100 : titleHeight < 50 ? 50 : titleHeight;
    fontSize = fontSize.toString() + 'em';
    titleHeight = titleHeight.toString() + "px";

    const pStyle = {
      fontSize: fontSize
    };
    const titleStyle = {
      height: titleHeight
    };

    return(
      <div className={"listing "+listing.hover}
           key={listing.listing_id}
           onClick={() => window.open(listing.url, "_blank")}
           onMouseOver={() => {this.handleListingHover(stateIdx)}}
           onMouseOut={() => this.handleListingHover(stateIdx)} >
        <div className={"listing-title "+listing.hover} style={titleStyle}>
          <p className={"listing-text "+listing.hover} style={pStyle}>{listing.title}</p>
        </div>
        <img className={"listing-img "+listing.hover} src={listing.MainImage.url_570xN} alt={listing.title}></img>
        <p className={"listing-description listing-text "+listing.hover}>{listing.description}</p>
        <p className={"listing-price listing-text "+listing.hover}>{listing.price + " " + listing.currency_code}</p>
        <p className={"listing-buy "+listing.hover} alt="Buy On Etsy">Etsy</p>
      </div>
    )
  }

  

  render() {
    return (
      <div className="App">
        <button id="debug" onClick={this.logState}>DEBUG HELPER</button>
        <header id="home">
          <img src={BriggsBanner} alt="Banner reads: Briggs we got this"/>
          <p>T.n.T Briggs Design</p>
        </header>
        <div id="nav-mobile">
          <div id="nav-handle" onClick={this.toggleNav}>
            <div id="bar1" className={"bar "+this.state.nav} />
            <div id="bar2" className={"bar "+this.state.nav} />
            <div id="bar3" className={"bar "+this.state.nav} />
          </div>
          <div id="nav-overlay" className={this.state.nav} onClick={this.toggleNav}>
            <div id="social">
              <a id="etsy" href={process.env.REACT_APP_ETSY}><img alt="etsy link"></img></a>
              <a id="facebook" href={process.env.REACT_APP_FACEBOOK}><img alt="facebook link"></img></a>
            </div>
            <div id="navigation">
              <a href="#home" className="nav-text" onClick={this.toggleNav}>Home</a>
              <p className="nav-text" onClick={(e) => {this.toggleAbout(e); this.toggleNav();}}>About</p>
              <a id="email" className="nav-text" href={"mailto:"+process.env.REACT_APP_EMAIL}>Email</a>
            </div>
          </div>
        </div>
  
        <main id="shop">
          {this.state.listings.map(this.unrollListing)}
        </main>
      </div>
    );
  }

}

export default App;

/* Dev Stuff
<div id="test-container">
  <p>test text</p>
</div>
*/
