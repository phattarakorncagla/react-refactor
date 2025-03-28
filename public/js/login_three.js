import * as THREE from "../lib/three/three.module.js";
import {CSS3DRenderer, CSS3DObject} from "../lib/three/CSS3DRenderer.js";

let canvas, loginWrapper, loginButton, scene, bodySizes, renderer, camera, orbitControls, material1, material2, rect1, rect2, directionalLight, light1, light2, light3, rect1Geometry, rect2Geometry;

// CSS
let cssRenderer, cssLogInWrapperObj, cssWrapperScale;

//背景やフォームの色
let boxColor = "#02545a";
let boxColorLight = "#0183a0";

// 背景の四角
let rectArray1 = [];
let rectArray2 = [];
let rect = [];
let rect1Tween1, rect1Tween2, rect1Tween3;

// 前景の立方体
let cube, cubeGeometry, cubeMaterial, cubeMaterialTween;

// 前景の立方体のTween.js
let cubeTween1, cubeTween2, cubeRotation;

// ロゴ
let logoGeometry, logoMaterial, logo, logoTexture, logoMaterialTween, logoTween1;

// plane
let planeGeometry, planeTexture, planeMaterial, plane, planeTween1, planeTween2, planeTween3;

//マウス座標の取得とボタンクリックイベントの変数
let mouse, raycaster;
let clickFlag = false;
let moveFlag = false;

// アニメーションで使う変数
let clock = new THREE.Clock();
let animeId, step;


init();
animate();
// setControl();


function init(){

// キャンバスやDivの取得
canvas = document.querySelector(".body_canvas"); //.body_canvas: bodyのキャンバス
loginWrapper = document.querySelector(".login_wrapper") //.login_wrapper: input,buttonのwrapper
loginButton = document.querySelector(".login_button"); //.login_button: ログインボタン

// 必須の3要素 シーン、カメラ、レンダラー を追加 /////////////
// シーン
scene = new THREE.Scene(); //画面全体の背景
// フォグを設定
// new THREE.Fog(色、開始距離、終点距離)
scene.fog = new THREE.Fog(0x000000, -10, 50);

// サイズ設定
bodySizes = { //bodySize
  width: window.innerWidth,
  height: window.innerHeight
}


// フォーム要素の縦横比
loginWrapper.width = bodySizes.innerWidth * 0.2;

// bodyカメラ
camera = new THREE.PerspectiveCamera(
  45,
  bodySizes.width / bodySizes.height,
  0.1,
  1000
);
camera.position.set(0, 0, 0);
// camera.rotation.x = Math.PI / 50 * -1.5;


// bodyレンダラー
renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true
});
renderer.setSize(bodySizes.width, bodySizes.height);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.render(scene, camera);

// OrbitControls
// orbitControls = new OrbitControls(camera, renderer.domElement);

// オブジェクトを作成しよう ////////////////////////////////
// マテリアル
material1 = new THREE.MeshStandardMaterial({
  color: boxColor,
  transparent: true,
  blending:THREE.AdditiveBlending, //発光
});
material1.opacity = 1;

material2 = new THREE.MeshStandardMaterial({
  color: boxColorLight,
  transparent: true,
  // wireframe: true,
  wireframe: false,
});
material2.opacity = 0.3;

const plus = 4;

// 書きかけ、rectの代わりにforでオブジェクトを追加できるか試す。----------------------- //

// 背景の四角の位置と尺度
let rectCount = 100;
let positionRange = 10;
let rectArray =[];
let widthCoordinate = 4.5;
let heightCoordinateTop = 4;
let heightCoordinateBottom = -5;
let scaleBase = 1;
let scaleRange = 5;

