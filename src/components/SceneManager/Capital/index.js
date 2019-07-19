import React, { useState, useEffect, useRef } from "react";

const Capital = ({ loomisLoaded, setLoomisLoaded, className }) => {
	return (
		<div id="capital" className={`bgc-black ${className}`}>
			<a-scene
				loading-screen="enabled: false;"
				vr-mode-ui="enabled: false"
				look-controls="enabled: false;"
			>
				<a-assets>
					<img id="torn-cloud-long" src="./images/album-art-grass.jpg" />
				</a-assets>
				<a-cylinder
					id="torn-cloud-cylinder"
					src="#torn-cloud-long"
					radius="1"
					height="70"
					theta-length="360"
					theta-start="70"
					position="0 0 -50"
					rotation="0 0 0"
					animation__rotation="property: rotation; to: 0 360 0; loop: true; dur: 5000; easing: linear;"
					// animation__height="property: height; to: 40; dur: 2000; dir: alternate;"
				/>
				<a-camera position="0 1.6 0" />
			</a-scene>
		</div>
	);
};

export default Capital;
