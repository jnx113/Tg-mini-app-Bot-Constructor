import styles from "../styles/Script.module.css";
import pencilImage from "../assets/ListComp/pencil.svg";
import botImage from "../assets/ListComp/botImage.svg";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthToken } from "./auth";

export default function BotItem({ name, description, status, id }) {
  const [loading, setLoading] = useState(false);
  const [activateBot, setActivateBot] = useState(
    status == "inactive" ? false : true
  );
  const toggleActivateBot = async () => {
    const nextActive = !activateBot;
    const nextStatus = nextActive ? "active" : "inactive";

    try {
      setLoading(true)
      await axios.put(
        `https://minutely-sisterly-smelt.cloudpub.ru/api/v1/bots/${id}/`,
        { status: nextStatus },
        {
          headers: {
            Authorization: `Bearer ${AuthToken}`,
          },
        }
      );
      setActivateBot(nextActive);
      console.log(activateBot);
    } catch (e) {
      console.error(e);
    } finally{
      setLoading(false);
    }
  };

  return (
    <li className={styles.Script}>
      <div className={`${styles.Header} ${styles.HeaderBots}`}>
        <p>{name}</p>
        <p>Язык</p>
        <p style={{ textAlign: "center" }}>Часовой пояс</p>
        <Link to={`/bot-settings/${id}`} style={{ marginLeft: "auto" }}>
          <button>
            <img
              src={pencilImage}
              alt="Редактировать сценарий"
              title="Редактировать сценарий"
              className={styles.Icons}
            />
          </button>
        </Link>
      </div>
      <div className={styles.BotDescription}>
        <div>
          <img src={botImage} alt="Аватарка бота" />
          <p>{description}</p>
        </div>
        <p
          style={{
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          RU
        </p>
        <p
          style={{
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Москва, UTC+3
        </p>
        <div className={styles.BotActivation} onClick={loading ? undefined : toggleActivateBot}>
          <p>{activateBot ? "Активен" : "Не активен"}</p>
          <div
            className={`${
              activateBot ? styles.turnOnBack : styles.turnOffBack
            }`}
          >
            <div
              className={`${
                activateBot ? styles.turnOnCircle : styles.turnOffCircle
              }`}
            ></div>
          </div>
        </div>
      </div>
    </li>
  );
}
