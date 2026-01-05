// MessageNode.jsx
import styles from "../../styles/Nodes/Nodes.module.css";
import plusImage from "../../assets/ScriptEdit/plus.svg";
import bucketImage from "../../assets/ListComp/bucket.svg";
import messageImage from "../../assets/CreateNode/message.svg";
import { Handle, Position } from "@xyflow/react";
import { useState, useEffect, useRef } from "react";

export default function MessageNode({ id, data }) {
  const [header, setHeader] = useState("Сообщение");
  const [messages, setMessages] = useState([]);
  const [buttons, setButtons] = useState([]);

  // Флаг для отслеживания, обновляем ли мы данные сами
  const isUpdatingRef = useRef(false);
  // Храним предыдущее значение data для сравнения
  const prevDataRef = useRef(null);

  // Получаем onChange из data, так как ReactFlow передает его туда
  const onChange = data?.onChange;

  // Загружаем данные из data только при реальных изменениях извне
  useEffect(() => {
    // Если мы сами обновляем данные, пропускаем синхронизацию
    if (isUpdatingRef.current) {
      isUpdatingRef.current = false;
      prevDataRef.current = JSON.stringify(data);
      return;
    }

    // Проверяем, действительно ли данные изменились
    const dataString = JSON.stringify(data);
    if (prevDataRef.current === dataString) {
      return; // Данные не изменились
    }
    prevDataRef.current = dataString;

    const newHeader = data.header || "Сообщение";
    const newMessages = data.messages || [
      {
        id: `msg-${Date.now()}`,
        type: "text",
        content: "",
        parsing: "default",
        media_type: "",
        media_url: "",
      },
    ];
    const newButtons = data.buttons || [];

    // Обновляем состояние
    setHeader(newHeader);
    setMessages(newMessages);
    setButtons(newButtons);
  }, [data]);

  // Сохраняем данные в data родителя
  const saveData = (newHeader, newMessages, newButtons) => {
    const currentHeader = newHeader !== undefined ? newHeader : header;
    const currentMessages = newMessages !== undefined ? newMessages : messages;
    const currentButtons = newButtons !== undefined ? newButtons : buttons;

    const formattedData = {
      header: currentHeader,
      messages: currentMessages.map((msg) => {
        if (msg.type === "text") {
          return {
            type: "text",
            content: msg.content,
            parsing: msg.parsing,
          };
        } else if (msg.type === "media") {
          return {
            type: "media",
            media_type: msg.media_type,
            media_url: msg.media_url,
            caption: msg.content,
            parsing: msg.parsing,
          };
        }
        return msg;
      }),
      buttons: currentButtons.map((btn) => ({
        id: btn.id,
        text: btn.text,
        type: btn.type,
      })),
    };

    // Устанавливаем флаг, что мы сами обновляем данные
    isUpdatingRef.current = true;
    onChange?.(id, formattedData);
  };

  const addMessage = () => {
    const newMessage = {
      id: `msg-${Date.now()}`,
      type: "text",
      content: "",
      parsing: "default",
      media_type: "",
      media_url: "",
    };
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    saveData(undefined, newMessages, undefined);
  };

  const removeMessage = (idToRemove) => {
    const newMessages = messages.filter((msg) => msg.id !== idToRemove);
    setMessages(newMessages);
    saveData(undefined, newMessages, undefined);
  };

  const updateMessage = (id, field, value) => {
    const newMessages = messages.map((msg) =>
      msg.id === id ? { ...msg, [field]: value } : msg
    );
    setMessages(newMessages);
    saveData(undefined, newMessages, undefined);
  };

  const addButton = () => {
    const newId = `btn-${Date.now()}`;
    const newButtons = [
      ...buttons,
      {
        id: newId,
        text: "Новая кнопка",
        type: "inline",
      },
    ];
    setButtons(newButtons);
    saveData(undefined, undefined, newButtons);
  };

  const removeButton = (idToRemove) => {
    const newButtons = buttons.filter((btn) => btn.id !== idToRemove);
    setButtons(newButtons);
    saveData(undefined, undefined, newButtons);
  };

  const updateButton = (id, field, value) => {
    const newButtons = buttons.map((btn) =>
      btn.id === id ? { ...btn, [field]: value } : btn
    );
    setButtons(newButtons);
    saveData(undefined, undefined, newButtons);
  };

  return (
    <div className={styles.Node}>
      <p className={styles.Header}>
        <img src={messageImage} alt="" style={{ height: "16px" }} />
        <input
          type="text"
          value={header}
          onChange={(e) => {
            const newHeader = e.target.value;
            setHeader(newHeader);
            saveData(newHeader, undefined, undefined);
          }}
        />
      </p>

      {/* Вход в блок */}
      <Handle
        type="target"
        position={Position.Left}
        id="in"
        style={{ background: "#A2A2A2" }}
      />
      {/* Выход из блока (если нет кнопок) */}
      {buttons.length === 0 && (
        <Handle
          type="source"
          position={Position.Right}
          id="out"
          style={{ background: "#4CAF50" }}
        />
      )}

      {/* Сообщения */}
      <div className={styles.newMessages}>
        {messages.map((msg) => (
          <form key={msg.id} className={styles.Message}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "5px",
              }}
            >
              <select
                value={msg.type}
                onChange={(e) => {
                  updateMessage(msg.id, "type", e.target.value);
                }}
              >
                <option value="text">Текстовое сообщение</option>
                <option value="media">Медиа-файл</option>
              </select>
              <img
                src={bucketImage}
                alt=""
                style={{ cursor: "pointer" }}
                onClick={() => removeMessage(msg.id)}
              />
            </div>

            {msg.type === "text" && (
              <div className={styles.Text}>
                <textarea
                  value={msg.content}
                  onChange={(e) => {
                    updateMessage(msg.id, "content", e.target.value);
                  }}
                  placeholder="Введите текст"
                />
                <label>Парсинг разметки</label>
                <select
                  value={msg.parsing}
                  onChange={(e) => {
                    updateMessage(msg.id, "parsing", e.target.value);
                  }}
                >
                  <option value="default">По умолчанию</option>
                  <option value="HTML">HTML</option>
                  <option value="Markdown">Markdown</option>
                </select>
              </div>
            )}

            {msg.type === "media" && (
              <div className={styles.Media}>
                <label>Тип медиа</label>
                <select
                  value={msg.media_type}
                  onChange={(e) => {
                    updateMessage(msg.id, "media_type", e.target.value);
                  }}
                >
                  <option value="photo">Фото</option>
                  <option value="video">Видео</option>
                  <option value="document">Документ</option>
                </select>

                <label>Ссылка на файл</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={msg.media_url}
                  onChange={(e) => {
                    updateMessage(msg.id, "media_url", e.target.value);
                  }}
                />

                <label>Подпись</label>
                <textarea
                  value={msg.content}
                  onChange={(e) => {
                    updateMessage(msg.id, "content", e.target.value);
                  }}
                  placeholder="Подпись к медиа"
                />

                <label>Парсинг подписи</label>
                <select
                  value={msg.parsing}
                  onChange={(e) => {
                    updateMessage(msg.id, "parsing", e.target.value);
                  }}
                >
                  <option value="default">По умолчанию</option>
                  <option value="HTML">HTML</option>
                  <option value="Markdown">Markdown</option>
                </select>
              </div>
            )}
          </form>
        ))}
      </div>

      <button onClick={addMessage}>
        <img src={plusImage} alt="" />
        <span>Добавить сообщение</span>
      </button>

      {/* Кнопки */}
      <div className={styles.Message}>
        {buttons.map((btn) => (
          <div key={btn.id} className={styles.choiceButton}>
            <div style={{ position: "relative" }}>
              <p>
                Кнопка
                <img
                  src={bucketImage}
                  alt=""
                  style={{ cursor: "pointer" }}
                  onClick={() => removeButton(btn.id)}
                />
              </p>
              <Handle
                type="source"
                position={Position.Right}
                id={btn.id}
                style={{ background: "#A2A2A2", width: 10, height: 10 }}
              />
            </div>
            <div>
              <input
                type="text"
                value={btn.text}
                placeholder="Текст кнопки"
                onChange={(e) => {
                  updateButton(btn.id, "text", e.target.value);
                }}
              />
            </div>
            <div>
              <select
                value={btn.type}
                onChange={(e) => {
                  updateButton(btn.id, "type", e.target.value);
                }}
              >
                <option value="inline">Inline‑кнопка под сообщением</option>
                <option value="reply_markup">
                  Обычная клавиатура (reply_markup)
                </option>
              </select>
            </div>
          </div>
        ))}
      </div>

      <button onClick={addButton}>
        <img src={plusImage} alt="" />
        <span>Добавить кнопку</span>
      </button>
    </div>
  );
}
