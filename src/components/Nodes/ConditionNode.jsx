import styles from "../../styles/Nodes/Nodes.module.css";
import plusImage from "../../assets/ScriptEdit/plus.svg";
import bucketImage from "../../assets/ListComp/bucket.svg";
import conditionImage from "../../assets/CreateNode/condition.svg";
import Button from "../../components/Button";
import { Handle, Position } from "@xyflow/react";
import { useEffect, useState } from "react";

export default function ConditionNode({ id, data }) {
  const [variable, setVariable] = useState("");
  const [systemField, setSystemField] = useState("");
  const [dataType, setDataType] = useState("string");
  const [stopOnFirst, setStopOnFirst] = useState(false);
  const [conditions, setConditions] = useState([
    { id: `cond-${Date.now()}`, operator: "==", value: "" },
  ]);
  const [elseMessage, setElseMessage] = useState("");

  // onChange приходит из ScriptEdit через data.onChange
  const onChange = data?.onChange;

  // Загружаем сохранённые данные при монтировании / изменении data
  useEffect(() => {
    if (!data) return;

    setVariable(data.variable || "");
    setSystemField(data.system_field || "");
    setDataType(data.data_type || "string");
    setStopOnFirst(data.stop_on_first_match || false);
    setConditions(
      data.conditions && data.conditions.length > 0
        ? data.conditions
        : [{ id: `cond-${Date.now()}`, operator: "==", value: "" }]
    );
    setElseMessage(data.else_message || "");
  }, [data]);

  const addCondition = () => {
    const newCond = { id: `cond-${Date.now()}`, operator: "==", value: "" };
    const next = [...conditions, newCond];
    setConditions(next);
    saveData({ conditions: next });
  };

  const removeCondition = (idToRemove) => {
    const next = conditions.filter((c) => c.id !== idToRemove);
    setConditions(next);
    saveData({ conditions: next });
  };

  const updateCondition = (idCond, field, value) => {
    const next = conditions.map((c) =>
      c.id === idCond ? { ...c, [field]: value } : c
    );
    setConditions(next);
    saveData({ conditions: next });
  };

  // Сохранение данных в родителя
  const saveData = (overrides = {}) => {
    const payload = {
      variable: overrides.variable ?? variable,
      system_field: overrides.systemField ?? systemField,
      data_type: overrides.dataType ?? dataType,
      stop_on_first_match: overrides.stopOnFirst ?? stopOnFirst,
      conditions: overrides.conditions ?? conditions,
      else_message: overrides.elseMessage ?? elseMessage,
    };

    onChange?.(id, payload);
  };

  return (
    <div className={styles.Node}>
      <p className={styles.Header}>
        <img src={conditionImage} alt="" style={{ height: "16px" }} />
        <span>Условие</span>
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
        id="else"
        style={{ backgroundColor: "#FF9800" }}
      />

      <div className={styles.Message}>
        <form className={styles.TextQuestion}>
          <div>
            <label>Переменная сценария</label>
            <input
              value={variable}
              onChange={(e) => {
                const v = e.target.value;
                setVariable(v);
                saveData({ variable: v });
              }}
            />
          </div>

          <div>
            <label>Системное поле</label>
            <input
              value={systemField}
              onChange={(e) => {
                const v = e.target.value;
                setSystemField(v);
                saveData({ systemField: v });
              }}
            />
          </div>

          <div>
            <label>Тип данных переменной</label>
            <select
              value={dataType}
              onChange={(e) => {
                const v = e.target.value;
                setDataType(v);
                saveData({ dataType: v });
              }}
            >
              <option value="string">Строка</option>
              <option value="integer">Число</option>
              <option value="bool">Булево</option>
              <option value="datetime">Дата/Время</option>
            </select>
          </div>

          <div>
            <label>Останавливать проверку на первом сработавшем условии</label>
            <input
              type="checkbox"
              checked={stopOnFirst}
              onChange={(e) => {
                const v = e.target.checked;
                setStopOnFirst(v);
                saveData({ stopOnFirst: v });
              }}
            />
          </div>

          {conditions.map((cond, index) => (
            <div className={styles.choiceButton} key={cond.id}>
              <div>
                <p>
                  Условие {index + 1}
                  <img
                    src={bucketImage}
                    alt=""
                    onClick={() => removeCondition(cond.id)}
                    style={{ cursor: "pointer" }}
                  />
                  <Handle
                    key={cond.id}
                    type="source"
                    position={Position.Right}
                    id={cond.id}
                    style={{ backgroundColor: "#4CAF50" }}
                  />
                </p>
              </div>

              <div>
                <label>Оператор</label>
                <select
                  value={cond.operator}
                  onChange={(e) => {
                    updateCondition(cond.id, "operator", e.target.value);
                  }}
                >
                  <option value="==">Равно</option>
                  <option value="!=">Не равно</option>
                  <option value=">">Больше</option>
                  <option value="<">Меньше</option>
                  <option value="contains">Содержит</option>
                </select>
              </div>

              <div>
                <label>Значение</label>
                <input
                  type="text"
                  value={cond.value}
                  onChange={(e) => {
                    updateCondition(cond.id, "value", e.target.value);
                  }}
                />
              </div>
            </div>
          ))}

          <label>Ветка Иначе</label>
          <p>Если ни одно условие не подошло, перейти в блок...</p>
          <div>
            <label>Опциональный текст пользователю</label>
            <textarea
              value={elseMessage}
              onChange={(e) => {
                const v = e.target.value;
                setElseMessage(v);
                saveData({ elseMessage: v });
              }}
            />
          </div>
        </form>

        <button type="button" onClick={addCondition}>
          <img src={plusImage} alt="" />
          <span>Добавить условие</span>
        </button>

        <Button text="Сохранить" onClick={saveData} />
      </div>
    </div>
  );
}
