import styles from "../../styles/Nodes/Nodes.module.css";
import plusImage from "../../assets/ScriptEdit/plus.svg";
import bucketImage from "../../assets/ListComp/bucket.svg";
import choiceImage from "../../assets/CreateNode/choice.svg";
import { Handle, Position } from "@xyflow/react";
import { useEffect, useState } from "react";
import Button from "../Button";

// Нода "Вопрос с выбором ответа" с сохранением данных в ScriptEdit
export default function QuestionChoice({ id, data }) {
  const [header, setHeader] = useState("Вопрос с выбором ответа");
  const [question, setQuestion] = useState("");
  const [parsing, setParsing] = useState("default");
  const [newButton, setNewButton] = useState([]);

  // onChange приходит из ScriptEdit через data.onChange
  const onChange = data?.onChange;

  // Загружаем данные из data.options и других полей
  useEffect(() => {
    if (!data) return;

    if (data.header) setHeader(data.header);
    if (data.question) setQuestion(data.question);
    if (data.parsing) setParsing(data.parsing);

    if (Array.isArray(data.options)) {
      setNewButton(
        data.options.map((opt) => ({
          id: opt.id || `opt-${Date.now()}-${Math.random()}`,
          text: opt.text || "",
          type: opt.type || "inline",
          target: opt.target || "",
        }))
      );
    }
  }, [data]);

  // Сохраняем данные в родителя
  const saveData = (
    buttonsOverride,
    headerOverride,
    questionOverride,
    parsingOverride
  ) => {
    const buttonsToUse = buttonsOverride || newButton;

    const formattedData = {
      header: headerOverride ?? header,
      question: questionOverride ?? question,
      parsing: parsingOverride ?? parsing,
      options: buttonsToUse.map((btn) => ({
        id: btn.id,
        text: btn.text,
        type: btn.type,
        target: btn.target || "",
      })),
    };

    onChange?.(id, formattedData);
  };

  const renameHeader = (value) => {
    setHeader(value);
    saveData(undefined, value, undefined, undefined);
  };

  const addButton = () => {
    const newBtn = {
      id: `opt-${Date.now()}`,
      type: "inline",
      text: "",
      target: "",
    };
    const updated = [...newButton, newBtn];
    setNewButton(updated);
    saveData(updated, undefined, undefined, undefined);
  };

  const removeButton = (idToRemove) => {
    const updated = newButton.filter((btn) => btn.id !== idToRemove);
    setNewButton(updated);
    saveData(updated, undefined, undefined, undefined);
  };

  const updateButton = (id, field, value) => {
    const updated = newButton.map((btn) =>
      btn.id === id ? { ...btn, [field]: value } : btn
    );
    setNewButton(updated);
    saveData(updated, undefined, undefined, undefined);
  };

  const handleSave = () => {
    saveData();
  };

  return (
    <div className={styles.Node}>
      <p className={styles.Header}>
        <img src={choiceImage} alt="" style={{ height: "16px" }} />
        <input
          type="text"
          value={header}
          onChange={(e) => renameHeader(e.target.value)}
        />
      </p>
      <Handle
        type="target"
        position={Position.Left}
        id="in"
        style={{ backgroundColor: "#A2A2A2" }}
      />

      <div className={styles.Message}>
        <form
          className={styles.TextQuestion}
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <div>
            <label>Введите вопрос для пользователя</label>
            <textarea
              value={question}
              onChange={(e) => {
                setQuestion(e.target.value);
                saveData(undefined, undefined, e.target.value, undefined);
              }}
            />
          </div>
          <div>
            <label>Парсинг разметки</label>
            <select
              value={parsing}
              onChange={(e) => {
                setParsing(e.target.value);
                saveData(undefined, undefined, undefined, e.target.value);
              }}
            >
              <option value="default">По умолчанию</option>
              <option value="HTML">HTML</option>
              <option value="Markdown">Markdown</option>
            </select>
          </div>

          {newButton.map((btn, index) => (
            <div className={styles.choiceButton} key={btn.id}>
              <div style={{ position: "relative" }}>
                <p>
                  Кнопка {index + 1}
                  <img
                    src={bucketImage}
                    alt=""
                    onClick={() => removeButton(btn.id)}
                    style={{ cursor: "pointer" }}
                  />
                </p>
                {/* Отдельный выход (target) для каждой кнопки */}
                <Handle
                  type="source"
                  position={Position.Right}
                  id={btn.id}
                  style={{ backgroundColor: "#A2A2A2", width: 10, height: 10 }}
                />
              </div>

              <div>
                <label>Текст кнопки</label>
                <input
                  type="text"
                  value={btn.text}
                  onChange={(e) => updateButton(btn.id, "text", e.target.value)}
                />
              </div>
              <div>
                <label>Тип кнопки</label>
                <select
                  value={btn.type}
                  onChange={(e) => updateButton(btn.id, "type", e.target.value)}
                >
                  <option value="inline">Inline‑кнопка под сообщением</option>
                  <option value="reply_markup">
                    Обычная клавиатура (reply_markup)
                  </option>
                </select>
              </div>
            </div>
          ))}
        </form>
        <button onClick={addButton} style={{ marginTop: "10px" }}>
          <img src={plusImage} alt="" />
          <span>Добавить кнопку</span>
        </button>
      </div>
    </div>
  );
}
