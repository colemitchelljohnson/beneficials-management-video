import React from 'react';

const Footer = (props) => {
  const {
    className,
    songs,
    songNumber,
    setSongNumber,
  } = props;

  return (
    <div className={`h50 df jcfs aic posa b0 l0 w100vw pl30 pr30 bgc-white ${ className }`}>
      <div className="w33.3333%">
        <p className="fz20 lh1 c-black">Beneficials - Torn Cloud</p>
      </div>
      <div className="w33.3333% tac">
        <p className="fz20 lh1 c-black">{songs[songNumber].song}</p>
      </div>
    	<div className="w33.3333% df jcfe">
        <button
          className="fz20 fw300 lh1 c-black"
          onClick={() => setSongNumber(songNumber-1)}
        >
          Previous
        </button>
        <button
          className="fz20 fw300 lh1 c-black"
          onClick={() => setSongNumber(songNumber+1)}
        >
          Next
        </button>
    	</div>
    </div>
  )
}

export default Footer;