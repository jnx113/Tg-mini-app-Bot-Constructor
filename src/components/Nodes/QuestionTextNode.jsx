import styles from "../../styles/Nodes/Nodes.module.css";
import questionImage from "../../assets/CreateNode/question.svg";
import { Handle, Position } from "@xyflow/react";
import Button from "../Button";
import { useEffect, useState } from "react";

// Нода "Вопрос с текстовым вводом" с сохранением настроек в data родителя
export default function QuestionTextNode({ id, data }) {
  // onChange приходит из ScriptEdit через data.onChange
  const onChange = data?.onChange;

  const [header, setHeader] = useState("Вопрос с текстовым вводом");
  const [question, setQuestion] = useState("");
  const [hint, setHint] = useState("");
  const [parsing, setParsing] = useState("default");
  const [inputFormat, setInputFormat] = useState("text"); // text, number, email, phone, url, date
  const [minLength, setMinLength] = useState("");
  const [maxLength, setMaxLength] = useState("");
  const [allowNewLines, setAllowNewLines] = useState(false);
  const [validation, setValidation] = useState(""); // digits, email, url, custom
  const [customRegex, setCustomRegex] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [saveVariable, setSaveVariable] = useState("");
  const [storageScope, setStorageScope] = useState("profile"); // profile | scenario

  // Синхронизируем состояние с data, если нода уже была сохранена ранее
  useEffect(() => {
    if (!data) return;

    if (data.header) setHeader(data.header);
    if (data.question) setQuestion(data.question);
    if (data.hint) setHint(data.hint);
    if (data.parsing) setParsing(data.parsing);
    if (data.inputFormat) setInputFormat(data.inputFormat);
    if (data.minLength !== undefined)
      setMinLength(String(data.minLength ?? ""));
    if (data.maxLength !== undefined)
      setMaxLength(String(data.maxLength ?? ""));
    if (typeof data.allowNewLines === "boolean")
      setAllowNewLines(data.allowNewLines);
    if (data.validation) setValidation(data.validation);
    if (data.customRegex) setCustomRegex(data.customRegex);
    if (data.errorMessage) setErrorMessage(data.errorMessage);
    if (data.saveVariable) setSaveVariable(data.saveVariable);
    if (data.storageScope) setStorageScope(data.storageScope);
  }, [data]);

  const handleSave = () => {
    const formattedData = {
      header,
      question,
      hint,
      parsing,
      inputFormat,
      minLength: minLength === "" ? null : Number(minLength),
      maxLength: maxLength === "" ? null : Number(maxLength),
      allowNewLines,
      validation,
      customRegex,
      errorMessage,
      saveVariable,
      storageScope,
    };

    onChange?.(id, formattedData);
  };

  return (
    <div className={styles.Node}>
      <p className={styles.Header}>
        <img src={questionImage} alt="" style={{ height: "16px" }} />
        <input
          type="text"
          value={header}
          onChange={(e) => setHeader(e.target.value)}
        />
      </p>
      <Handle
        type="target"
        position={Position.Left}
        id="in"
        style={{ backgroundColor: "#A2A2A2" }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="out"
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
              onChange={(e) => setQuestion(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Подсказка для пользователя</label>
            <input
              type="text"
              value={hint}
              onChange={(e) => setHint(e.target.value)}
            />
          </div>
          <div>
            <label>Парсинг разметки</label>
            <select
              value={parsing}
              onChange={(e) => setParsing(e.target.value)}
            >
              <option value="default">По умолчанию</option>
              <option value="HTML">HTML</option>
              <option value="Markdown">Markdown</option>
            </select>
          </div>
          <div>
            <label>Формат ожидаемого ввода</label>
            <select
              value={inputFormat}
              onChange={(e) => setInputFormat(e.target.value)}
            >
              <option value="text">Произвольный текст</option>
              <option value="number">Число</option>
              <option value="email">Email</option>
              <option value="phone">Телефон</option>
              <option value="url">Ссылка (URL)</option>
              <option value="date">Дата</option>
            </select>
          </div>
          <div className={styles.Length}>
            <label>Ограничения по длине</label>
            <div>
              <input
                type="number"
                placeholder="От"
                value={minLength}
                onChange={(e) => setMinLength(e.target.value)}
              />
              <input
                type="number"
                placeholder="До"
                value={maxLength}
                onChange={(e) => setMaxLength(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.Checkbox}>
            <label>Разрешать ли переносы строк</label>
            <input
              type="checkbox"
              checked={allowNewLines}
              onChange={(e) => setAllowNewLines(e.target.checked)}
              style={{ width: "10px" }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <div>
              <label>Валидация</label>
              <select
                value={validation}
                onChange={(e) => setValidation(e.target.value)}
              >
                <option value="">Без доп. валидации</option>
                <option value="digits">Только цифры</option>
                <option value="email">Соответствует email‑формату</option>
                <option value="url">Соответствует URL‑формату</option>
                <option value="custom">Кастомное regex‑правило</option>
              </select>
            </div>

            <textarea
              type="text"
              placeholder="Кастомное правило (regex)"
              value={customRegex}
              onChange={(e) => setCustomRegex(e.target.value)}
            />
          </div>

          <div>
            <label>Сообщение об ошибке</label>
            <input
              type="text"
              placeholder="Пожалуйста, введите корректное значение"
              value={errorMessage}
              onChange={(e) => setErrorMessage(e.target.value)}
            />
          </div>
          <div>
            <label>Сохранение ответа</label>
            <input
              type="text"
              placeholder="Имя переменной, в которую записывается ответ"
              value={saveVariable}
              onChange={(e) => setSaveVariable(e.target.value)}
            />
          </div>
          <div>
            <label>Область хранения</label>
            <select
              value={storageScope}
              onChange={(e) => setStorageScope(e.target.value)}
            >
              <option value="profile">В профиле пользователя</option>
              <option value="scenario">В контексте текущего сценария</option>
            </select>
          </div>

        </form>
      </div>
    </div>
  );
}
