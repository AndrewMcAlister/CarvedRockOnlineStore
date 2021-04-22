import React from 'react';
import Tweets from './Tweets';

export default function LandingPage() {
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-10">
          <h1 className="col section-1 section-description">
            Welcome to Carved Rock Fitness
          </h1>
          <section id="intro">
            <h3 className="col-md-12 ">
              This online shop is based on the Pluralsight course 'Managing
              React State' by Cory House. I have developed it in the following
              ways...
            </h3>
            <h3 className="col-md-12">
              <ul>
                <li>Added customer address capture at checkout</li>
                <li>Added payment information capture and validation</li>
                <li>
                  Added SWR caching, and a 1 sec delay to product
                  retrieval to show highligh caching (but not on cart).
                </li>
                <li>Added random customer purchase tweets.</li>
                <li>Added semi-transparent header background.</li>
                <li>Adjusted css of all pages</li>
              </ul>
            </h3>
          </section>
        </div>
        <div className="col">
          <Tweets />
        </div>
      </div>
    </div>
  );
}
