import styles from "../../styles/Nodes/Nodes.module.css";
import plusImage from "../../assets/ScriptEdit/plus.svg";
import bucketImage from "../../assets/ListComp/bucket.svg";
import Button from "../../components/Button";
import { Handle, Position } from "@xyflow/react";
import { useEffect, useState } from "react";

export default function StartNode({ id, data }) {
  const [commands, setCommands] = useState([]);

  // ReactFlow передаёт колбэк изменения ноды внутрь data
  const onChange = data?.onChange;

  // Загружаем команды из data.commands
  useEffect(() => {
    if (Array.isArray(data?.commands) && data.commands.length > 0) {
      // Поддерживаем как формат строк, так и объектов
      setCommands(
        data.commands.map((cmd) =>
          typeof cmd === "string"
            ? {
                id: crypto.randomUUID(),
                command: cmd || "/start",
              }
            : {
                id: cmd.id || crypto.randomUUID(),
                command: cmd.command || "/start",
              }
        )
      );
    } else {
      // По умолчанию одна команда /start
      setCommands([
        {
          id: crypto.randomUUID(),
          command: "/start",
        },
      ]);
    }
  }, [data?.commands]);

  const addCommand = () => {
    setCommands((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        command: "",
      },
    ]);
  };

  const removeCommand = (idToRemove) => {
    setCommands((prev) => prev.filter((cmd) => cmd.id !== idToRemove));
  };

  const handleChange = (id, value) => {
    setCommands((prev) =>
      prev.map((cmd) => (cmd.id === id ? { ...cmd, command: value } : cmd))
    );
  };

  const handleSave = () => {
    let cleanedCommands = commands
      .map((cmd) => cmd.command.trim())
      .filter((cmd) => cmd !== "");

    // Гарантируем, что в данных всегда есть хотя бы /start
    if (cleanedCommands.length === 0) {
      cleanedCommands = ["/start"];
      setCommands([
        {
          id: crypto.randomUUID(),
          command: "/start",
        },
      ]);
    }

    onChange?.(id, {
      commands: cleanedCommands,
    });
  };

  return (
    <div className={styles.Node}>
      <p className={styles.Header}>Начало сценария</p>
      <div>
        <p>Добавьте</p>
        <p>Команду запуска</p>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="out"
        style={{ backgroundColor: "#A2A2A2" }}
      />

      <div className={styles.NewCommands}>
        {commands.map((cmd) => (
          <div className={styles.Command} key={cmd.id}>
            <input
              type="text"
              placeholder="Введите команду"
              value={cmd.command}
              onChange={(e) => handleChange(cmd.id, e.target.value)}
            />
            <img
              src={bucketImage}
              alt=""
              style={{ height: "15px", paddingRight: "5px", cursor: "pointer" }}
              onClick={() => removeCommand(cmd.id)}
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
