import React, { useEffect } from 'react'
import logo from './assets/images/eu.jfif';
import { useTranslation } from 'react-i18next';
import { Trans } from 'react-i18next'
import AOS from "aos";
import "aos/dist/aos.css";
import './App.css';

import linkedin from './assets/images/linkedin.png'
import instagram from './assets/images/instagram.png'
import twitter from './assets/images/twitter.svg'
import mail from './assets/images/mail.svg'
import twitch from './assets/images/twitch.svg'
import github from './assets/images/github.svg'

const App = () => {
  const { t } = useTranslation()

  useEffect(() => {
    AOS.init();
    AOS.refresh();
  }, []);

  return (
    <div className="App">
      <div className="user-card">
        <figure data-aos="fade-right" data-aos-duration="1000">
          <img src={logo} className="App-logo" alt="logo" />
        </figure>

        <div className="user-card__info">
          <h1 data-aos="fade-up" data-aos-duration="1000">{t('name')}</h1>
          <p data-aos="fade-up" data-aos-duration="1300">
            <Trans i18nKey="description">
              <strong>Javascript</strong><a href="https://www.instagram.com/zeldris.fubinha/" target="_blank" rel="noreferrer">gatos</a>
            </Trans>
          </p>
          <ul className="social-networks" data-aos="fade-up" data-aos-duration="1500">
            <li><a href="https://www.linkedin.com/in/ismaelezequiel/" target="_blank" rel="noreferrer"><img alt="linkedin" src={linkedin} /></a></li>
            <li><a href="mailto:contato@ismaelezequiel.com.br" target="_blank" rel="noreferrer"><img alt="mail" src={mail} /></a></li>
            <li><a href="https://github.com/ismaelezequiel" target="_blank" rel="noreferrer"><img alt="github" src={github} /></a></li>
            <li><a href="https://twitter.com/Ismael_Ezequiel" target="_blank" rel="noreferrer"><img alt="twitter" src={twitter} /></a></li>
            <li><a href="https://www.twitch.tv/ismaelezequiel182" target="_blank" rel="noreferrer"><img alt="twitch" src={twitch} /></a></li>
            <li><a href="https://www.instagram.com/ismaelezequiel182/" target="_blank" rel="noreferrer"><img alt="instagram" src={instagram} /></a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App
