import styles from "../styles/Dashboard.module.css";
import filterImage from "../assets/Dashboard/filter.svg";
import loopImage from "../assets/Dashboard/loop.svg";
import plusImage from "../assets/Dashboard/plus.svg";
import ScriptList from "./ScriptList";
import returnImage from "../assets/Dashboard/re.svg";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [isArchive, setArchive] = useState(false);
  return isArchive ? (
    <ActiveScripts setArchive={setArchive} />
  ) : (
    <ArchiveScripts setArchive={setArchive} />
  );
}

function ActiveScripts({ setArchive }) {
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const toggleFilterMenu = () => {
    setShowFilterMenu(!showFilterMenu);
  };

  return (
    <div className={styles.Dashboard}>
      <div className={styles.Underline}>
        <ul className={styles.DashboardNavPanel}>
          <li className={styles.Active}>
            <button styles={{ pointerEvents: "none" }}>Сценарии</button>
          </li>
          <li>
            <button onClick={() => setArchive((prev) => !prev)}>Архив</button>
          </li>
        </ul>
      </div>
      <div className={styles.Underline}>
        <div className={styles.InputSystem}>
          <div className={styles.FindScript}>
            <div className={styles.loop}>
              <img src={loopImage} alt="" />
            </div>
            <input type="text" placeholder="Найти сценарий" />
            <button
              className={`${styles.filter} ${
                showFilterMenu ? styles.filterActive : styles.filterHidden
              }`}
              onClick={toggleFilterMenu}
            >
              <img src={filterImage} alt="Фильтр" />
            </button>
          </div>
          <Link to="/script-edit" style={{ all: "unset", display: "flex" }}>
            <button className={styles.createScript}>
              <img src={plusImage} alt="" />
              <span>Создать сценарий</span>
            </button>
          </Link>
        </div>
        {showFilterMenu && (
          <div className={styles.FilterMenu}>
            <div>
              <button className={styles.ActiveFilter}>Все</button>
              <button>Опубликован</button>
              <button>Черновик</button>
              <button>
                <img src={loopImage} alt="" style={{ height: "15px" }} />
                <span>Выбрать автора</span>
              </button>
            </div>
            <div>
              <button style={{ textAlign: "start" }}>
                <span style={{ paddingLeft: "8px" }}>дд.мм</span>
              </button>
              <button>
                <img src={returnImage} alt="" style={{ marginRight: "4px" }} />
                <span>Сбросить фильтр</span>
              </button>
              <button>Применить</button>
            </div>
          </div>
        )}
      </div>
      <ScriptList />
    </div>
  );
}

function ArchiveScripts({ setArchive }) {
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const toggleFilterMenu = () => {
    setShowFilterMenu(!showFilterMenu);
  };

  return (
    <div className={styles.Dashboard}>
      <div className={styles.Underline}>
        <ul className={styles.DashboardNavPanel}>
          <li>
            <button onClick={() => setArchive((prev) => !prev)}>
              Сценарии
            </button>
          </li>
          <li className={styles.Active}>
            <button
              style={{
                pointerEvents: "none",
              }}
            >
              Архив
            </button>
          </li>
        </ul>
      </div>
      <div className={styles.Underline}>
        <div className={styles.InputSystem}>
          <div className={styles.FindScript}>
            <div className={styles.loop}>
              <img src={loopImage} alt="" />
            </div>
            <input type="text" placeholder="Найти сценарий" />
            <button
              className={`${styles.filter} ${
                showFilterMenu ? styles.filterActive : styles.filterHidden
              }`}
              onClick={toggleFilterMenu}
            >
              <img src={filterImage} alt="Фильтр" />
            </button>
          </div>
        </div>
        {showFilterMenu && (
          <div className={styles.FilterMenu}>
            <div>
              <button className={styles.ActiveFilter}>Все</button>
              <button>Опубликован</button>
              <button>Черновик</button>
              <button>
                <img src={loopImage} alt="" style={{ height: "15px" }} />
                <span>Выбрать автора</span>
              </button>
            </div>
            <div>
              <button style={{ textAlign: "start" }}>
                <span style={{ paddingLeft: "8px" }}>дд.мм</span>
              </button>
              <button>
                <img src={returnImage} alt="" style={{ marginRight: "4px" }} />
                <span>Сбросить фильтр</span>
              </button>
              <button>Применить</button>
            </div>
          </div>
        )}
      </div>
      <ScriptList />
    </div>
  );
}
