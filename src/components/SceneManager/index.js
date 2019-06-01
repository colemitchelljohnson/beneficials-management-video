import { useMemo } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import Box from "../Box";
import Squiggly from "./Squiggly";
import * as Perlin from "../Perlin/index.js";
// const loadJsonFile = require("load-json-file");

// let diamondJSON;
// (async () => {
// 	diamondJSON = await loadJsonFile("json/diamond.json");
// 	console.log("hey", typeof diamondJSON);
// 	//=> {foo: true}
// })();
// const JSONLoader = require("three/examples/js/loaders/deprecated/LegacyJSONLoader.js");
// const Ocean = require('../Ocean/index.js');
// import Curves from '../Curves/index.js';
const EffectComposer = window.THREE.EffectComposer;
const AfterimagePass = window.THREE.AfterimagePass;
const RenderPass = window.THREE.RenderPass;
const JSONLoader = window.THREE.LegacyJSONLoader;
let useTime;

const animateSquiggly = () => {
	let squigglyAnimationElements = document.querySelectorAll(".hasAnimation");
	// console.log("squiggly animation elements", squigglyAnimationElements.length);
	for (let i = 0; i < squigglyAnimationElements.length; i++) {
		squigglyAnimationElements[i].emit("squigglyAnimation");
	}
};

