import React from 'react';
import styles from './Footer.module.css'; // Import the footer CSS module

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerSection}>
          <h4>Further Info</h4>
          <ul>
            <li><a href="#about">About Us</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#support">Support</a></li>
          </ul>
        </div>
        <div className={styles.footerSection}>
          <h4>Credits</h4>
          <p>© 2024 Optimism Voting Strategy. All rights reserved.</p>
        </div>
        <div className={styles.footerSection}>
          <h4>Contact Us</h4>
          <div className={styles.footerIcons}>
            <a href="https://blockchain.stanford.edu/" target="_blank" rel="noopener noreferrer">
              <img src="/SBC.jpg" alt="Website" />
            </a>
            <a href="https://github.com/Stanford-Blockchain-Club" target="_blank" rel="noopener noreferrer">
              <img src="/GitHub.png" alt="GitHub" />
            </a>
            <a href="https://x.com/StanfordCrypto" target="_blank" rel="noopener noreferrer">
              <img src="/X.png" alt="Twitter" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
