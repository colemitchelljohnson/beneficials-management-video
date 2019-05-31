import React from "react";

const Loomis = ({ className }) => (
	<div id="loomis" className={`bgc-black ${className}`}>
		<a-scene vr-mode-ui="enabled: false">
			{[0, 5, 10, 15, 20, 25].map((i, k) => (
				<a-ocean
					key={k}
					color="khaki"
					width="50"
					depth={i}
					density="150"
					speed="4"
					amplitude="0.1"
					amplitudeVariance="0.8"
				/>
			))}
		</a-scene>
	</div>
);

export default Loomis;
