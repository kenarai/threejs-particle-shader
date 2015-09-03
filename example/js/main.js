'use strict';

(function(window){

	var THREE = window.THREE;
	var $ = window.$;
	var raycaster = new THREE.Raycaster();

	var $container = $('#canvasContainer');
	var backgroundColor = 0x000000;

	// set the scene size
	var WIDTH = $(window.document).width();
	var HEIGHT = $(window.document).height();
	var ASPECT = WIDTH / HEIGHT;

	// WebGL Renderer
	var renderer = new THREE.WebGLRenderer({antialias: true });
	renderer.setClearColor(backgroundColor, 1);
	renderer.setSize(WIDTH, HEIGHT);

	// Scene
	var scene = new THREE.Scene();

	// Stats
	var stats = new window.Stats();
	stats.setMode(0);
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.left = '0px';
	stats.domElement.style.top = '0px';
	window.document.body.appendChild( stats.domElement );

	// Camera
	var camera = new THREE.PerspectiveCamera( 45, ASPECT, 0.1, 2000 );
	camera.position.set( -150, 0, 250 );
	camera.lookAt( new THREE.Vector3(0,0,0) );
	scene.add(camera);

	// Camera controls
	var controls = new THREE.OrbitControls(camera);
	var axisHelper = new THREE.AxisHelper( 100 );
	scene.add( axisHelper );


	// Target Sphere
	var pos = new THREE.Vector3(50.0,20.0,10.0);
	var sphereMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
	var sphereGeometry = new THREE.SphereGeometry(4, 10, 10);
	var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
	sphere.position.set(pos.x, pos.y, pos.z);
	scene.add(sphere);

	// Plane
	var planeGeometry = new THREE.PlaneGeometry(100, 100, 10, 10);
	var planeMaterial = new THREE.MeshBasicMaterial({color: 0xff00ff, wireframe: true});
	var plane = new THREE.Mesh(planeGeometry, planeMaterial);
	plane.rotation.x = Math.PI/-2;
	scene.add(plane);



	// Particles Start
	var particleOptions = {
		textureSize: 256,
		targetPosition: pos,
		pointSize: 1.2,
		gravityFactor: 0.5,
		//velocityFunctionString: 'outVelocity = inVelocity - direction;', // function input: veloctiy, pos, targetPosition, distance, direction, gravityFactor
		//colorFunctionString: 'color = vec4(dist, dist, dist, 1.0);' // function input: dist, alpha
	};
	var particles = new Particles(renderer, scene, particleOptions);
	// Particles End


	// Render loop
	function render() {
		particles.update(); //Update particles each frame
		stats.update();
		renderer.render(scene, camera);
		window.requestAnimationFrame(render);
	}

	// Append to DOM
	$container.append(renderer.domElement);

	// Kick off render loop
	render();


	// Get mouse intersections with plane
	var setTargtePosition = function(event) {
		var x = event.clientX || event.originalEvent.targetTouches[0].clientX;
		var y = event.clientY || event.originalEvent.targetTouches[0].clientY;
		var mouse = new THREE.Vector2();
		mouse.x = (x / window.innerWidth) * 2 - 1;
		mouse.y = -(y / window.innerHeight) * 2 + 1;
		raycaster.setFromCamera(mouse, camera);
		var intersects = raycaster.intersectObject(plane);
		if(intersects.length){
			var point = intersects[0].point;
			sphere.position.set(point.x, point.y, point.z);
			pos.set(point.x, point.y, point.z);
		}
	};
	window.$('body').on('click', setTargtePosition);

})(window);