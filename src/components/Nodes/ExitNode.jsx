import styles from "../../styles/Nodes/Nodes.module.css";
import plusImage from "../../assets/ScriptEdit/plus.svg";
import exitImage from "../../assets/CreateNode/exit.svg";
import bucketImage from "../../assets/ListComp/bucket.svg";
import { Handle, Position } from "@xyflow/react";
import { useEffect, useState } from "react";
import Button from "../../components/Button";

// Нода завершения сценария для Telegram‑бота
// Позволяет задать команды/метки завершения и сохранить их в схему
export default function ExitNode({ id, data }) {
  const [commands, setCommands] = useState([]);

  // onChange приходит из ScriptEdit через data.onChange
  const onChange = data?.onChange;

  // Загружаем команды из data.commands, если они уже сохранены
  useEffect(() => {
    if (Array.isArray(data?.commands)) {
      setCommands(data.commands);
    } else {
      setCommands([]);
    }
  }, [data]);

  const addCommand = () => {
    setCommands((prev) => [...prev, ""]);
  };

  const removeCommand = (indexToRemove) => {
    setCommands((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleChange = (index, value) => {
    setCommands((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  const handleSave = () => {
    const cleaned = commands.map((c) => c.trim()).filter((c) => c !== "");

    onChange?.(id, {
      commands: cleaned,
    });
  };

  return (
    <div className={styles.Node}>
      <p className={styles.Header}>
        <img src={exitImage} alt="" style={{ height: "16px" }} />
        <span>Завершение сценария</span>
      </p>

      {/* Вход в ноду завершения */}
      <Handle
        type="target"
        position={Position.Left}
        id="in"
        style={{ backgroundColor: "#A2A2A2" }}
      />

      <div className={styles.NewCommands}>
        {commands.map((val, index) => (
          <div className={styles.Command} key={index}>
            <input
              type="text"
              placeholder="Введите команду /метку завершения"
              value={val}
              onChange={(e) => handleChange(index, e.target.value)}
            />
            <img
              src={bucketImage}
              alt=""
              style={{
                height: "15px",
                paddingRight: "5px",
                cursor: "pointer",
              }}
              onClick={() => removeCommand(index)}
            />
          </div>
        ))}
      </div>

      <button onClick={addCommand}>
        <img src={plusImage} alt="" />
        <span>Добавить команду</span>
      </button>

    </div>
  );
}
