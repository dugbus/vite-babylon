import "./styles.css";
import * as BABYLON from "babylonjs";
import "babylonjs-gui";
import "babylonjs-loaders";
import * as GUI from "babylonjs-gui";
import { imageTile, tickTiles } from "./image-tiles";
import { createTunnel } from "./fly-through-tunnel";
import sonic from "./assets/sonic.png";
import score from "./assets/score.png";
import max from "./assets/max.png";
import getReadyGo from "./assets/getreadygo.png";

const canvas = document.getElementById("renderCanvas");

//const engine = new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true})
const engine = new BABYLON.Engine(canvas, true);

const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min)) + min;

const boxes = [];
let image1Instances;
let image2Instances;
let image3Instances;
let skybox;

const createScene = async function () {
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color4(0, 0, 0, 1);

  const camera = new BABYLON.UniversalCamera(
    "Camera",
    BABYLON.Vector3.Zero(),
    scene
  );

  camera.attachControl(canvas, true);

  scene.activeCamera.position.x = 0;
  scene.activeCamera.position.y = 0;
  scene.activeCamera.position.z = 0;

  // Create a skybox from a unity style skybox image
  // skybox = BABYLON.Mesh.CreateBox("skyBox", 5000.0, scene);
  // const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
  // skyboxMaterial.backFaceCulling = false;
  // skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(
  //   "assets/skybox",
  //   scene,
  //   ["-px.png", "-py.png", "-pz.png", "-nx.png", "-ny.png", "-nz.png"]
  // );
  // skyboxMaterial.reflectionTexture.coordinatesMode =
  //   BABYLON.Texture.SKYBOX_MODE;
  // skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
  // skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
  // skyboxMaterial.disableLighting = true;
  // skybox.material = skyboxMaterial;

  // // Create fade to black fog for the scene
  // scene.fogEnabled = true
  // scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR
  // scene.fogDensity = 0.1
  // scene.fogColor = new BABYLON.Color3(0, 0, 0)
  // scene.fogStart = 500
  // scene.fogEnd = 1000

  createTunnel(scene);
  image1Instances = await imageTile(getReadyGo, scene, 0.2, 500);
  image2Instances = await imageTile(sonic, scene, 0.2, 1000);
  image3Instances = await imageTile(score, scene, 0.2, 2000);

  // Create a hemisphere light with fire in it
  const lighttop = new BABYLON.HemisphericLight(
    "light2",
    new BABYLON.Vector3(0, -1, 0),
    scene
  );
  lighttop.intensity = 0.5;
  lighttop.diffuse = new BABYLON.Color3(1, 1, 1);

  const lightbottom = new BABYLON.HemisphericLight(
    "light3",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );
  lightbottom.intensity = 0.5;
  lightbottom.diffuse = new BABYLON.Color3(1, 1, 1);

  /* MOUSE VERSION */
  // scene.onPointerDown = function castRay() {
  //   var ray = scene.createPickingRay(scene.pointerX, scene.pointerY, BABYLON.Matrix.Identity(), camera)
  //   var hit = scene.pickWithRay(ray)
  //   if (hit.pickedMesh){
  //     // createGUIButton(hit)
  //     hit.pickedMesh.position.z = hit.pickedMesh.position.z + 10
  //   }
  // }

  /* XR VERSION */
  scene.onPointerObservable.add((pointerInfo) => {
    switch (pointerInfo.type) {
      case BABYLON.PointerEventTypes.POINTERDOWN:
        const pickResult = pointerInfo.pickInfo;
        if (pickResult.hit) {
          var pickedMesh = pickResult.pickedMesh;
          if (pickedMesh) {
            //createGUIButton(pickedMesh)
            pickedMesh.position.z = pickedMesh.position.z + 10;
          }
        }
        break;
      case BABYLON.PointerEventTypes.POINTERPICK:
        break;
    }
  });

  scene.debugLayer.show({
    embedMode: true,
  });

  function createGUIButton(hit) {
    const label = hit.metadata;
    //Creates a gui label to display the cannon
    const guiCanvas =
      BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    const guiButton = BABYLON.GUI.Button.CreateSimpleButton("guiButton", label);
    guiButton.width = "150px";
    guiButton.height = "40px";
    guiButton.color = "white";
    guiButton.cornerRadius = 5;
    guiButton.background = "green";

    guiButton.onPointerUpObservable.add(function () {
      guiCanvas.dispose();
    });

    guiButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    guiCanvas.addControl(guiButton);
  }

  const xr = scene.createDefaultXRExperienceAsync();

  // const xr = scene.createDefaultXRExperienceAsync({
  //   uiOptions: {
  //     sessionMode: "immersive-ar",
  //   },
  //   optionalFeatures: ["hit-test", "anchors"],
  // });

  return scene;
};

let startTime = performance.now();
const scene = createScene().then((scene) => {
  const cameraPhysics = {
    velocity: 0,
    acceleration: 0.01,
  };
  engine.runRenderLoop(function () {
    if (performance.now() - startTime > 1000) {
      tickTiles(image1Instances, scene);
    }

    if (performance.now() - startTime > 5000) {
      tickTiles(image2Instances, scene);
    }

    if (performance.now() - startTime > 10000) {
      tickTiles(image3Instances, scene);
    }

    // accelerate the camera in the z direction using acceleration variables
    cameraPhysics.velocity += cameraPhysics.acceleration;
    if (cameraPhysics.velocity > 5) {
      cameraPhysics.velocity = 5;
    }

    // Move the camera down the tunnel
    scene.activeCamera.position.z += cameraPhysics.velocity;
    scene.render();
  });

  window.addEventListener("resize", function () {
    engine.resize();
  });
});