const SceneManager = canvas => {
	const clock = new THREE.Clock();
	const screenDimensions = {
		width: canvas.width,
		height: canvas.height
	};

	const pipeSpline = new THREE.CatmullRomCurve3([
		new THREE.Vector3(0, 10, -10),
		new THREE.Vector3(10, 0, -10),
		new THREE.Vector3(20, 0, 0),
		new THREE.Vector3(30, 0, 10),
		new THREE.Vector3(30, 0, 20),
		new THREE.Vector3(20, 0, 30),
		new THREE.Vector3(10, 0, 30),
		new THREE.Vector3(0, 0, 30),
		new THREE.Vector3(-10, 10, 30),
		new THREE.Vector3(-10, 20, 30),
		new THREE.Vector3(0, 30, 30),
		new THREE.Vector3(10, 30, 30),
		new THREE.Vector3(20, 30, 15),
		new THREE.Vector3(10, 30, 10),
		new THREE.Vector3(0, 30, 10),
		new THREE.Vector3(-10, 20, 10),
		new THREE.Vector3(-10, 10, 10),
		new THREE.Vector3(0, 0, 10),
		new THREE.Vector3(10, -10, 10),
		new THREE.Vector3(20, -15, 10),
		new THREE.Vector3(30, -15, 10),
		new THREE.Vector3(40, -15, 10),
		new THREE.Vector3(50, -15, 10),
		new THREE.Vector3(60, 0, 10),
		new THREE.Vector3(70, 0, 0),
		new THREE.Vector3(80, 0, 0),
		new THREE.Vector3(90, 0, 0),
		new THREE.Vector3(100, 0, 0)
	]);

	// spline stuff
	var sampleClosedSpline = new THREE.CatmullRomCurve3([
		new THREE.Vector3(0, -40, -40),
		new THREE.Vector3(0, 40, -40),
		new THREE.Vector3(0, 140, -40),
		new THREE.Vector3(0, 40, 40),
		new THREE.Vector3(0, -40, 40)
	]);
	sampleClosedSpline.curveType = "catmullrom";
	sampleClosedSpline.closed = true;

	let camera,
		parent,
		tubeGeometry,
		splineMesh,
		splineCamera,
		cameraHelper,
		cameraEye;

	const params = {
		spline: sampleClosedSpline,
		scale: 0.9,
		extrusionSegments: 100,
		radiusSegments: 5,
		closed: true,
		animationView: false,
		lookAhead: true,
		cameraHelper: false
	};

	const scene = buildScene();
	const renderer = buildRender(screenDimensions);
	camera = buildCamera(params.animationView, screenDimensions);
	const sceneSubjects = createSceneSubjects(scene);

	window.addEventListener("resize", onWindowResize, false);
	// const composer = new EffectComposer( renderer );
	// composer.addPass( new RenderPass( scene, camera ) );
	// const afterimagePass = new AfterimagePass();
	// composer.addPass( afterimagePass );

	function GeneralLights(scene) {
		var lights = [];
		lights[0] = new THREE.PointLight(0xffffff, 1, 0);
		lights[1] = new THREE.PointLight(0xffffff, 1, 0);
		lights[2] = new THREE.PointLight(0xffffff, 1, 0);
		lights[0].position.set(0, 200, 0);
		lights[1].position.set(100, 200, 100);
		lights[2].position.set(-100, -200, -100);
		// scene.add( lights[ 0 ] );
		// scene.add( lights[ 1 ] );
		// scene.add( lights[ 2 ] );
		this.update = function(time) {
			// light.intensity = (Math.sin(time)+1.5)/1.5;
			// light.color.setHSL( Math.sin(time), 0.5, 0.5 );
		};
	}

	function SceneSubject(scene) {
		// BEGIN OCEAN

		// var gsize = 512;
		// var res = 1024;
		// var gres = res / 2;
		// var origx = -gsize / 2;
		// var origz = -gsize / 2;
		// let ms_Ocean = new THREE.Ocean(renderer, camera, scene, {
		//     INITIAL_SIZE: 256.0,
		//     INITIAL_WIND: [10.0, 10.0],
		//     INITIAL_CHOPPINESS: 1.5,
		//     CLEAR_COLOR: [1.0, 1.0, 1.0, 0.0],
		//     GEOMETRY_ORIGIN: [origx, origz],
		//     SUN_DIRECTION: [-1.0, 1.0, 1.0],
		//     OCEAN_COLOR: new THREE.Vector3(0.004, 0.016, 0.047),
		//     SKY_COLOR: new THREE.Vector3(3.2, 9.6, 12.8),
		//     EXPOSURE: 0.35,
		//     GEOMETRY_RESOLUTION: gres,
		//     GEOMETRY_SIZE: gsize,
		//     RESOLUTION: res
		// });
		// ms_Ocean.materialOcean.uniforms["u_projectionMatrix"] = { value: camera.projectionMatrix };
		// ms_Ocean.materialOcean.uniforms["u_viewMatrix"] = { value: camera.matrixWorldInverse };
		// ms_Ocean.materialOcean.uniforms["u_cameraPosition"] = { value: camera.position };
		// scene.add(ms_Ocean.oceanMesh);

		let animateSquigglyCheck = false;
		// END OCEAN
		const group = new THREE.Group();
		const group2 = new THREE.Group();
		const group3 = new THREE.Group();

		// BEGIN DIAMONDS
		function createDiamond() {
			var distance = 200;
			var diamondsGroup = new THREE.Object3D();
			var diamondLoader = new JSONLoader();
			diamondLoader.load("json/diamond.json", function(geometry) {
				for (var i = 0; i < 5000; i++) {
					var material = new THREE.MeshBasicMaterial({
						color: Math.random() * 0xff00000 - 0xff00000
						// shading: THREE.FlatShading
					});
					var diamond = new THREE.Mesh(geometry, material);
					diamond.position.x = Math.random() * distance * 2;
					diamond.position.y = Math.random() * distance * 2;
					diamond.position.z = 60;
					diamond.rotation.y = Math.random() * 2 * Math.PI;
					// diamond.scale.x = diamond.scale.y = diamond.scale.z =
					// Math.random() * 50 + 10;
					diamondsGroup.add(diamond);
				}
				// diamondsGroup.position.z = 70;
				// console.log("hey", camera.position, diamondsGroup.position);
				scene.add(diamondsGroup);
			});
		}
		// END DIAMONDS

		// var headOBJLoader = new OBJLoader().setPath("./models/head_001/");
		// var damaGLTFLoader = new GLTFLoader().setPath("./models/dama_de_elche/");
		// create image textures
		const tornCloudTexture = new THREE.TextureLoader().load(
			"images/IMG_5412.PNG"
		);
		tornCloudTexture.wrapS = THREE.RepeatWrapping;
		tornCloudTexture.wrapT = THREE.RepeatWrapping;
		tornCloudTexture.repeat.set(100, 100);
		const checkersTexture = new THREE.TextureLoader().load(
			"images/checkers2.jpg"
		);
		const roseTexture = new THREE.TextureLoader().load("images/rose1.jpg");
		const roseLoopTexture = new THREE.TextureLoader().load(
			"images/rose1crop.jpg"
		);
		const peggyTexture = new THREE.TextureLoader().load("images/peggy.jpg");
		const coreyTexture = new THREE.TextureLoader().load("images/corey.jpg");
		const grassTexture = new THREE.TextureLoader().load(
			"images/album-art-grass.jpg"
		);
		const stripesTexture = new THREE.TextureLoader().load("images/stripes.jpg");
		stripesTexture.wrapS = THREE.RepeatWrapping;
		stripesTexture.wrapT = THREE.RepeatWrapping;
		stripesTexture.repeat.set(1, 1);

		// create video texture
		const video = document.getElementById("video");
		const videoTexture = new THREE.VideoTexture(video);
		video.play();

		const audio = document.getElementById("audio");
		audio && audio.play();

		const documentTime = document.getElementById("time");

		// create materials
		const tornCloudMaterial = new THREE.MeshBasicMaterial({
			map: tornCloudTexture
		});
		const whiteMaterial = new THREE.MeshBasicMaterial({ color: "white" });
		const checkersMaterial = new THREE.MeshBasicMaterial({
			map: checkersTexture
		});
		const roseMaterial = new THREE.MeshBasicMaterial({ map: roseTexture });
		const roseLoopMaterial = new THREE.MeshBasicMaterial({
			map: roseLoopTexture
		});
		const videoMaterial = new THREE.MeshBasicMaterial({
			map: videoTexture
		});
		const peggyMaterial = new THREE.MeshBasicMaterial({
			map: peggyTexture
		});
		const coreyMaterial = new THREE.MeshBasicMaterial({
			map: coreyTexture
		});
		const grassMaterial = new THREE.MeshBasicMaterial({
			map: grassTexture
		});
		const stripesMaterial = new THREE.MeshBasicMaterial({
			map: stripesTexture
		});

		var binormal = new THREE.Vector3();
		var normal = new THREE.Vector3();

		const extrudePath = pipeSpline;
		tubeGeometry = new THREE.TubeBufferGeometry(
			extrudePath,
			params.extrusionSegments,
			2,
			params.radiusSegments,
			params.closed
		);
		const tubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff00ff });
		// const wireframeMaterial = new THREE.MeshBasicMaterial({
		// 	color: 0xff00ff,
		// 	opacity: 0.9,
		// 	wireframe: false,
		// 	transparent: false
		// });
		splineMesh = new THREE.Mesh(tubeGeometry, videoMaterial);
		const wireframe = new THREE.Mesh(tubeGeometry, videoMaterial);
		// splineMesh.add(wireframeMaterial);
		params.animationView && parent.add(splineMesh);
		params.animationView &&
			animateCameraAlongSpline(splineCamera, tubeGeometry, binormal, normal);

		// end spline stuff

		// create variables
		let radius = 5;
		let tube = 1;
		let tubularSegments = 100;
		let radialSegments = 20;
		let p = 4;
		let q = 1;

		let boxSize = 7;
		let tornCloudSize = 20;
		let videoSize = 20;
		let videoSize2 = videoSize * 3;
		// create objects
		const boxGeometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
		const videoBoxGeometry = new THREE.BoxGeometry(10, 10, 10);
		const roseCylinderGeometry = new THREE.CylinderGeometry(2, 2, 8, 30, 5);
		const torusGeometry = new THREE.TorusGeometry(
			radius,
			tube,
			tubularSegments,
			radialSegments,
			p,
			2
		);
		const torusKnotGeometry = new THREE.TorusKnotGeometry(
			radius,
			tube,
			tubularSegments,
			radialSegments,
			p,
			q
		);
		const tornCloudKnotGeometry = new THREE.TorusKnotGeometry(
			radius,
			tube,
			tubularSegments,
			radialSegments,
			p,
			q
		);
		const planeGeometry = new THREE.PlaneGeometry(7, 7, 7);
		const sphereGeometry = new THREE.SphereGeometry(1, 128, 128);

		// create meshes
		const videoBoxGeometryMesh = new THREE.Mesh(
			videoBoxGeometry,
			videoMaterial
		);
		const whiteBoxGeometryMesh = new THREE.Mesh(boxGeometry, whiteMaterial);
		const roseCylinderGeometryMesh = new THREE.Mesh(
			roseCylinderGeometry,
			whiteMaterial
		);
		const torusGeometryMesh = new THREE.Mesh(torusGeometry, checkersMaterial);
		const torusKnotGeometryMesh = new THREE.Mesh(
			torusKnotGeometry,
			roseMaterial
		);
		const tornCloudKnotGeometryMesh = new THREE.Mesh(
			tornCloudKnotGeometry,
			tornCloudMaterial
		);
		const planeGeometryMesh = new THREE.Mesh(planeGeometry, checkersMaterial);
		const peggySphereMesh = new THREE.Mesh(sphereGeometry, peggyMaterial);
		peggySphereMesh.scale.multiplyScalar(20);
		const coreySphereMesh = new THREE.Mesh(sphereGeometry, coreyMaterial);
		coreySphereMesh.scale.multiplyScalar(20);
		let damaMesh = null;
		let headMesh = null;

		var sweetGeometry = new THREE.SphereGeometry(5, 32, 32);
		var sweetMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
		var sweetSphere = new THREE.Mesh(sweetGeometry, sweetMaterial);

		// add to group
		group.add(torusKnotGeometryMesh);
		// group.add(tubeGeometryMesh)
		// group.add(peggySphereMesh)
		group2.add(roseCylinderGeometryMesh);
		group3.add(tornCloudKnotGeometryMesh);

		// add group to scene
		scene.add(group);
		let timeNotSet = true;
		let count = false;

		// new
		let xSize = 2;
		let ySize = 3;
		let zSize = 4;
		let n = xSize * ySize * zSize;

		let geometry = new THREE.BufferGeometry();

		function mapTo3D(i) {
			let z = Math.floor(i / (xSize * ySize));
			i -= z * xSize * ySize;
			let y = Math.floor(i / xSize);
			let x = i % xSize;
			return { x: x, y: y, z: z };
		}

		function mapFrom3D(x, y, z) {
			return x + y * xSize + z * xSize * ySize;
		}
		const timeMarker1 = 3;
		const timeMarker2 = 7;
		const timeMarker3 = 12;
		const timeMarker4 = 20;
		const timeMarker5 = 25;
		const timeMarker6 = 36;
		const timeMarker7 = 47;
		const timeMarker8 = 53;
		const timeMarker9 = 54;
		const timeMarker10 = 68;
		const timeMarker11 = 70;
		const timeMarker01 = 80;
		const timeMarker02 = 92;
		const timeMarker03 = 100;
		const timeMarker04 = 106;
		const timeMarker05 = 118;
		const timeMarker06 = 132;
		const loudTimeMarker01 = 156;
		const loudTimeMarker02 = 167;
		const loudTimeMarker03 = 196;
		const loudTimeMarker04Pre = 200;
		const loudTimeMarker04 = 201;
		const loudTimeMarker05 = 223;

		this.update = function(time) {
			console.log(
				"camera",
				camera.position,
				"scene",
				scene.position,
				"group3",
				group3.position,
				"torus knot",
				torusKnotGeometryMesh.position
			);

			if (params.animationView) {
				parent.add(splineMesh);
				scene.add(parent);
				buildCamera(params.animationView, screenDimensions);
				// console.log(camera);
				animateCameraAlongSpline(splineCamera, tubeGeometry, binormal, normal);
			} else {
				// console.log(parent);
				parent.remove(splineMesh);
				parent.remove(splineCamera);
				parent.remove(cameraEye);
			}
			// console.log('before', camera.position)
			// console.log('after', camera.position)
			// addNoise(peggySphereMesh, .03)
			// console.log(time);

			// setthetime
			useTime = time + loudTimeMarker02 - 5;
			// useTime = time;
			timeNotSet && (video.currentTime = useTime.toFixed(0));
			timeNotSet && (audio.currentTime = useTime.toFixed(0));
			timeNotSet = false;
			documentTime.textContent = useTime.toFixed(0);
			let scale = Math.sin(useTime / 2) * 20;
			let scale3 = Math.sin(useTime / 3);
			// console.log(
			// 	"useTime",
			// 	useTime * 1000 + 3,
			// 	"performance.now",
			// 	performance.now(),
			// 	"scale",
			// 	scale,
			// 	"scale3",
			// 	scale3
			// );

			group.rotation.x = useTime * 4;
			group.rotation.y = useTime;
			// group2.rotation.x = performance.now() / 700;
			// group2.rotation.y = performance.now() / 3000;
			let performanceNow = useTime * 1000 + 3;
			group2.rotation.x = performanceNow / 700;
			group2.rotation.y = performanceNow / 3000;

			if (useTime > timeMarker2 && useTime < timeMarker3) {
				group.add(whiteBoxGeometryMesh);
			}

			if (useTime > timeMarker3 && useTime < timeMarker4) {
				camera.position.z = useTime;
				scene.add(group2);
				whiteBoxGeometryMesh.scale.set(0);
				roseCylinderGeometryMesh.scale.set(1, 1, 1);
			}

			if (useTime > timeMarker4 && useTime < timeMarker5) {
				camera.position.z = 50;
				scene.add(group3);
				// roseCylinderGeometryMesh.material = videoMaterial;
				torusKnotGeometryMesh.material = videoMaterial;
				tornCloudKnotGeometryMesh.scale.set(
					5,
					1,
					scale * tubularSegments,
					scale * radialSegments,
					p,
					q
				);
			}

			if (useTime > timeMarker5 && useTime < timeMarker6) {
				torusKnotGeometryMesh.material = roseMaterial;
				roseCylinderGeometryMesh.material = videoMaterial;
				roseCylinderGeometryMesh.scale.set(5, 5, 5, 5, 5);
				camera.position.z = 50;
				camera.position.x = scale;
				camera.position.y = scale;
				scene.add(group3);
				tornCloudKnotGeometryMesh.scale.set(
					5,
					2,
					scale * tubularSegments,
					scale * radialSegments,
					p,
					q
				);
				torusKnotGeometryMesh.scale.set(
					5,
					1,
					scale * tubularSegments,
					scale * radialSegments,
					p,
					q
				);
			}

			if (useTime > timeMarker6 && useTime < timeMarker7) {
				camera.position.z = 10;
				camera.position.x = scale;
				camera.position.y = scale;
				group.rotation.x = 0;
				group.rotation.y = 0;
				group2.rotation.x = performance.now() / 2000;
				group2.rotation.y = performance.now() / 1000;
				group3.rotation.x = performance.now() / 1000;
				group3.rotation.y = performance.now() / 1000;
				group.remove(torusKnotGeometryMesh);
				tornCloudKnotGeometryMesh.material = videoMaterial;
				roseCylinderGeometryMesh.material = tornCloudMaterial;
				// torusKnotGeometryMesh.scale.set(0);
			}

			if (useTime > timeMarker7 && useTime < timeMarker8) {
				scene.background = new THREE.Color("#5381ba");
				torusKnotGeometryMesh.scale.set(1, 1, 1, 1, 1);
			}

			if (useTime > timeMarker8 && useTime < timeMarker9) {
				resetScene(scene);
				resetGroup([group, group2, group3]);
				scene.add(group);
				group.rotation.x = performance.now() / 2000;
				group.rotation.y = performance.now() / 1000;
				// group.add(torusKnotGeometryMesh);
				// torusKnotGeometryMesh.scale.set(1, 1 * scale3, 1 * scale3, 1, 1);
				camera.position.z = 25;
				camera.position.x = 0;
				camera.position.y = 0;
			}
			if (useTime > timeMarker9 && useTime < timeMarker10) {
				resetGroup([group, group2, group3]);
				scene.background = new THREE.Color("#5381ba");
				torusKnotGeometryMesh.material = whiteMaterial;
				group.add(torusKnotGeometryMesh);
				let card = new THREE.Object3D();
				planeGeometryMesh.material = peggyMaterial;
				card.add(planeGeometryMesh);
				let planeGeometryMeshBack = planeGeometryMesh.clone();
				planeGeometryMeshBack.applyMatrix(
					new THREE.Matrix4().makeRotationY(Math.PI)
				);
				planeGeometryMeshBack.material = coreyMaterial;
				card.add(planeGeometryMeshBack);
				camera.position.z = 75;
				group.position.z = scale3 * 3;
				group.rotation.x = scale3 * 4;
				group.rotation.y = scale3 * 5;
				group.scale.multiplyScalar(1.005);
				// for (var i = 1; i < 40; i++) {
				// 	let mesh = card.clone();
				// 	mesh.position.x = mesh.position.x + i;
				// 	mesh.position.y = Math.log2(mesh.position.y + i * 30);
				// 	mesh.position.z = mesh.position.z + i * 3;
				// 	let mesh2 = mesh.clone();
				// 	mesh2.position.x = mesh2.position.z + 1;
				// 	mesh2.position.y = -mesh2.position.y;
				// 	mesh2.position.z = -mesh2.position.z + 1;
				// 	let mesh3 = mesh.clone();
				// 	mesh3.position.x = -mesh3.position.x;
				// 	mesh3.position.y = mesh3.position.y + 1;
				// 	mesh3.position.z = -mesh3.position.z + 1;
				// 	let mesh4 = mesh.clone();
				// 	mesh4.position.x = -mesh4.position.x;
				// 	mesh4.position.y = -mesh4.position.y;
				// 	mesh4.position.z = mesh4.position.z + 1;
				// 	group.add(mesh);
				// 	group.add(mesh2);
				// 	group.add(mesh3);
				// 	group.add(mesh4);
				// }
			}

			// 68
			if (useTime > timeMarker10 && useTime < timeMarker01) {
				group.position.z = scale3 * 3;
				group.rotation.x = scale3 * 4;
				group.rotation.y = scale3 * 5;
				group.scale.multiplyScalar(0.995);
				// for (var i = 1; i < 30; i++) {
				// 	let newGroup = group.clone();
				// 	newGroup.position.x = -newGroup.position.x * 1.5;
				// 	newGroup.position.y = -newGroup.position.y * 1.5;
				// 	newGroup.position.z = -newGroup.position.z * 75 * scale3;
				// 	newGroup.rotation.x = -newGroup.rotation.x * scale3 * 1.5;
				// 	newGroup.rotation.y = scale3 * 3;
				// 	scene.add(newGroup);
				// }
				// group.scale.multiplyScalar(0.85);
				// peggySphereMesh.scale.set(scale3 * 0.5, 1, 1);
				// addNoise(peggySphereMesh, time*2, 20);
				// group.rotation.x = scale3*4;
				// group.rotation.y = scale3*5;
				// group.scale.multiplyScalar(1.005);
				// camera.position.z = 75;
				// group.position.z = 100*scale3;
				// group.rotation.x = scale;
				// group.rotation.y = scale;
				// planeGeometryMesh.material = roseMaterial;
				// const planeGeometryMesh2 = planeGeometryMesh.clone();
				// planeGeometryMesh2.material = checkersMaterial;
				// planeGeometryMesh2.geometry = planeGeometry;
				// planeGeometryMesh2.position.z = 50;
				// group.add(roseCylinderGeometryMesh)
				// roseCylinderGeometryMesh.material = stripesMaterial;
				// group.add(planeGeometryMesh)
				// scene.add(group)
				// scene.add(group2)
				// scene.add(group3)
				// group2.position.z = 75*scale3;
				// group2.rotation.x = performance.now() / 2000;
				// group2.rotation.y = performance.now() / 1200;
				// group2.add(roseCylinderGeometryMesh)
			}

			// 70 - 80
			// if (useTime > timeMarker11 && useTime < timeMarker01) {
			// 	group.scale.multiplyScalar(1);
			// 	peggySphereMesh.scale.set(1, 1, 1);
			// }
			// 80
			if (useTime > timeMarker01 && useTime < timeMarker03) {
				resetScene(scene);
				resetGroup([group, group2, group3]);
				group.position.z = 70;
				scene.add(group);
				scene.add(group2);
				scene.add(group3);
				camera.position.z = (75 * scale3) / 3;
				camera.position.x = 0;
				camera.position.y = 0;
				group3.position.x = 0;
				group3.position.y = 0;
				group3.position.z = 0;
				torusKnotGeometryMesh.scale.set(1, 5, 10, 10, 1);
				torusKnotGeometryMesh.material = videoMaterial;
				group3.add(torusKnotGeometryMesh);
			}
			// drop 100
			if (useTime > timeMarker03 && useTime < timeMarker04) {
				// resetGroup([group3]);
				group2.add(peggySphereMesh);
				addNoise(peggySphereMesh, 20 * scale3, 100);
				// group3.position.x = 0;
				// group3.position.y = 0;
				// group3.position.z = 0;
				// torusKnotGeometryMesh.scale.set(1, 5, 10, 10, 1);
				// torusKnotGeometryMesh.material = coreyMaterial;
				// group3.add(torusKnotGeometryMesh);
				// camera.position.z = 25;
				// group.rotation.x = 0;
				// group.rotation.y = 0;
				// addNoise(peggySphereMesh, scale3, 100);
				// group2.add(peggySphereMesh);
				// peggySphereMesh.material = peggyMaterial;
				// torusKnotGeometryMesh.material = coreyMaterial;
				// let newKnotMesh = torusKnotGeometryMesh.clone()
				// newKnotMesh.scale.set(1, 5, 10, 10, 1)
				// group2.add(newKnotMesh);
				// addNoise(peggySphereMesh, 10*scale3, 100);
				// group3.position.x = 0;
				// group3.position.y = 0;
				// group3.position.z = 0;
				// torusKnotGeometryMesh.scale.set(1, 5, 10, 10, 1)
				// torusKnotGeometryMesh.material = coreyMaterial;
				// group3.add(torusKnotGeometryMesh);
			}
			// 106
			if (useTime > timeMarker04 && useTime < timeMarker05) {
			}
			// 118 the sea
			if (useTime > timeMarker05 && useTime < loudTimeMarker01) {
				var i = 0;
				if (params.animationView != true) {
					resetScene(scene);
					resetGroup([group, group2, group3]);
					scene.background = new THREE.Color("#ffbacf");
					params.animationView = true;
					// headGLTFLoader.load("scene.gltf", function(gltf) {
					// 	gltf.scene.traverse(o => {
					// 		if (o.isMesh) {
					// 			// note: for a multi-material mesh, `o.material` may be an array,
					// 			// in which case you'd need to set `.map` on each value.
					// 			// o.material.map = grassTexture;
					// 			// gltf.material = grassMaterial;
					// 		}
					// 	});
					// 	console.log("gltf", gltf);
					// 	scene.add(gltf.scene);
					// });
				}
				// console.log("lines", lines.position, "camera", camera.position);
				// lines.position.set(1 * scale3, 0.1 * scale3, 75);
				// lines.rotation.set(0.5 * scale3, 0, 0);
				// scene.add(lines);
			}

			// 156 loud
			if (useTime > loudTimeMarker01 && useTime < loudTimeMarker02) {
				resetScene(scene);
				resetGroup([group, group2, group3]);
				params.animationView = false;
				let canvasDOM = document.getElementById("canvas");
				canvasDOM.classList.add("dn");
				let squigglyDOM = document.getElementById("squiggly");
				squigglyDOM.classList.remove("dn");
				animateSquigglyCheck === false && animateSquiggly();
				animateSquigglyCheck = true;
				// document.getElementById("sky").setObject3D("material", videoMaterial);
				document.getElementById("plane__1").setAttribute("src", "#box-texture");
				document.getElementById("plane__2").setAttribute("src", "#box-texture");
				document.getElementById("plane__3").setAttribute("src", "#box-texture");
				document.getElementById("ring__1").setAttribute("src", "#box-texture");
			}

			// 167 second loud
			if (useTime > loudTimeMarker02 && useTime < loudTimeMarker03) {
				// resetScene(scene);
				// resetGroup([group, group2, group3]);
				params.animationView = false;
				document.getElementById("sky__1").setAttribute("src", "#box-texture");
			}

			// 196
			if (useTime > loudTimeMarker03 && useTime < loudTimeMarker04) {
				scene.background = new THREE.Color("#ffbacf");
				params.animationView = false;

				let canvasDOM = document.getElementById("canvas");
				canvasDOM.classList.remove("dn");
				let squigglyDOM = document.getElementById("squiggly");
				squigglyDOM.classList.add("dn");
				scene.add(group3);
				group3.add(torusKnotGeometryMesh);
				torusKnotGeometryMesh.material = roseMaterial;
				scene.position.x = 0;
				scene.position.y = -2;
				scene.position.z = -50;
				camera.position.x = 0;
				camera.position.y = 1.6;
				camera.position.z = 0;

				// group3.rotation.x = scale3 * 4;
				group3.position.x = 0;
				group3.position.y = -2;
				group3.position.z = -30;
				group3.scale.multiplyScalar(1.0025);
				group3.rotation.x = 0;
				group3.rotation.y = 0;
				group3.rotation.z = scale3;

				// params.animationView = false;
				// console.log("animation view", params.animationView);
				// group.add(torusKnotGeometryMesh);
				// scene.add(group);
				// let canvasDOM = document.getElementById("canvas");
				// canvasDOM.classList.remove("dn");
				// document.getElementById("squiggly").classList.add("dn");
				// scene.position.z = 50;
				// camera.position.z = 75;
				// if (count === false && !headMesh) {
				// 	console.log("camera", camera.position, "scene", scene.position);
				// 	scene.background = new THREE.Color("#e5b9ba");
				// 	headOBJLoader.load(
				// 		"HEAD_001.obj",
				// 		function(object) {
				// 			console.log("obj", object);
				// 			// For any meshes in the model, add our material.
				// 			object.traverse(function(node) {
				// 				// if (node.isMesh) node.material = grassMaterial;
				// 				if (node.isMesh) node.material = roseLoopMaterial;
				// 			});
				// 			headMesh = object;
				// 			scene.add(headMesh);
				// 			console.log("headMesh Object", headMesh);
				// 		},
				// 		// called when loading is in progresses
				// 		function(xhr) {
				// 			console.log(
				// 				"headMesh",
				// 				(xhr.loaded / xhr.total) * 100 + "% loaded"
				// 			);
				// 		}, // called when loading has errors
				// 		function(error) {
				// 			console.log("headMesh", "An error happened");
				// 		}
				// 	);
				// 	count = true;
				// }
				// if (headMesh) {
				// 	headMesh.rotation.x = scale / 30;
				// 	headMesh.rotation.y = scale / 40;
				// 	headMesh.rotation.z = scale / 50;
				// 	// headMesh.position.x = scale / 2;
				// 	// headMesh.position.y = scale / 2;
				// 	// headMesh.position.x = scale3;
				// 	// headMesh.position.y = scale3;
				// 	// headMesh.position.z = (40 * scale3) / 2;
				// 	addNoise(headMesh.children[0], useTime * 2, 20);
				// }
			}
			if (useTime > loudTimeMarker04Pre && useTime < loudTimeMarker04) {
				let canvasDOM = document.getElementById("canvas");
				canvasDOM.classList.add("dn");
			}
			if (useTime > loudTimeMarker04 && useTime < loudTimeMarker05) {
				document.getElementById("squiggly").classList.add("dn");
				let loomisDOM = document.getElementById("loomis");
				loomisDOM.classList.remove("dn");
			}
			if (useTime > loudTimeMarker05) {
				let canvasDOM = document.getElementById("canvas");
				canvasDOM.classList.remove("dn");
				let loomisDOM = document.getElementById("loomis");
				loomisDOM.classList.add("dn");
			}
		};
	}
	// if (params.animationView == true) {
	// 	params.animationView = false;
	// resetScene(scene);
	// resetGroup([group, group2, group3]);
	// console.log(
	// 	"camera",
	// 	camera,
	// 	"scene",
	// 	scene,
	// 	"group",
	// 	group,
	// 	"group2",
	// 	group2,
	// 	"group3",
	// 	group3
	// );
	// }

	// torusKnotGeometryMesh.scale.set(1, 5, 10, 10, 1);
	// torusKnotGeometryMesh.material = coreyMaterial;
	// group3.add(torusKnotGeometryMesh);

	// scene.add(group2);
	// group2.add(peggySphereMesh);
	// addNoise(peggySphereMesh, 20 * scale3, 100);

	// if (count === false) {
	// console.log("position", scene.position.z, camera.position.z);
	// scene.position.z = 0;
	// camera.position.z = scale;
	// scene.background = new THREE.Color("#FFF");
	// scene.background = new THREE.Color("#e5b9ba");
	// headOBJLoader.load("HEAD_001.obj", function(object) {
	// 	console.log("obj", object);
	// For any meshes in the model, add our material.
	// object.traverse(function(node) {
	// 	if (node.isMesh) node.material = grassMaterial;
	// });
	// headMesh = object;
	// scene.add(headMesh);
	// });
	// damaGLTFLoader.load("scene.gltf", function(object) {
	// 	console.log("gltf", object);
	// For any meshes in the model, add our material.
	// object.traverse(function(node) {
	//     if (node.isMesh) node.material = grassMaterial;
	// });
	// damaMesh = object;
	// scene.add(damaMesh);
	// });
	// count = true;
	// }

	// if (headMesh) {
	// 	headMesh.rotation.x = scale3 / 3;
	// 	headMesh.rotation.y = scale3 / 4;
	// 	headMesh.rotation.z = scale3 * 5;
	// 	headMesh.position.x = scale / 2;
	// 	headMesh.position.y = scale / 2;
	// 	headMesh.position.z = 60;
	// }

	// for (i = 0; i < 30; i = i + 1) {
	// 	var sweetSphere1 = sweetSphere.clone();
	// sweetSphere.position.set(0, 0, 15);
	// sweetSphere1.position.x = -10 * scale3;
	// sweetSphere1.position.y = Math.floor(Math.random() * 10) + 0;
	// sweetSphere1.position.z = i / 10;
	// sweetSphere1.material = new THREE.MeshBasicMaterial({
	// 	color: "#379392"
	// });
	// var sweetSphere2 = sweetSphere.clone();
	// sweetSphere2.position.x = 10 * scale3;
	// sweetSphere2.position.y = Math.floor(Math.random() * 10 * scale3) + 0;
	// sweetSphere2.position.z = (i / 10) * scale3;
	// sweetSphere2.material = new THREE.MeshBasicMaterial({
	// 	color: "#4FB0C6"
	// });
	// scene.add(sweetSphere1);
	// scene.add(sweetSphere2);
	// }
	// for (i = 0; i < 30; i = i + 1) {
	// 	var sweetSphere1 = sweetSphere.clone();
	// 	sweetSphere1.position.x = -100 * scale3;
	// 	sweetSphere1.position.y = Math.floor(Math.random() * 10) + 0;
	// 	sweetSphere1.position.z = i * 10 * scale3;
	// 	sweetSphere1.material = new THREE.MeshBasicMaterial({
	// 		color: "#6C49B8"
	// 	});
	// 	var sweetSphere2 = sweetSphere1.clone();
	// 	sweetSphere2.position.x = 100 * scale3;
	// 	sweetSphere2.position.y = Math.floor(Math.random() * 10) + 0;
	// 	sweetSphere2.position.z = i / 10;
	// 	sweetSphere2.material = new THREE.MeshBasicMaterial({
	// 		color: "#4F86C6"
	// 	});
	// 	scene.add(sweetSphere1);
	// 	scene.add(sweetSphere2);
	// }
	// var diffuseColor = new THREE.Color().setHSL(
	// 	alpha,
	// 	0.5,
	// 	gamma * 0.5 + 0.1
	// );
	// for (i = 0; i < 30; i = i + 1) {
	// 	var sweetSphere1 = sweetSphere.clone();
	// 	sweetSphere1.position.x = -100 * scale3;
	// 	sweetSphere1.position.y = Math.floor(Math.random() * 10) + 0;
	// 	sweetSphere1.position.z = i / 10;
	// 	sweetSphere1.material = new THREE.MeshBasicMaterial({
	// 		color: "#379392"
	// 	});
	// 	var sweetSphere2 = sweetSphere.clone();
	// 	sweetSphere2.position.x = 100 * scale3;
	// 	sweetSphere2.position.y = Math.floor(Math.random() * 10) + 0;
	// 	sweetSphere2.position.z = i / 10;
	// 	sweetSphere2.material = new THREE.MeshBasicMaterial({
	// 		color: "#4FB0C6"
	// 	});
	// 	scene.add(sweetSphere1);
	// 	scene.add(sweetSphere2);
	// }
	// for (i = 0; i < 30; i = i + 1) {
	// 	var sweetSphere1 = sweetSphere.clone();
	// 	sweetSphere1.position.x = -100 * scale3;
	// 	sweetSphere1.position.y = Math.floor(Math.random() * 10) + 0;
	// 	sweetSphere1.position.z = i * 10;
	// 	sweetSphere1.material = new THREE.MeshBasicMaterial({
	// 		color: "#6C49B8"
	// 	});
	// 	var sweetSphere2 = sweetSphere1.clone();
	// 	sweetSphere2.position.x = 100 * scale3;
	// 	sweetSphere2.position.y = Math.floor(Math.random() * 10) + 0;
	// 	sweetSphere2.position.z = i / 10;
	// 	sweetSphere2.material = new THREE.MeshBasicMaterial({
	// 		color: "#4F86C6"
	// 	});
	// 	scene.add(sweetSphere1);
	// 	scene.add(sweetSphere2);
	// 	}
	// };
	function addNoise(mesh, scale, multiple) {
		var k = 9;
		// var time = performance.now() * 0.01;
		var time = performance.now() * 0.001;
		for (
			var i = 0;
			mesh.geometry.vertices
				? i < mesh.geometry.vertices.length
				: i < mesh.geometry.attributes.normal.count;
			i++
		) {
			var p = mesh.geometry.vertices
				? mesh.geometry.vertices[i]
				: mesh.geometry.attributes.normal.array[i];
			// p.normalize().multiplyScalar(1 + .03 * Perlin.noise.perlin3(p.x * k + time, p.y * k, p.z * k));
			mesh.geometry.vertices
				? p
						.normalize()
						.multiplyScalar(
							1 +
								scale *
									multiple *
									Perlin.noise.perlin3(p.x * k + time, p.y * k, p.z * k)
						)
				: (p =
						p *
						(1 +
							scale *
								multiple *
								Perlin.noise.perlin3(p.x * k + time, p.y * k, p.z * k)));
		}
		mesh.geometry.verticesNeedUpdate = true;
		mesh.geometry.computeVertexNormals();
		mesh.geometry.normalsNeedUpdate = true;
	}

	function resetGroup(group) {
		group.map(i => i.children.forEach(child => i.remove(child)));
	}

	function resetScene(scene) {
		scene.children.forEach(child => scene.remove(child));
	}

	function buildScene() {
		const scene = new THREE.Scene();
		scene.background = new THREE.Color("white");
		parent = new THREE.Object3D();
		scene.add(parent);

		return scene;
	}

	function buildRender({ width, height }) {
		const renderer = new THREE.WebGLRenderer({
			canvas: canvas,
			antialias: true,
			alpha: true
		});
		const DPR = window.devicePixelRatio ? window.devicePixelRatio : 1;
		renderer.setPixelRatio(DPR);
		renderer.setSize(width, height);

		renderer.gammaInput = true;
		renderer.gammaOutput = true;

		return renderer;
	}

	function buildCamera(animationView, screenDimensions) {
		splineCamera = new THREE.PerspectiveCamera(
			50,
			window.innerWidth / window.innerHeight,
			0.01,
			1000
		);
		parent.add(splineCamera);
		cameraHelper = new THREE.CameraHelper(splineCamera);
		cameraEye = new THREE.Mesh(
			new THREE.SphereBufferGeometry(5),
			new THREE.MeshBasicMaterial({
				color: "#000",
				fog: false,
				transparent: false
			})
		);
		parent.add(cameraEye);
		cameraHelper.visible = params.cameraHelper;
		cameraEye.visible = params.cameraHelper;
		scene.add(cameraHelper);
		animateCamera(cameraHelper, cameraEye);

		let mainCamera = new THREE.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.1,
			100
		);
		let otherCamera = new THREE.PerspectiveCamera(
			50,
			window.innerWidth / window.innerHeight,
			0.01,
			10000
		);

		camera = animationView ? splineCamera : mainCamera;
		camera.position.z = 75;
		return camera;
	}

	function animateCamera(cameraHelper, cameraEye) {
		cameraHelper.visible = params.cameraHelper;
		cameraEye.visible = params.cameraHelper;
	}

	function animateCameraAlongSpline(
		splineCamera,
		tubeGeometry,
		binormal,
		normal
	) {
		// animate camera along spline
		var time = Date.now();
		var looptime = 20 * 1000;
		var t = (time % looptime) / looptime;
		// console.log(t);
		// console.log("tubegeometry", tubeGeometry);
		var pos = tubeGeometry.parameters.path.getPointAt(t);
		pos.multiplyScalar(params.scale);
		// interpolation
		var segments = tubeGeometry.tangents.length;
		var pickt = t * segments;
		var pick = Math.floor(pickt);
		var pickNext = (pick + 1) % segments;
		binormal.subVectors(
			tubeGeometry.binormals[pickNext],
			tubeGeometry.binormals[pick]
		);
		binormal.multiplyScalar(pickt - pick).add(tubeGeometry.binormals[pick]);
		var dir = tubeGeometry.parameters.path.getTangentAt(t);
		var offset = 15;
		normal.copy(binormal).cross(dir);
		// we move on a offset on its binormal
		pos.add(normal.clone().multiplyScalar(offset));
		// console.log(pos);
		splineCamera.position.copy(pos);
		cameraEye.position.copy(pos);
		// using arclength for stablization in look ahead
		var lookAt = tubeGeometry.parameters.path
			.getPointAt((t + 30 / tubeGeometry.parameters.path.getLength()) % 1)
			.multiplyScalar(params.scale);
		// camera orientation 2 - up orientation via normal
		if (!params.lookAhead) lookAt.copy(pos).add(dir);
		splineCamera.matrix.lookAt(splineCamera.position, lookAt, normal);
		splineCamera.rotation.setFromRotationMatrix(
			splineCamera.matrix,
			splineCamera.rotation.order
		);
		cameraHelper.update();
		renderer.render(
			scene,
			params.animationView === true ? splineCamera : camera
		);
	}

	function createSceneSubjects(scene) {
		const sceneSubjects = [new GeneralLights(scene), new SceneSubject(scene)];

		return sceneSubjects;
	}
	let saved = false;
	function update() {
		const elapsedTime = clock.getElapsedTime();
		for (let i = 0; i < sceneSubjects.length; i++)
			sceneSubjects[i].update(elapsedTime);

		renderer.render(scene, camera);
	}

	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
		// composer.setSize( window.innerWidth, window.innerHeight );
	}

	return {
		update,
		onWindowResize
	};
};

export default SceneManager;
