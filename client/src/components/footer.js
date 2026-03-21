import React from "react";
import "./footer.css";

function Footer() {
  return (
    <footer className="footer">
      <nav className="footer-links" aria-label="Alalistan linkit">
        <a href="https://rednet.punainenristi.fi/nilsia">RedNet Nilsiä</a>
        <a href="https://osastot.punainenristi.fi/osastot/nilsian-osasto">
          Osaston verkkosivut
        </a>
        <a href="https://oma.punainenristi.fi/">OMA</a>
        <a href="https://paivystykset.punainenristi.fi/">Päivystykset</a>
        <a href="https://ossi.punainenristi.fi/login">OSSI</a>
        <a href="https://materiaalipankki.punainenristi.fi/">Materiaalipankki</a>
        <a href="https://www.facebook.com/sprnilsia">Facebook</a>
        <a href="https://www.instagram.com/punainen_risti_nilsian_osasto/">
          Instagram
        </a>
      </nav>

      <div className="footer-bottom">
        © 2026 Suomen Punaisen Ristin Nilsiän osasto
      </div>
    </footer>
  );
}

export default Footer;