// 背景の四角にposition,scaleの値をセットする
rectExample();
function rectExample() {
    // Left
    for(let i = 1; i < rectCount; i++) {
        let positionArrayLeft = [ //{position:x, position:y, position:z}の値をセット
          widthCoordinate * -1, //position.xを固定
          (Math.random() * positionRange * i/rectCount) - (Math.random() * positionRange * i/rectCount), 
          Math.random() * positionRange * i/rectCount * positionRange
        ];
        let ScaleArrayLeft = [ //{scale:x, scale:y, scale:z}の値をセット
          Math.random() * i/rectCount * scaleBase, //scale.xを小さくして、厚みを薄くする。
          Math.random() * i/rectCount * scaleRange, 
          Math.random() * i/rectCount * scaleRange
        ];
        rectArray.push({position: positionArrayLeft, scale: ScaleArrayLeft})
    };
    // Right
    for(let j = 1; j < rectCount; j++) {
        let positionArrayRight = [
          widthCoordinate, //position.xを固定
          (Math.random() * positionRange * j/rectCount) - (Math.random() * positionRange * j/rectCount), 
          Math.random()  * positionRange * j/rectCount * positionRange
        ];
        let ScaleArrayRight = [
          Math.random() * j/rectCount * scaleBase, //scale.xを小さくして、厚みを薄くする。
          Math.random() * j/rectCount * scaleRange, 
          Math.random() * j/rectCount * scaleRange
        ];
        rectArray.push({position: positionArrayRight, scale: ScaleArrayRight})
    };
    // Top
    for(let k = 0; k < rectCount; k++) {
        let positionArrayTop = [
          (Math.random() * positionRange * 3 * k/rectCount) - (Math.random() * positionRange * 3 * k/rectCount), 
          heightCoordinateTop, //position.yを固定
          Math.random() * positionRange * k/rectCount * positionRange
        ];
        let ScaleArrayTop = [
          Math.random() * k/rectCount * scaleRange, 
          Math.random() * k/rectCount * scaleBase, //scale.yを小さくして、厚みを薄くする。
          Math.random() * k/rectCount * scaleRange
        ];
        rectArray.push({position: positionArrayTop, scale: ScaleArrayTop})
    };
    // Bottom
    for(let l = 0; l < rectCount; l++) {
        let positionArrayBottom = [
          (Math.random() * positionRange * 3 * l/rectCount) - (Math.random() * positionRange * 3 * l/rectCount), 
          heightCoordinateBottom, //position.yを固定
          Math.random() * positionRange * l/rectCount * positionRange
        ];
        let ScaleArrayBottom = [
          Math.random() * l/rectCount * scaleRange, 
          Math.random() * l/rectCount * scaleBase, //scale.yを小さくして、厚みを薄くする。
          Math.random() * l/rectCount * scaleRange
        ];
        rectArray.push({position: positionArrayBottom, scale: ScaleArrayBottom})
  };
  rect = rectArray;
};



// 背景の四角 start ---------------------------------------------- //
drawRect();
function drawRect () {
  var duration = 6000;
  var zto = 30;
  // 背景の四角(1)
  for (let i = 0; i < rect.length; i ++) {
    rect1Geometry = new THREE.BoxGeometry();
    rect1 = new THREE.Mesh(rect1Geometry, material1);
    rect1.position.set(rect[i].position[0], rect[i].position[1], 5);//rect[i].position[2]);
    rect1.scale.set(rect[i].scale[0], rect[i].scale[1], rect[i].scale[2]);

    // 背景の四角(1)のアニメーション
    var durval = Math.random()*1000+duration;
    rect1Tween1 = new TWEEN.Tween(rect1.position)
      .to({x:rect[i].position[0], y:rect[i].position[1], z:rect[i].position[2]-zto}, durval)
      .repeat(Infinity)
      .delay(i*10)
      .easing(TWEEN.Easing.Quadratic.Out)
      .start()
      
    // 背景の四角(2)のアニメーション
    // rect1Tween2 = new TWEEN.Tween(material1)
    //   .repeat(Infinity)
    //   .to({opacity:0}, durval)
    //   .delay(i*10)
    //   // .easing(TWEEN.Easing.Quadratic.In)
    //   .start()

    // if(i < 0) {
    //   false
    // } else if(i >=0 && i < rect.length/4) {
    //   // 四角の厚みを変化させるアニメーション
    //   rect1Tween3 = new TWEEN.Tween(rect1.scale)
    //   .to({x:rect[i].scale[0] - 0.2, y:rect[i].scale[1], z:rect[i].scale[2]}, 800 * Math.random())
    //   .easing(TWEEN.Easing.Quadratic.Out)
    //   .delay(100)
    //   .repeat(Infinity)
    //   .yoyo(true)
    //   .start()
    // } else if(i >= rect.length / 4 && i < rect.length / 2) {
    //   // 四角の厚みを変化させるアニメーション
    //   rect1Tween3 = new TWEEN.Tween(rect1.scale)
    //   .to({x:rect[i].scale[0] - 0.2, y:rect[i].scale[1], z:rect[i].scale[2]}, 800 * Math.random())
    //   .easing(TWEEN.Easing.Quadratic.Out)
    //   .delay(100)
    //   .repeat(Infinity)
    //   .yoyo(true)
    //   .start()
    // } else if(i >= rect.length / 2 && i < rect.length * 3 / 4) {
    //   // 四角の厚みを変化させるアニメーション
    //   rect1Tween3 = new TWEEN.Tween(rect1.scale)
    //   .to({x:rect[i].scale[0], y:rect[i].scale[1] - 0.2, z:rect[i].scale[2]}, 800 * Math.random())
    //   .easing(TWEEN.Easing.Quadratic.Out)
    //   .delay(100)
    //   .repeat(Infinity)
    //   .yoyo(true)
    //   .start()
    // } else if(i >= rect.length * 3 / 4 && i <= rect.length) {
    //   // 四角の厚みを変化させるアニメーション
    //   rect1Tween3 = new TWEEN.Tween(rect1.scale)
    //   .to({x:rect[i].scale[0], y:rect[i].scale[1] - 0.2, z:rect[i].scale[2]}, 800 * Math.random())
    //   .easing(TWEEN.Easing.Quadratic.Out)
    //   .delay(100)
    //   .repeat(Infinity)
    //   .yoyo(true)
    //   .start()
    // }

    scene.add(rect1);
    rectArray1.push(rect1); //配列にセット
  }

};

