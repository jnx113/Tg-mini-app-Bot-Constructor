import userImage from "../assets/NavPanel/user-image.svg";
import botImage from "../assets/NavPanel/bot.svg";
import botImageActive from "../assets/NavPanel/botActive.svg";
import scriptImage from "../assets/NavPanel/script.svg";
import scriptImageActive from "../assets/NavPanel/scriptActive.svg";
import settingsImage from "../assets/NavPanel/settings.svg";
import settingsImageActive from "../assets/NavPanel/settingsActive.svg";
import styles from "../styles/NavPanel.module.css";
import { Router } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";

export default function NavPanel() {
  const location = useLocation();

  // Функция для проверки активной кнопки
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <ul className={styles.NavPanel}>
      <div>
        <img src={userImage} alt="" />
      </div>
      <ul className={styles.buttonsList}>
        <li className={`${styles.button} ${isActive('/dashboard')? styles.activeButton: ""}`}>
          <Link to="/dashboard" className={styles.button}>
            <img src={`${isActive('/dashboard')? scriptImageActive: scriptImage}`} alt="" />
            <span>Сценарии</span>
          </Link>
        </li>
        <li className={`${styles.button} ${isActive('/bots')? styles.activeButton: ""}`}>
          <Link to="/bots" className={styles.button}>
            <img src={`${isActive('/bots')? botImageActive: botImage}`} alt="" />
            <span>Боты</span>
          </Link>
        </li>
        <li className={`${styles.button} ${isActive('/integrations')? styles.activeButton: ""}`}>
          <Link to="/integrations" className={styles.button}>
            <img src={`${isActive('/integrations')? settingsImageActive: settingsImage}`} alt="" />
            <span>Интеграции</span>
          </Link>
        </li>
      </ul>
    </ul>
  );
}
