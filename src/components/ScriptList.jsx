import Script from "./Script";
import styles from "../styles/ScriptList.module.css";


export default function ScriptList() {
  return (
    <ul className={styles.ScriptList}>
      <Script />
      <Script />
    </ul>
  );
}