// 背景の四角 end ---------------------------------------------- //

// Tween.jsでボックスを動かす start ---------------------------------------------- //
box();
function box () {
  cubeGeometry = new THREE.BoxGeometry(2.1, 2.1, 2.1);
  cubeMaterial = new THREE.MeshPhysicalMaterial({
    color: boxColorLight,
    transparent: true,
    // alphaMap: logoTexture,
    depthWrite: false,
    blending:THREE.AdditiveBlending, //発光
  });
  cubeMaterial.opacity = 0.9;

  cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.castShadow = true;
  cube.receiveShadow = true;
  cube.position.set(0, 3, 10);
  cube.rotation.set(3, 0, 0);
  
  // Tween.jsで立方体cubeを動かす
  cubeMaterialTween = new TWEEN.Tween(cubeMaterial)
    .to({opacity:0.8}, 3000)
    .start()

  cubeTween1 = new TWEEN.Tween(cube.position)
  .to({x:0, y:-0.15, z: -9}, 1100)
  .delay(500)
  .easing(TWEEN.Easing.Exponential.Out)
  .start()
  
  cubeRotation = new TWEEN.Tween(cube.rotation)
    .to({x:0.17, y:0, z:0}, 1000)
    .start()

  cubeTween1.chain(cubeRotation);

  scene.add(cube);
}
// Tween.jsでボックスを動かす end ---------------------------------------------- //

// T-LINITYロゴ start ---------------------------------------------- //
tlinityLogo();
function tlinityLogo () {
  logoGeometry = new THREE.BoxGeometry(2, 0.7, 0.01);
  logoTexture = new THREE.TextureLoader().load("../img/login/login_logo.svg");
  logoMaterial = new THREE.MeshBasicMaterial({
    transparent: true,
    map: logoTexture,
    alphaMap: logoTexture,
    depthWrite: false,
  });
  logoMaterial.opacity = 0;

  logo = new THREE.Mesh(logoGeometry, logoMaterial);
  logo.castShadow = true;
  logo.position.set(0, 1.1, -5);
  logo.rotation.set(0, 0, 0);
  logo.scale.set(0.6, 0.55, 0.6);

  // Tween.js
  logoMaterialTween = new TWEEN.Tween(logoMaterial)
    .to({opacity: 1}, 500)
    .delay(1000)
    .start()

  logoTween1 = new TWEEN.Tween(logo.position)
    .to({x:0, y:0.5, z:-4}, 2500)
    .easing(TWEEN.Easing.Bounce.Out)
    .delay(100)
    .start()

  scene.add(logo);
}
// T-LINITYロゴ end ---------------------------------------------- //

// 波 THREE.ParametricGeometry ---- start ---- /////////////////////////
// {x:0, y:-0.2, z: -9}

//Planeをつくる
planeMaking(-0.1, 1.4, -1.3, 2.0); //上のplane
planeMaking(-0.1, 1.2, -1.1, 2.4); //上のplane
planeMaking(0, -0.4, -1.2, 2.2); //下のplane
planeMaking(0, -0.6, -1.1, 1.8); //下のplane

