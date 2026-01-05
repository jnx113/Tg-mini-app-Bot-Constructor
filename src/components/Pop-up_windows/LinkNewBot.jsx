import styles from "../../styles/Pop-up_windows_styles/LinkNewBot.module.css";
import plusImage from "../../assets/Dashboard/plus.svg";
import Button from "../Button";
import { useState } from "react";

export default function LinkNewBot() {
  const [openWindow, setOpenWindow] = useState(false);

  return (
    <div>
      {openWindow ? (
        <OpenWindow setOpenWindow={setOpenWindow} />
      ) : (
        <AddNewBot setOpenWindow={setOpenWindow} />
      )}
    </div>
  );
}

function AddNewBot({ setOpenWindow }) {
  return (
    <div className={styles.EmptyBotNotif}>
      <p>У вас еще нет подключенных ботов</p>
      <Button
        text="Добавить бота"
        width="291px"
        img={plusImage}
        onClick={() => setOpenWindow((prev) => !prev)}
      />
    </div>
  );
}

function OpenWindow({ setOpenWindow }) {
  const [token, setToken] = useState("");
  const [linkScripts, setLinkScripts] = useState(false);

  return (
    <div className={styles.LinkBot}>
      <p>Подключить бота</p>
      <div>
        {linkScripts ? (
          <div className={styles.ScriptWithBot}>
            <p>Чтобы подключить бота, выберите сценарий</p>
            <select name="scripts" id="scripts" placeholder="Выбрать сценарий" className={styles.SelectScript}>
              <option value="none" className={styles.SelectScriptItem}>Выбрать сценарий</option>
              <option value="Захватываем Польшу" className={styles.SelectScriptItem}>Захватываем Польшу</option>
              <option value="Не захватываем Польшу" className={styles.SelectScriptItem}>Не захватываем Польшу</option>
            </select>
            <p>Или</p>
            <p>Создайте новый сценарий</p>
            <Button text="Создать сценарий" img={plusImage} />
          </div>
        ) : (
          <div className={styles.PushToken}>
            <p>
              Откройте{" "}
              <a href="#" style={{ color: "#0768DE", textDecoration: "none" }}>
                @BotFather
              </a>{" "}
              в telegram, нажмите <span>/start.</span>
              Введите команду <span>/newbot</span> и следуйте инструкциям. Если
              бот уже был создан, введите команду <span>/mybots</span> и
              выберите бота.Когда бот будет создан, вы получите сообщение с
              токеном.
            </p>
            <p>Токен бота Telegram</p>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="210987654321:AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRr"
              maxLength={39}
            />
          </div>
        )}

        <div className={styles.BotButtons}>
          <Button
            text="Отмена"
            width="203px"
            isOutline
            onClick={() => setOpenWindow((prev) => !prev)}
          />
          <Button
            text="Подключить"
            width="203px"
            isDisabled={token.length < 39}
            onClick={() => setLinkScripts((prev) => !prev)}
          />
        </div>
      </div>
    </div>
  );
}
