import "./Footer.scss";

import { Link } from "react-router-dom";
import React from "react";

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="row mb-5">
          <div className="col-lg-3 col-6">
            <h2>About bcd.ng</h2>
            <ul>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/privacy-policy">Terms and Conditions</Link>
              </li>
              <li>
                <Link to="/privacy-policy">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/return-policy">Return Policy</Link>
              </li>
            </ul>
          </div>
          <div className="col-lg-3 col-6">
            <h2>Help and Support</h2>
            <ul>
              <li>
                <Link to="/how-to-shop">How to shop on bcd.ng</Link>
              </li>
              <li>
                <Link to="/delivery-timelines">Delivery Timelines</Link>
              </li>
              <li>
                <Link to="/complaint">Report a Product</Link>
              </li>
              <li>
                <Link to="/help-center">Help Center</Link>
              </li>
            </ul>
          </div>
          <div className="col-lg-3 col-6">
            <h2>Our Services</h2>
            <ul>
              <li>
                <a
                  href="https://tradersofafrica.com/source-pro"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  SourcePro
                </a>
              </li>
              <li>
                <Link to="/trade-financing">Trade Financing (ATI)</Link>
              </li>
              <li>
                <Link to="/bulk-purchases">Bulk Purchases</Link>
              </li>
              <li>
                <Link to="/insurance">Insurance</Link>
              </li>
            </ul>
          </div>
          <div className="col-lg-3 col-6">
            <h2>Partnerships</h2>
            <ul>
              <li>
                <a
                  href="https://merchant.bcd.ng"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Become a Seller on bcd.ng
                </a>
              </li>
              <li>
                <a href="/">Become a Logistics Partner</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <h3>Payment, Insurance and Logistics Partners</h3>
            <img
              className="img-fluid partner-logo"
              src="/img/partners/flutter.svg"
              alt="flutter"
            />
            <img
              className="img-fluid partner-logo"
              src="/img/partners/mansard.svg"
              alt="mansard"
            />
            <img
              className="img-fluid partner-logo"
              src="/img/partners/etranzact.svg"
              alt="etransact"
            />
            <img
              className="img-fluid partner-logo"
              src="/img/partners/speedaf.svg"
              alt="speedaf"
            />
            <img
              className="img-fluid partner-logo"
              src="/img/partners/courier.svg"
              alt="courier"
            />
          </div>
        </div>
        <div className="line"></div>
        <div className="row">
          <div className="col-lg-6 col-12">
            <p className="copyright">
              ©2020 BCD.ng. All Rights Reserved | Powered by Traders of Africa -
              TOFA
            </p>
          </div>
          <div className="col-lg-6 col-12 flex-end">
            <a
              href="https://www.facebook.com/BCDng-102098291541636"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                className="img-fluid social-logo"
                src="/img/fb2.svg"
                alt="facebook"
              />
            </a>
            <a
              href="https://twitter.com/bcd_ng_"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                className="img-fluid social-logo"
                src="/img/tw.svg"
                alt="twitter"
              />
            </a>
            <a
              href="https://www.instagram.com/bcd_ng/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                className="img-fluid social-logo"
                src="/img/ig.svg"
                alt="instagram"
              />
            </a>
            <a
              href="https://www.linkedin.com/company/bcd-ng/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                className="img-fluid social-logo"
                src="/img/li.svg"
                alt="linkedin"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
