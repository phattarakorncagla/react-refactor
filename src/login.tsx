import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import loginBackground from "../public/img/login/login_background.jpg";
import loginButton from "../public/img/login/login_button.png";
import "../public/css/reset.css";
import "../public/css/login.css";

const LoginPage: React.FC = () => {
    useEffect(() => {
      // vertexShader
      const script1 = document.createElement("script");
      script1.type = "x-shader/x-vertex";
      script1.id = "vertexShader";
      script1.text = `
        uniform vec2 uFrequency;
        varying vec2 vUv;

        // attribute vec3 position;
        
        // 頂点座標を決める
        void main() {
            vUv = uv;
            vec4 modelPosition = modelMatrix * vec4(position, 1.0);
        
            // 波の形を表すsin()
            // modelPosition.z += sin(modelPosition.x * 10.0) * 0.1;
            modelPosition.z += sin(modelPosition.x * uFrequency.x) * 0.2;
            modelPosition.z += sin(modelPosition.y * uFrequency.y) * 0.2;
        
            // z座標を手前に0.3動かした
            //modelPosition.z += 0.3;
        
            // y座標を上に0.3動かした
            // modelPosition.y += 0.3;
        
            // x座標を右に0.3動かした
            // modelPosition.x += 0.3;
        
            vec4 viewPosition = viewMatrix * modelPosition;
            vec4 projectionPosition = projectionMatrix * viewPosition;
            gl_Position = projectionPosition;
            // gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
        }
      `;
      document.body.appendChild(script1);
  
      // fragmentShader
      const script2 = document.createElement("script");
      script2.type = "x-shader/x-fragment";
      script2.id = "fragmentShader";
      script2.text = `
        varying vec2 vUv;
        uniform sampler2D uTex;
        void main() {
            gl_FragColor = texture2D(uTex, vUv);
            //gl_FragColor = vec4(0.1, 0.9, 0.8, 0.8); //rgbaを表現している
        }
      `;
      document.body.appendChild(script2);
  
      // Tween.js
      const script3 = document.createElement("script");
      script3.src = "/lib/Tween.js";
      script3.async = true;
      document.body.appendChild(script3);
  
      const script4 = document.createElement("script");
      script4.src = "/js/login.js";
      script4.type = "module";
      script4.async = true;
      document.body.appendChild(script4);
  
      const script5 = document.createElement("script");
      script5.src = "/js/login_three.js";
      script5.type = "module";
      script5.async = true;
      document.body.appendChild(script5);
  
      return () => {
        document.body.removeChild(script1);
        document.body.removeChild(script2);
        document.body.removeChild(script3);
        document.body.removeChild(script4);
        document.body.removeChild(script5);
      };
    }, []);

  return (
    <div id="loginBody">
      <Helmet>
        <meta charSet="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Login</title>
        <link rel="icon" href="../img/icon/favicon.ico" />
      </Helmet>
      <div className="background-container">
        <img src={loginBackground} alt="背景画像" />
      </div> {/* /.background-container */}
      {/* Three.js 背景 */}
      <canvas className="body_canvas"></canvas>
      <div className="login_wrapper">
        <div className="cube_div"></div>
        <div className="container">
          <div className="mailadress">
            <input
              type="text"
              id="mail"
              placeholder="Mail"
              autoComplete="off"
              part="mailInput"
            />
          </div>
          <div className="password">
            <input
              type="password"
              id="password"
              placeholder="Password"
              autoComplete="off"
            />
          </div>
          <button id="login_button" className="login_button">
            <img src={loginButton} alt="LOGIN" width="80%" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;