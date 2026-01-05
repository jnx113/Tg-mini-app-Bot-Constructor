import styles from "../styles/Script.module.css";
import archiveImage from "../assets/ListComp/archive.svg";
import bucketImage from "../assets/ListComp/bucket.svg";
import copyImage from "../assets/ListComp/copy.svg";
import pencilImage from "../assets/ListComp/pencil.svg";
import { Link } from "react-router-dom";

export default function Script() {
  return (
    <li className={styles.Script}>
      <div className={styles.Header}>
        <p>План по захвату Польши</p>
        <p>Статус</p>
        <Link to="/script-edit" style={{ marginLeft: "auto" }}>
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
      <div className={styles.Description}>
        <p>Бот: Босс КФС</p>
        <p>Статус: черновик</p>
        <p>Дата: 13.10.2025</p>
      </div>
      <div className={styles.Interact}>
        <div>
          <img
            src={bucketImage}
            alt="Удалить сценарий"
            title="Удалить сценарий"
            className={styles.Icons}
          />
          <img
            src={copyImage}
            alt="Скопировать сценарий"
            title="Скопировать сценарий"
            className={styles.Icons}
          />
        </div>
        <div>
          <img
            src={archiveImage}
            alt="Архивировать сценарий"
            title="Архивировать сценарий"
            className={styles.Icons}
          />
          <button className={styles.Button}>Опубликовать</button>
        </div>
      </div>
    </li>
  );
}