function planeMaking (px, py, pz, rx) {
  planeGeometry = new THREE.PlaneGeometry(5, 4, 150, 150);
  // Texture
  planeTexture = new THREE.TextureLoader().load("../img/login/login_background_line.png");
  // Material
  planeMaterial = new THREE.ShaderMaterial({
    vertexShader: document.getElementById("vertexShader").textContent, //vertexShaderを指定
    fragmentShader: document.getElementById("fragmentShader").textContent, //fragmentShaderを指定
    uniforms: { 
      //周波数。(接頭辞：prefix)にuを付けることによって、uniformだと明示
      uFrequency: {value: new THREE.Vector2(7, 6)}, 
      uTex: {type: "t", value: planeTexture},
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    // wireframe: true
  });
  // Mesh
  plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.position.set(px, py, pz);
  plane.rotation.x = Math.PI / rx;
  plane.scale.set(0.8, 0.8, 0.8);

  // Tween.js
  planeTween1 = new TWEEN.Tween(plane.rotation)
    .to({x:Math.PI / 2.4, y:Math.PI * -0.02, z:Math.PI * 0.01}, 1500)
    // .easing(TWEEN.Easing.Exponential.In)
    .start()
  planeTween2 = new TWEEN.Tween(plane.rotation)
    .to({x:Math.PI / 2.35, y:0, z:Math.PI * -0.01}, 1500)
    // .easing(TWEEN.Easing.Exponential.Out)
  planeTween3 = new TWEEN.Tween(plane.rotation)
    .to({x:Math.PI / 2.3, y:0, z:0}, 1500)
    // .easing(TWEEN.Easing.Exponential.Out)

  planeTween1.chain(planeTween2);
  planeTween2.chain(planeTween3);
  planeTween3.chain(planeTween1);

  scene.add(plane);
};

// 波 THREE.ParametricGeometry ---- end ---- /////////////////////////



// THREE.WebGLRenderer を作成する際に以下を追記
renderer.physicallyCorrectLights = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.GammaEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
// 影を有効にする
renderer.shadowMap.enabled = true;


// directionalライトを追加 /////////////////////////////////////////
directionalLight = new THREE.DirectionalLight("#ffffff", 0.8);
directionalLight.position.set(0.5, 1, 0);
// ライトを影を落とす設定にする
directionalLight.castShadow = true;
// 影の解像度を設定
directionalLight.shadow.mapSize.set(4096, 4096);
scene.add(directionalLight);

// Ambientライト
light1 = new THREE.AmbientLight(0xffffff, 0.8);
// ライトを影を落とす設定にする
directionalLight.castShadow = true;
// 色を正確に表示したいときにoutputEncodingをsRGBEncodingにする。（明るくなる）
// https://threejs.org/docs/#api/en/constants/Textures
renderer.outputEncoding = THREE.sRGBEncoding;
light1.position.set(0.5, 0.5, 0.5);
light2 = new THREE.AmbientLight(0xffffff, 0.7);
light3 = new THREE.AmbientLight(0xffffff, 0.5);
light3.position.set(0.2, 0.6, 0.6);
scene.add(light1, light2, light3);

// DOM要素の作成
createDOM();

// ブラウザのリサイズ操作
window.addEventListener("resize",
  () => {
    // 変更の差を求める
    let differenceWidth = window.innerWidth / bodySizes.width;
    let differenceHeight = window.innerHeight / bodySizes.height;
    
    // bodyサイズのアップデート
    bodySizes.width = window.innerWidth;
    bodySizes.height = window.innerHeight;

    // // レンダラーのアップデート
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // カメラのアップデート
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // CSS変数 --box-widthを変更
    document.documentElement.style.setProperty('--box-width', window.innerWidth / cssWrapperScale * differenceWidth + "px");
    // CSS変数 --box-heightを変更
    document.documentElement.style.setProperty('--box-height', window.innerHeight / cssWrapperScale * differenceHeight + "px");
  }
);

}



// DOMの作成
// CSSでinput,buttonを入れる
function createDOM () {
  cssRenderer = new CSS3DRenderer();

  document.body.appendChild(cssRenderer.domElement);
  cssLogInWrapperObj = new CSS3DObject(loginWrapper);
  cssLogInWrapperObj.position.set(0,0,0);

  // CSS変数 --box-widthを変更
  cssWrapperScale = 5.5;
  document.documentElement.style.setProperty('--box-width', window.innerWidth / cssWrapperScale + "px");
  
  scene.add(cssLogInWrapperObj);

  cssLogInWrapperObj.innerHTML =
  `
  <div class="cube_div"></div>
  <div class="container">
          <div class="mailadress">
              <input type="text" id="mail" placeholder="Mail" autocomplete="off" part="mailInput">
          </div>
          <div class="password">
              <input type="password" id="password" placeholder="Password" autocomplete="off">
          </div>
          <button id="login_button" class="login_button">
              <img src="../img/login/login_button.png" alt="LOGIN" width="80%">
          </button>
  </div>
  `;
}


