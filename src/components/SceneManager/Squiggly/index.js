import React from "react";

const Squiggly = ({ className }) => (
	<div id="squiggly" className={className}>
		<a-scene vr-mode-ui="enabled: false">
			<a-assets>
				<img id="box-texture" src="./images/terror.jpeg" />
				<img id="album-texture" src="./images/album-art-grass.jpg" />
				<audio
					id="management"
					src="https://cdn.glitch.com/e917f120-d412-414e-8f34-d7705e1d136a%2F08_Management.wav?1558572327654"
					preload="auto"
				/>
			</a-assets>
			<a-sky
				id="sky__1"
				class="hasAnimation"
				animation="startEvents: squigglyAnimation; property: rotation; dir: alternate; to: 0 360 -360; loop: true; dur: 20000"
			>
				<a-plane
					id="plane__1"
					class="hasAnimation"
					animation__rotation="startEvents: squigglyAnimation; property: rotation; dir: alternate; to: 0 360 0; loop: true; dur: 10000"
					animation__position="startEvents: squigglyAnimation; property: position; dir: alternate; to: 0 5 5; loop: true; dur: 10000"
					position="0 2 -50"
					rotation="0 0 0"
					scale="4 9 -1"
				/>
				<a-ring
					id="ring__1"
					position="0 2 -50"
					radius-inner="1"
					radius-outer="2"
					scale="4 7 5"
					rotate="-5 -5 0"
				/>
				<a-plane
					id="plane__2"
					class="hasAnimation"
					animation="startEvents: squigglyAnimation; property: rotation; to: 0 360 0; loop: true; dir: alternate; dur: 13000"
					rotation="-90 0 0"
				/>
				<a-plane
					id="plane__3"
					class="hasAnimation"
					// animation__rotation="property: rotation; to: 0 360 0; loop: true; dur: 10000"
					// animation__position="property: position; dir: alternate; to: 0 5 5; loop: true; dur: 10000"
					animation__rotation="startEvents: squigglyAnimation; property: rotation; dir: alternate; to: 360 -360 360; loop: true; dur: 23000"
					// animation__position="property: rotation; dir: alternate; to: 360 -360 360; loop: true; dur: 23000"
					rotation="0 0 0"
					// position="0 2 -50"
					width="40"
					height="40"
				/>
			</a-sky>
		</a-scene>
	</div>
);

export default Squiggly;
