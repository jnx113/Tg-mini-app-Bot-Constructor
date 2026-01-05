import exitImage from "../assets/BotsSettings/back.svg";
import botImage from "../assets/BotsSettings/botImage.svg";
import pencilImage from "../assets/ListComp/pencil.svg";
import { useParams } from "react-router-dom";
import Button from "./Button";
import styles from "../styles/BotsSettings.module.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { AuthToken } from "./auth";

export default function BotSettings() {
  const { id } = useParams();
  const [bot, setBot] = useState(null);
  const [name, setName] = useState("");
  const [contacts, setContacts] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);
  const activateBot = status !== "inactive";

  useEffect(() => {
    axios
      .get(`https://minutely-sisterly-smelt.cloudpub.ru/api/v1/bots/${id}/`, {
        headers: {
          Authorization: `Bearer ${AuthToken}`,
        },
      })
      .then((r) => {
        setBot(r.data);
        setName(r.data.name ?? "");
        setDescription(r.data.description ?? "");
        setContacts(r.data.contacts ?? "");
        setStatus(r.data.status ?? null);
        console.log(bot);
      });
  }, [id]);

  // Логика активации/деактивации бота

  const toggleActivateBot = async () => {
    const nextStatus = activateBot ? "inactive" : "active";
    await axios.put(
      `https://minutely-sisterly-smelt.cloudpub.ru/api/v1/bots/${id}/`,
      { status: nextStatus },
      { headers: { Authorization: `Bearer ${AuthToken}` } }
    );
    setStatus(nextStatus);
  };

  // Логика сохранения изменений в боте

  const saveChanges = async () => {
    try {
      setSaving(true);

      await axios.put(
        `https://minutely-sisterly-smelt.cloudpub.ru/api/v1/bots/${id}/`,
        {
          name,
          description,

        },
        {headers: { Authorization: `Bearer ${AuthToken}`}}
      );
    } catch(e) {
      console.error(e);
    } finally{
      setSaving(false);
    }
  }

  if (!bot) return <div>Loading...</div>;
  return (
    <div className={styles.BotSettings}>
      <div className={styles.Header}>
        <Link to="/bots">
          <img src={exitImage} alt="" title="Назад" />
        </Link>
        <p>{`Настройки ${name}`}</p>
      </div>
      <div>
        <div className={styles.Information}>
          <img src={botImage} alt="" />
          <div className={styles.Cosmetic}>
            <form action="">
              <div>
                <label for="bot-name">Имя бота</label>
                <input
                type="text"
                value={name}
                name="bot-name"
                id="bot-name"
                onChange={(e) => setName(e.target.value)}/>
                <img src={pencilImage} alt="" style={{ width: "24px" }} />
              </div>
              <div>
                <label for="bot-description">Описание бота</label>
                <input
                  type="text"
                  value={description}
                  name="bot-description"
                  id="bot-description"
                  onChange={(e) => setDescription(e.target.value)}
                />
                <img src={pencilImage} alt="" style={{ width: "24px" }} />
              </div>
              <div>
                <label for="bot-contacts">Контакты</label>
                <input
                  type="text"
                  name="bot-contacts"
                  id="bot-contacts"
                  value={contacts}
                  onChange={(e) => setContacts(e.target.value)}
                />
                <img src={pencilImage} alt="" style={{ width: "24px" }} />
              </div>
            </form>
            <div className={styles.Activation}>
              <p>{`Бот ${activateBot ? "активен" : "не активен"}`}</p>
              <div>
                <Button
                  text="Активировать"
                  width="291px"
                  onClick={toggleActivateBot}
                />
                <Button isOutline text="Удалить" width="96px" color="#ffffff" />
              </div>
            </div>
          </div>
          <div className={styles.Settings}>
            <div>
              <p>Токен бота</p>
              <p className={styles.Token}>{bot.token}</p>
            </div>
            <div className={styles.World}>
              <div>
                <p>Язык</p>
                <select name="" id="">
                  <option value="Русский">Русский</option>
                  <option value="Английский">Английский</option>
                </select>
              </div>
              <div>
                <p>Часовой пояс</p>
                <select name="" id="">
                  <option value="Москва, UTC+3">Москва, UTC+3</option>
                  <option value="Екатеринбург, UTC+5">
                    Екатеринбург, UTC+5
                  </option>
                  <option value="Калининград, UTC+2">Калининград, UTC+2</option>
                  <option value="Иркутск, UTC+8">Иркутск, UTC+8</option>
                </select>
              </div>
            </div>
            <Button text="Сохранить изменения" onClick={saving ? undefined : saveChanges}/>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
}