//マウス座標の取得とボタンクリックイベントの変数
// let mouse, raycaster;
// let clickFlag = false;
// let moveFlag = false;
// https://www.pentacreation.com/blog/2022/02/220226.html
// マウスクリックをレイキャスターで取得、ボタンをクリックしたらロゴが跳ねる
// function setControl() {
//   mouse = new THREE.Vector2(); //マウス座標

//   // レイキャストを生成
//   raycaster = new THREE.Raycaster();
//   loginButton.addEventListener("mousemove", handleMouseMove);

//   function handleMouseMove (event) {
//     const element = event.currentTarget;

//     // canvas上のマウスのXY座標
//     const x = event.clientX - element.offsetLeft;
//     const y = event.clientY - element.offsetTop;

//     // canvasの幅と高さを取得
//     const w = element.offsetWidth;
//     const h = element.offsetHeight;

//     // マウス座標を -1 ~ 1 の範囲に変換
//     mouse.x = (x/w) * 2 - 1;
//     mouse.y = (y/h) * 2 + 1;
//   }

//   // マウスイベントを登録
//   loginButton.addEventListener('click', handleClick);

//   // ボタンクリックイベント
//   function handleClick (event) {
//     if (clickFlag) {
//       logo.position.y += 1;
//     }
//   }
// }
// // ボタンクリックのアニメーション
// function rending () {
//   requestAnimationFrame(rending);

//   raycaster.setFromCamera(mouse, camera); //マウスの位置からの光線ベクトルを生成
//   const intersects = raycaster.intersectObjects(scene.children, false); //交差したオブジェクト取得
//   //交差オブジェクトがある場合
//   if (intersects.length > 0) {
//     const obj = intersects[0].object; //交差したオブジェクトを取得
//     // 光線がボタンと交差していた場合
//     if(obj.name == loginButton) {
//       if(moveFlag) {
//         clickFlag = true;
//       }
//     } else {
//       clickFlag = false;
//     }
//   } else {
//     clickFlag = false;
//   }

//   renderer.render(scene, camera);
// };
// rending();

// アニメーション
function animate () {

  // どの端末でも同じ速さで動くようにgetDelta()を使う。
  const getElapsedTime = clock.getElapsedTime();

  // // 背景四角のアニメーション(1)
  // for (let i = 0; i < rectArray1.length; i ++) {
      
  //   if(rect[i].scale[1] == 0.01) { //上と下の場合
  //     rectArray1[i].scale.y = 0.2 * Math.sin(getElapsedTime * 5.5);
  //     rectArray1[i].position.y += 0.01 * Math.sin(getElapsedTime * 0.01);
  //   } else if(rect[i].scale[0] == 0.01) {
  //     rectArray1[i].scale.x = 0.2 * Math.cos(getElapsedTime * 5.5);
  //     rectArray1[i].position.y += 0.01 * Math.sin(getElapsedTime * 0.01);
  //   }
  //   // rectArray1[i].position.z += getElapsedTime * - 0.08;
  //   material1.opacity = 0.1 * Math.cos(getElapsedTime * 5.5) + 0.3;
  // }

  // // 背景四角のアニメーション(2)
  // for (let j = 0; j < rectArray2.length; j ++) {
    
  //   if(rect[j].scale[1] == 0.01) { //上下の場合
  //     rectArray2[j].scale.y = 0.4 * Math.sin(getElapsedTime * 5.5);

  //   } else if(rect[j].scale[0] == 0.01) { //左右の場合
  //     rectArray2[j].scale.x = 0.3 * Math.cos(getElapsedTime * 5.5);
  //     rectArray2[j].position.x += 0.01 * Math.sin(getElapsedTime * 0.01);
  //   }
  //   // rectArray2[j].position.z += getElapsedTime * - 0.12;
  //   material2.opacity = 0.5 * Math.cos(getElapsedTime * 5.5) + 0.5;
  // }

  // カメラアニメーション
//   camera.lookAt(new THREE.Vector3(0, 0, 0));

  TWEEN.update();
  renderer.render(scene, camera);
  animeId = window.requestAnimationFrame(animate);

  // 動きを止める
  // window.setTimeout(() => {
  //   cancelAnimationFrame(animeId);
  // }, 2500);
  
};

document.querySelectorAll("input").forEach((input) => {
  input.style.backgroundColor = "transparent"
})
