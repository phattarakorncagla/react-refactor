import React from "react";
import { Helmet } from "react-helmet";
import "../public/css/reset.css";
import "../public/css/common.css";
import "../public/css/graphManagement.css";

const NotFoundPage: React.FC = () => {
    return (
      <div id="404_body" className="unselectable">
        <Helmet>
          <meta charSet="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Page Not Found</title>
          <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600&display=swap" rel="stylesheet" />
          <link
            rel="stylesheet"
            href="https://use.fontawesome.com/releases/v5.15.4/css/all.css"
            integrity="sha384-DyZ88mC6Up2uqS4h/KRgHuoeGwBcD4Ng9SiP4dIRy0EXTlnuz47vAwmeGwVChigm"
            crossOrigin="anonymous"
          />
          <link rel="icon" href="../public/img/icon/favicon.ico" />
          <script src="../public/js/common.js"></script>
        </Helmet>
        <header className="header">
          <div className="logo_container">
            <div className="logo"></div>
          </div>
          <div className="header_content">
            <div className="search_condition_container" id="search_condition_container"></div>
          </div>
        </header>
        <div className="content_container">
          <div className="content">
            <div className="content_body">
              <div className="content_body_container">
                <div className="content_body_container_header">
                  <div className="content_body_container_header_title">404 Not Found</div>
                </div>
                <div className="content_body_container_body">
                  <div className="content_body_container_body_content">
                    <div className="content_body_container_body_content_text">
                      The page you are looking for does not exist.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default NotFoundPage;