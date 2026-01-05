import styles from "../styles/ScriptList.module.css";
import BotItem from "../components/BotItem";
import LinkNewBot from "./Pop-up_windows/LinkNewBot";


export default function BotList({bots, loading, AuthToken}) {
  if (loading){
    return <p>Загрузка...</p>
  }
  return (
    <ul className={styles.ScriptList}>
      {bots.length == 0 ? (
        <LinkNewBot />
      ) : (
        bots.map((bot) => (
          <BotItem
            name={bot.name}
            description={bot.description}
            status={bot.status}
            AuthToken={AuthToken}
            id= {bot.id}
          />
        ))
      )}
    </ul>
  );
}
