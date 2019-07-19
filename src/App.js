import React, { useState, useEffect } from "react";
import { animated } from "react-spring";
import Environment from "./containers/Environment";
import Footer from "./containers/Footer";
import Box from "./components/Box";
import Grid from "./components/Grid";
import Stars from "./components/Stars";
import Repulsive from "./components/Repulsive";
import SceneManager from "./components/SceneManager";
import ThreeEntryPoint from "./components/ThreeEntryPoint";
import Loomis from "./components/SceneManager/Loomis";
import Squiggly from "./components/SceneManager/Squiggly";
import Capital from "./components/SceneManager/Capital";

const management = [
	"the see",
	"the saw",
	"the kiss",
	"the blood",
	"the moon",
	"the cross",
	"the dog",
	"the sun",
	"the fool",
	"the lick",
	"the heat",
	"the knock",
	"the roof",
	"the bleed",
	"the shot"
];

const songs = {
	1: {
		song: "2009-ICHC",
		component: <Grid />
	},
	2: {
		song: "Blue Waves",
		component: <Stars />
	},
	3: {
		song: "Queen of Wands",
		component: <Box />
	},
	4: {
		song: "Kikko",
		component: <Stars />
	},
	5: {
		song: "Sky Burial",
		component: <Box />
	},
	6: {
		song: "T-Shirt",
		component: <Stars />
	},
	7: {
		song: "Stone Fruit",
		component: <Box />
	},
	8: {
		song: "Management",
		component: <Stars />
	},
	9: {
		song: "Candy",
		component: <Box />
	},
	10: {
		song: "Chosen Horse",
		component: <Stars />
	},
	11: {
		song: "Clown Heart (Wooden)",
		component: <Box />
	},
	12: {
		song: "Gumby's Demise",
		component: <Stars />
	}
};
const App = props => {
	const [songNumber, setSongNumber] = useState(1);
	const [loomisLoaded, setLoomisLoaded] = useState(false);

	useEffect(() => {
		const bindEventListeners = () => {
			window.onresize = resizeCanvas();
			resizeCanvas();
		};

		const resizeCanvas = () => {
			canvas.style.width = "100%";
			canvas.style.height = "100%";

			canvas.width = canvas.offsetWidth;
			canvas.height = canvas.offsetHeight;

			sceneManager.onWindowResize();
		};

		const render = () => {
			requestAnimationFrame(render);
			sceneManager.update();
		};

		const canvas = document.getElementById("canvas");
		let sceneManager;
		if (loomisLoaded) {
			sceneManager = new SceneManager(canvas);
			bindEventListeners();
			render();
		}
	});

	return (
		<div id="app" className="App c-black fz30 lh1 oh h100vh w100vw">
			{/* <Environment>
        {songs[songNumber].component}
      </Environment> */}
			<canvas id="canvas" />
			<Squiggly className="dn" />
			<Loomis
				loomisLoaded={loomisLoaded}
				setLoomisLoaded={setLoomisLoaded}
				className="dn"
			/>
			<Capital className="dn" />
			<audio id="audio" className="dn">
				<source src="audio/08_Management.wav" type="audio/wav" />
			</audio>
			<video id="video" className="dn" width="300" muted>
				<source src="videos/mgmt-480.mov" type="video/mp4" />
			</video>
			<div className="df jcsb aic posa t20 l20 r20">
				<animated.div>
					<h1>Beneficials</h1>
				</animated.div>
				<animated.div>
					<h1>Management</h1>
				</animated.div>
			</div>
			<div className="df jcsb aic posa l20 r20 b20">
				<animated.div>
					<h1>Torn Cloud</h1>
				</animated.div>
				<animated.div>
					<h1 id="time">0</h1>
				</animated.div>
			</div>
			<animated.div className="dn c-black fz100 posa t0 l0">
				{management &&
					management.map((m, key) => (
						<animated.span key={key}>{m + " "}</animated.span>
					))}
			</animated.div>
			<Footer
				className="dn"
				songs={songs}
				songNumber={songNumber}
				setSongNumber={setSongNumber}
			/>
		</div>
	);
};

export default App;
