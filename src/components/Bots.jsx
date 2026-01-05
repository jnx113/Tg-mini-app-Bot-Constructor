import styles from "../styles/Bots.module.css";
import BotList from "./BotList";
import Button from "./Button";
import plusImage from "../assets/Dashboard/plus.svg";
import { Link } from "react-router-dom";
import loopImage from "../assets/Dashboard/loop.svg";
import { useState, useEffect } from "react";
import axios from "axios";
import { AuthToken } from "./auth";

export default function Bots() {
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://minutely-sisterly-smelt.cloudpub.ru/api/v1/bots/", {
        headers: {
          Authorization: `Bearer ${AuthToken}`,
        },
      })
      .then((res) => {
        setBots(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className={styles.Bots}>
      <DefaultHeader bots = {bots}/>

      <BotList bots={bots} loading={loading} token={AuthToken}/>
    </div>
  );
}

function DefaultHeader({ bots }) {
  return (
    <div>
      <div className={styles.Underline}>
        <div className={styles.BotsNavPanel}>
          <p>Боты</p>
        </div>
      </div>
      <div className={styles.Underline}>
        {bots.length > 0 ? (
          <div className={styles.BotsSearch}>
            <img
              src={loopImage}
              alt=""
              style={{ position: "absolute", top: "12px", left: "16px" }}
            />
            <input type="text" placeholder="Найти бота" />
            <Link to="/bot-settings" style={{ all: "unset" }}>
              <Button text="Добавить бота" img={plusImage} width="291px" />
            </Link>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

function AddBotsHeader() {
  return (
    <div className={styles.AddBots}>
      <p>Добавление бота</p>
    </div>
  );
}
