import React from 'react';
import { getWhenPart } from './services/tweetService';

export default function Tweet(props) {
  const { name, image, date, actionMessage } = props.tweet;
  
function imgError(event) {
  event.target.onerror = '';
  event.target.src = '/images/Somebody.jpg';
  return true;
}

  return (
    <div className="tweet row">
      <div className="col-xs-1 tight">
        <img
          src={`/images/${image}`}
          alt={name}
          onError={imgError}
          id="someImage"
        />
      </div>
      <div className="col tight actionMessage">
        {actionMessage} {getWhenPart(date)}
      </div>
    </div>
  );
}
