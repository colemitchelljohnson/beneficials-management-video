import React, { useState, useEffect, useRef } from "react";

const Loomis = ({ loomisLoaded, setLoomisLoaded, className }) => {
	const loomisObject = useRef(null);
	let firstLoad = true;
	useEffect(() => {
		console.log("current", loomisObject.current);
		const handleModelLoaded = () => {
			if (firstLoad) {
				console.log("first load");
				setLoomisLoaded(false);
				firstLoad = false;
			}
			if (!firstLoad) {
				console.log("second load");
				setLoomisLoaded(true);
			}
		};
		loomisObject.current.addEventListener("model-loaded", handleModelLoaded);
		return () => {
			loomisObject.current.removeEventListener(
				"model-loaded",
				handleModelLoaded
			);
		};
	});

	return (
		<div id="loomis" className={`bgc-black ${className}`}>
			<a-scene id="loomis-scene" vr-mode-ui="enabled: false">
				<a-assets>
					<a-asset-item id="head-obj" src="./models/head_001/Head_001.OBJ" />
					<img id="rose-loop-material" src="./images/rose1crop.jpg" />
				</a-assets>
				<a-entity
					ref={loomisObject}
					obj-model="obj: #head-obj;"
					material="src: #rose-loop-material"
					position="0 -2 -100"
					rotation="0 115.859 248.869"
					animation__rotation="property: rotation; to: 180 135 275; loop: true; dir: alternate; dur: 20000;"
					animation__position="property: position; dir: alternate; to: 0 -20 -300; loop: true; dur: 35000"
				/>
			</a-scene>
		</div>
	);
};

export default Loomis;
