import styles from "../../styles/Pop-up_windows_styles/CreateNode.module.css";
import messageImage from "../../assets/CreateNode/message.svg";
import questionImage from "../../assets/CreateNode/question.svg";
import choiceImage from "../../assets/CreateNode/choice.svg";
import conditionImage from "../../assets/CreateNode/condition.svg";
import doImage from "../../assets/CreateNode/do.svg";
import exitImage from "../../assets/CreateNode/exit.svg";
import plusImage from "../../assets/CreateNode/plus.svg";

export default function CreateNode({ onAddNode, toggleNodeList }) {
  return (
    <div className={styles.CreateNode}>
      <p>Создание блока</p>
      <ul>
        <li
          onClick={() => {
            onAddNode("message");
            toggleNodeList();
          }}
        >
          <div className={styles.NodeInfo}>
            <img src={messageImage} alt="" style={{ width: "24px" }} />
            <div>
              <p>Сообщение</p>
              <p>
                Блок для отправки пользователю текстовых сообщений, изображений
                или других медиафайлов. Поддерживает разметку текста и
                добавление кнопок для выбора вариантов ответов
              </p>
            </div>
          </div>
          <img src={plusImage} alt="" style={{ width: "14px" }} />
        </li>

        <li
          onClick={() => {
            onAddNode("textInput");
            toggleNodeList();
          }}
        >
          <div className={styles.NodeInfo}>
            <img src={questionImage} alt="" style={{ width: "24px" }} />
            <div>
              <p>Вопрос с текстовым вводом</p>
              <p>
                Блок для получения произвольного ответа пользователя в виде
                текста. Поддерживает настройку формата ожидаемого ввода и
                валидацию.
              </p>
            </div>
          </div>
          <img src={plusImage} alt="" style={{ width: "14px" }} />
        </li>

        <li
          onClick={() => {
            onAddNode("choiceButton");
            toggleNodeList();
          }}
        >
          <div className={styles.NodeInfo}>
            <img src={choiceImage} alt="" style={{ width: "24px" }} />
            <div>
              <p>Вопрос с выбором ответа</p>
              <p>
                Блок для получения ответа пользователя путем нажатия на кнопку
                из предложенного списка. Поддерживает нескольких вариантов
                выбора. Для каждого варианта задается отдельный переход к
                следующему узлу сценария. Имеется возможность задать иконку,
                текст и порядок отображения кнопок.
              </p>
            </div>
          </div>
          <img src={plusImage} alt="" style={{ width: "14px" }} />
        </li>

        <li
          onClick={() => {
            onAddNode("condition");
            toggleNodeList();
          }}
        >
          <div className={styles.NodeInfo}>
            <img src={conditionImage} alt="" style={{ width: "24px" }} />
            <div>
              <p>Условие</p>
              <p>
                Логический блок, выполняющий ветвление сценария в зависимости от
                введенных данных, состояния переменных или внешних параметров.
              </p>
            </div>
          </div>
          <img src={plusImage} alt="" style={{ width: "14px" }} />
        </li>

        <li>
          <div className={styles.NodeInfo}>
            <img
              src={doImage}
              alt=""
              style={{ width: "24px", height: "30px" }}
            />
            <div>
              <p>Действие</p>
              <p>
                Блок, выполняющий вызов внешнего API, запись данных, интеграцию
                с CRM или иными системами.
              </p>
            </div>
          </div>
          <img src={plusImage} alt="" style={{ width: "14px" }} />
        </li>

        <li
          onClick={() => {
            onAddNode("exit");
            toggleNodeList();
          }}
        >
          <div className={styles.NodeInfo}>
            <img src={exitImage} alt="" style={{ width: "24px" }} />
            <div>
              <p>Завершение сценария</p>
              <p>
                Конечный узел сценария, обозначающий окончание взаимодействия.
              </p>
            </div>
          </div>
          <img src={plusImage} alt="" style={{ width: "14px" }} />
        </li>
      </ul>
      <p className={styles.Advice}>Подсказка:<br></br>чтобы удалить блок или соединения между блоками, нажмите клавишу Backspase или delete</p>
    </div>
  );
}
