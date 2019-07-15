import React from 'react';


function Shop(props) {

    function unrollListing(listing, stateIdx) {
        let length = listing.title.length,
            fontSize = -0.00666 * length + 1.4,  //  Use style font-size: XX% to compensate for font-family differences
            titleHeight = 0.5 * length + 50;
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
                onMouseOver={() => {props.handleListingHover(stateIdx)}}
                onMouseOut={() => props.handleListingHover(stateIdx)} >
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

    return(<div id="shop">{props.listings.map(unrollListing)}</div>)
}


export default Shop;