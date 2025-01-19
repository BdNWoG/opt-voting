import React from 'react';
import styles from './Footer.module.css'; // Import the footer CSS module

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerSection}>
          <h4>Maintained By</h4>
          <a href="https://blockchain.stanford.edu/" target="_blank" rel="noopener noreferrer">
            Stanford Blockchain Club
          </a>
        </div>
        <div className={styles.footerSection}>
          <h4>Acknowledgements</h4>
          <p>Research work supported by Optimism Foundation.</p>
        </div>
        <div className={styles.footerSection}>
          <h4>Contact Us</h4>
          <div className={styles.footerIcons}>
            <a href="https://blockchain.stanford.edu/" target="_blank" rel="noopener noreferrer">
              <img src="/SBC.png" alt="Website" />
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
