import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

import {gameSettingsMoves} from "./gameSettings/moves";

let camera, scene, renderer, controls;
let geometry, material, mesh, mixer;
let clock;
let action2, action,footManRun;
let footSwordAttack1, footSwordAttack2;

let footMan;

let isRunning = false;
let moveToDirection = false;


const gLoader = new GLTFLoader();
const fbxLoader = new FBXLoader();


const loadModel = async (modelPath) => {
    return await gLoader.loadAsync(modelPath);
}

const loadFbxModel = async (modelPath) => {
    return await fbxLoader.loadAsync(modelPath)
}


const init = async () => {
    clock = new THREE.Clock();

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer( { antialias: true } );


    // Plan
/*    new THREE.PlaneGeometry( 5, 20, 32 );
    new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
    const plane = new THREE.Mesh( geometry, material );
    scene.add( plane )*/

    const al = new THREE.AmbientLight( 0x324891 );
    const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8 );
    scene.add( directionalLight );

    al.intensity = 10;

    const modelPath = "./assets/models/footman/source/Footman_RIG.glb"
    const elephantBabyPath = "./assets/models/dwarf/source/BabyElephant_GLB.glb"

    const elephantBabyScene = await loadModel(elephantBabyPath);
    console.log("HERE",elephantBabyScene.animations)

    elephantBabyScene.scene.position.x = 0;
    elephantBabyScene.scene.position.y = -1;
    elephantBabyScene.scene.scale.x = 1
    elephantBabyScene.scene.scale.y = 1
    elephantBabyScene.scene.scale.z = 1;

    let actionBabyElephant = new THREE.AnimationMixer( elephantBabyScene.scene ).clipAction( elephantBabyScene.animations[0]);
    actionBabyElephant.play();
    scene.add (elephantBabyScene.scene);


    footMan = await loadModel(modelPath);
    console.log(footMan);
    footMan.scene.position.x = 0;
    footMan.scene.position.y = -1;
    footMan.scene.scale.x = 1
    footMan.scene.scale.y = 1
    footMan.scene.scale.z = 1;
    scene.add ( footMan.scene );
    mixer = new THREE.AnimationMixer( footMan.scene );
    action = mixer.clipAction( footMan.animations[0]);
    action2 = mixer.clipAction( footMan.animations[2]);
    footManRun = mixer.clipAction( footMan.animations[13]);
    footSwordAttack1 = mixer.clipAction( footMan.animations[14]);
    footSwordAttack2 = mixer.clipAction( footMan.animations[15]);

    action.play();
    console.log(footMan);

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
    camera.position.z = 5;
    camera.position.y = 1.5;
    controls = new OrbitControls( camera, renderer.domElement );
    //controls.update() must be called after any manual changes to the camera's transform
    camera.position.set( 0, 1.2, -4 );
    controls.update();

    geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
    material = new THREE.MeshNormalMaterial();

    mesh = new THREE.Mesh( geometry, material );
    scene.background = new THREE.Color(0xf5f5f5);
    scene.add( mesh );
    scene.add( al );

    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setAnimationLoop( animate );
    document.body.appendChild( renderer.domElement );


}

document.addEventListener("keydown", event => {
    let { key } = event;
    if ( key === gameSettingsMoves.forwardKey && isRunning === false) {
        isRunning = true;
        moveToDirection = "forward";
        footManRun.play();
    }

    if ( key === gameSettingsMoves.leftKey && isRunning === false) {
        isRunning = true;
        moveToDirection = "left";
        footManRun.play();
    }

    if ( key === gameSettingsMoves.rightKey && isRunning === false) {
        isRunning = true;
        moveToDirection = "right";
        footManRun.play();
    }

    if ( key === gameSettingsMoves.backKey && isRunning === false) {
        isRunning = true;
        moveToDirection = "back";
        footManRun.play();
    }
});

document.addEventListener("keyup", event => {
    let { key } = event;
    if ( key === gameSettingsMoves.forwardKey && isRunning === true) {
        isRunning = false;
        footManRun.stop();
        action.play();
    }
    if ( key === gameSettingsMoves.leftKey && isRunning === true) {
        isRunning = false;
        footManRun.stop();
        action.play();
    }
    if ( key === gameSettingsMoves.rightKey && isRunning === true) {
        isRunning = false;
        footManRun.stop();
        action.play();
    }
    if ( key === gameSettingsMoves.backKey && isRunning === true) {
        isRunning = false;
        footManRun.stop();
        action.play();
    }
});


// TODO is broken !
document.onclick = () => {
    footSwordAttack2.setLoop( THREE.LoopOnce );
    if ( !footSwordAttack2.isRunning() ) {
        footSwordAttack2.play()
    }
}

/*
setTimeout( () => {
    action2.setLoop( THREE.LoopOnce );
    action2.play();
}, 10e3)
*/




function animate( time ) {
    //requestAnimationFrame( animate ); lag ?

    controls.update();

    let mixerUpdateDelta = clock.getDelta();
    mixer.update( mixerUpdateDelta );


    mesh.rotation.x = time / 2000;
    mesh.rotation.y = time / 1000;


    if ( isRunning ) {
        if ( moveToDirection === "forward" ) {
            footMan.scene.position.z += gameSettingsMoves.defaultSpeedMoveForward;
        }
        if ( moveToDirection === "back" ) {
            footMan.scene.position.z -= gameSettingsMoves.defaultSpeedMoveBack;
        }
        if ( moveToDirection === "left" ) {
            footMan.scene.position.x += gameSettingsMoves.defaultSpeedMoveBack;
        }
        if ( moveToDirection === "right" ) {
            footMan.scene.position.x -= gameSettingsMoves.defaultSpeedMoveBack;
        }
    }

    renderer.render( scene, camera );

}

// entry point
(async () => {
    await init();
})();
