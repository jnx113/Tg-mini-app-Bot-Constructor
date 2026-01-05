import pencilImage from "../assets/ListComp/pencil.svg";
import backImage from "../assets/BotsSettings/back.svg";
import plusImage from "../assets/ScriptEdit/plus.svg";
import plusBlock from "../assets/Dashboard/plus.svg";
import styles from "../styles/ScriptEdit.module.css";
import CreateNode from "../components/Pop-up_windows/CreateNode";
import { useCallback, useState, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  addEdge,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import StartNode from "./Nodes/StartNode";
import MessageNode from "./Nodes/MessageNode";
import QuestionTextNode from "./Nodes/QuestionTextNode";
import QuestionChoice from "./Nodes/QuestionChoice";
import ConditionNode from "./Nodes/ConditionNode";
import ExitNode from "./Nodes/ExitNode";
import axios from "axios";
import { AuthToken } from "./auth";

const nodeTypes = {
  start: StartNode,
  message: MessageNode,
  textInput: QuestionTextNode,
  choiceButton: QuestionChoice,
  condition: ConditionNode,
  exit: ExitNode,
};

export default function ScriptEdit() {
  const { id: scriptId } = useParams(); // ID сценария из URL (если есть)
  const [searchParams] = useSearchParams(); // Query параметры
  const [openNodeList, isOpenNodeList] = useState(false);
  const [loading, setLoading] = useState(false);

  // ============================================
  // ФЛАГ ДЛЯ ТЕСТИРОВАНИЯ
  // Установите в true, чтобы использовать тестовые данные вместо API
  // ============================================
  const USE_TEST_DATA = true; // Измените на true для тестирования

  const toggleNodeList = () => {
    isOpenNodeList(!openNodeList);
  };

  const initialNodes = [
    {
      id: "1",
      position: { x: 250, y: 100 },
      type: "start",
      data: {
        commands: ["/start"],
        // onChange добавим чуть позже через useEffect, когда будет доступен handleNodeChange
      },
    },
  ];

  const initialEdges = [];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Генератор id: message → message, message_1, message_2...
  const generateNodeId = (type, existingNodes) => {
    if (type === "start") return "start";

    const ids = existingNodes
      .filter((n) => n.type === type)
      .map((n) => n.id)
      .filter((id) => id.startsWith(type));

    if (ids.length === 0) return type;

    const numbers = ids
      .map((id) => {
        const match = id.match(new RegExp(`^${type}_(\\d+)$`));
        return match ? parseInt(match[1], 10) : -1;
      })
      .filter((n) => n >= 0);

    const maxNumber = numbers.length > 0 ? Math.max(...numbers) : -1;
    const nextNumber = maxNumber + 1;

    return `${type}_${nextNumber}`;
  };

  const onAddNode = (type) => {
    let newNode;

    if (type === "start") {
      const existingStart = nodes.find((n) => n.type === "start");
      if (existingStart) return;

      newNode = {
        id: "start",
        position: { x: 250, y: 100 },
        type: "start",
        data: {
          commands: ["/start"],
          onChange: handleNodeChange, // ← передаём onChange
        },
      };
    } else {
      const newId = generateNodeId(type, nodes);

      // Начальные данные для разных типов
      let initialData = {};

      if (type === "message") {
        initialData = {
          header: "Сообщение",
          messages: [
            {
              id: `msg-${Date.now()}`,
              type: "text",
              content: "",
              parsing: "default",
              media_type: "",
              media_url: "",
            },
          ],
          buttons: [],
          onChange: handleNodeChange,
        };
      } else if (type === "textInput") {
        initialData = {
          header: "Ввод текста",
          placeholder: "Введите текст...",
          next: "",
        };
      } else if (type === "choiceButton") {
        initialData = {
          header: "Выбор",
          options: [{ id: `opt-${Date.now()}`, text: "Вариант 1", target: "" }],
        };
      } else if (type === "condition") {
        initialData = {
          header: "Условие",
          variable: "",
          conditions: [{ id: `cond-${Date.now()}`, value: "", target: "" }],
        };
      } else if (type === "exit") {
        initialData = {
          header: "Выход",
          text: "Сценарий завершён",
        };
      }
      // Для exit и других простых нод можно не передавать onChange, если они не редактируют data

      newNode = {
        id: newId,
        position: { x: 200, y: 200 },
        type,
        data: {
          ...initialData,
          onChange: handleNodeChange, // ← передаём onChange всем, кто может его использовать
        },
      };
    }

    setNodes((nds) => nds.concat(newNode));
  };

  const handleNodeChange = useCallback(
    (nodeId, newData) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? {
                ...node,
                data: {
                  ...node.data,
                  ...newData,
                },
              }
            : node
        )
      );
    },
    [setNodes]
  );

  /**
   * Функция для преобразования данных с бэкенда в формат ReactFlow
   *
   * @param {Object} backendData - Данные с бэкенда в формате:
   * {
   *   nodes: [
   *     {
   *       id: "1",
   *       type: "start",
   *       position: { x: 250, y: 100 },
   *       data: { commands: ["/start"] }
   *     },
   *     {
   *       id: "message",
   *       type: "message",
   *       position: { x: 603, y: 15 },
   *       data: {
   *         header: "Сообщение",
   *         messages: [{ type: "text", content: "Йоу", parsing: "default" }],
   *         buttons: [{ id: "btn-1", text: "Йоу", type: "inline" }]
   *       }
   *     }
   *   ],
   *   edges: [
   *     { id: "e1", source: "1", target: "message" }
   *   ]
   * }
   *
   * Пример использования:
   * const data = { nodes: [...], edges: [...] };
   * loadFlowFromBackend(data);
   *
   * Или из JSON строки:
   * const jsonString = '{"nodes": [...], "edges": [...]}';
   * loadFlowFromBackend(JSON.parse(jsonString));
   */
  const loadFlowFromBackend = useCallback(
    (backendData) => {
      if (!backendData || !backendData.nodes) {
        console.warn("Некорректные данные с бэкенда: отсутствуют nodes");
        return;
      }

      if (!Array.isArray(backendData.nodes)) {
        console.warn(
          "Некорректные данные с бэкенда: nodes должен быть массивом"
        );
        return;
      }

      // Преобразуем узлы
      const transformedNodes = backendData.nodes.map((node) => {
        const baseNode = {
          id: node.id,
          type: node.type,
          position: node.position || { x: 250, y: 100 },
          data: {
            ...node.data,
            onChange: handleNodeChange, // Добавляем onChange callback
          },
        };

        // Нормализуем данные для разных типов узлов
        if (node.type === "message") {
          // Убеждаемся, что у каждого сообщения есть id
          const normalizedMessages = (node.data.messages || []).map(
            (msg, index) => ({
              ...msg,
              id: msg.id || `msg-${Date.now()}-${index}`,
              // Добавляем недостающие поля
              parsing: msg.parsing || "default",
              media_type: msg.media_type || "",
              media_url: msg.media_url || "",
            })
          );

          // Убеждаемся, что у каждой кнопки есть id
          const normalizedButtons = (node.data.buttons || []).map(
            (btn, index) => ({
              ...btn,
              id: btn.id || `btn-${Date.now()}-${index}`,
              type: btn.type || "inline",
            })
          );

          baseNode.data = {
            ...baseNode.data,
            header: node.data.header || "Сообщение",
            messages:
              normalizedMessages.length > 0
                ? normalizedMessages
                : [
                    {
                      id: `msg-${Date.now()}`,
                      type: "text",
                      content: "",
                      parsing: "default",
                      media_type: "",
                      media_url: "",
                    },
                  ],
            buttons: normalizedButtons,
          };
        } else if (node.type === "start") {
          baseNode.data = {
            ...baseNode.data,
            commands: node.data.commands || ["/start"],
          };
        } else if (node.type === "exit") {
          baseNode.data = {
            ...baseNode.data,
            header: node.data.header || "Выход",
            text: node.data.text || "Сценарий завершён",
          };
        } else if (node.type === "textInput") {
          baseNode.data = {
            ...baseNode.data,
            header: node.data.header || "Ввод текста",
            placeholder: node.data.placeholder || "Введите текст...",
            next: node.data.next || "",
          };
        } else if (node.type === "choiceButton") {
          // Нормализуем опции
          const normalizedOptions = (node.data.options || []).map(
            (opt, index) => ({
              ...opt,
              id: opt.id || `opt-${Date.now()}-${index}`,
              text: opt.text || "Вариант",
              target: opt.target || "",
            })
          );

          baseNode.data = {
            ...baseNode.data,
            header: node.data.header || "Выбор",
            options:
              normalizedOptions.length > 0
                ? normalizedOptions
                : [{ id: `opt-${Date.now()}`, text: "Вариант 1", target: "" }],
          };
        } else if (node.type === "condition") {
          // Нормализуем условия
          const normalizedConditions = (node.data.conditions || []).map(
            (cond, index) => ({
              ...cond,
              id: cond.id || `cond-${Date.now()}-${index}`,
              value: cond.value || "",
              target: cond.target || "",
            })
          );

          baseNode.data = {
            ...baseNode.data,
            header: node.data.header || "Условие",
            variable: node.data.variable || "",
            conditions:
              normalizedConditions.length > 0
                ? normalizedConditions
                : [{ id: `cond-${Date.now()}`, value: "", target: "" }],
          };
        }

        return baseNode;
      });

      // Преобразуем связи (edges)
      const transformedEdges = (backendData.edges || []).map((edge, index) => ({
        id: edge.id || `e${Date.now()}-${index}`,
        source: edge.source,
        target: edge.target,
        type: "smoothstep", // Тип связи по умолчанию
      }));

      // Валидация: проверяем, что все source и target существуют
      const nodeIds = new Set(transformedNodes.map((n) => n.id));
      const validEdges = transformedEdges.filter((edge) => {
        const isValid = nodeIds.has(edge.source) && nodeIds.has(edge.target);
        if (!isValid) {
          console.warn(
            `Связь ${edge.id} ссылается на несуществующий узел: source=${edge.source}, target=${edge.target}`
          );
        }
        return isValid;
      });

      // Устанавливаем узлы и связи
      setNodes(transformedNodes);
      setEdges(validEdges);

      console.log(
        `Загружено узлов: ${transformedNodes.length}, связей: ${validEdges.length}`
      );
    },
    [handleNodeChange, setNodes, setEdges]
  );

  // Загрузка сценария с бэкенда при монтировании компонента
  useEffect(() => {
    // ============================================
    // ТЕСТОВЫЕ ДАННЫЕ (для тестирования без бэкенда)
    // Установите USE_TEST_DATA = true выше, чтобы использовать эти данные
    // ============================================
    const testData = {
      nodes: [
        {
          id: "1",
          type: "start",
          position: { x: 250, y: 100 },
          data: {
            commands: ["/start"],
          },
        },
        {
          id: "message",
          type: "message",
          position: { x: 603.2927139122813, y: 15.711393031025182 },
          data: {
            header: "Сообщение",
            messages: [
              {
                type: "text",
                content: "Йоу",
                parsing: "default",
              },
            ],
            buttons: [
              {
                id: "btn-1767469640240",
                text: "Йоу",
                type: "inline",
              },
            ],
          },
        },
        {
          id: "exit",
          type: "exit",
          position: { x: 1169.7369825700482, y: 146.50397789232431 },
          data: {
            header: "Выход",
            text: "Сценарий завершён",
          },
        },
      ],
      edges: [
        {
          id: "e1",
          source: "1",
          target: "message",
        },
        {
          id: "e2",
          source: "message",
          target: "exit",
        },
      ],
    };

    // Если включен режим тестирования, используем тестовые данные
    if (USE_TEST_DATA) {
      console.log("Используются тестовые данные");
      loadFlowFromBackend(testData);
      return;
    }
    // ============================================

    // Проверяем, есть ли данные в query параметре (для тестирования)
    const jsonData = searchParams.get("data");
    if (jsonData) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(jsonData));
        loadFlowFromBackend(parsedData);
        return;
      } catch (error) {
        console.error("Ошибка парсинга JSON из query параметра:", error);
      }
    }

    // Если есть scriptId, загружаем сценарий с бэкенда
    if (scriptId) {
      setLoading(true);
      // Загрузка с бэкенда через API
      axios
        .get(
          `https://minutely-sisterly-smelt.cloudpub.ru/api/v1/scripts/${scriptId}/`,
          {
            headers: {
              Authorization: `Bearer ${AuthToken}`,
            },
          }
        )
        .then((response) => {
          loadFlowFromBackend(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Ошибка загрузки сценария:", error);
          setLoading(false);
        });
    }
  }, [scriptId, searchParams, loadFlowFromBackend, USE_TEST_DATA]);

  // Функция для загрузки данных из JSON (можно вызвать извне)
  // Пример использования:
  // const scriptData = { nodes: [...], edges: [...] };
  // loadFlowFromBackend(scriptData);

  // Также можно загрузить из JSON строки:
  // const jsonString = '{"nodes": [...], "edges": [...]}';
  // loadFlowFromBackend(JSON.parse(jsonString));

  // Гарантируем, что у всех узлов всегда есть onChange callback
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          onChange: handleNodeChange,
        },
      }))
    );
  }, [setNodes, handleNodeChange]);

  // Сохранение схемы
  const saveFlow = () => {
    // Очищаем data от onChange
    const cleanNodes = nodes.map((node) => {
      const { onChange: _onChange, ...cleanData } = node.data;
      return {
        id: node.id,
        type: node.type,
        position: node.position,
        data: cleanData,
      };
    });

    // Преобразуем edges в формат бэка
    const cleanEdges = edges.map((edge, index) => ({
      id: `e${index + 1}`,
      source: edge.source,
      target: edge.target,
    }));

    const flowData = {
      nodes: cleanNodes,
      edges: cleanEdges,
    };

    console.log("Схема для бэка:", JSON.stringify(flowData, null, 2));

    // Здесь отправляешь на бэк
    // fetch("/api/save-flow", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(flowData),
    // });
  };

  useEffect(() => {
    console.log("nodes обновились:", nodes);
  }, [nodes]);

  return (
    <div className={styles.ScriptEdit} style={{ width: "100%" }}>
      {openNodeList && (
        <CreateNode onAddNode={onAddNode} toggleNodeList={toggleNodeList} />
      )}
      <div className={styles.AddBlock}>
        <button
          onClick={toggleNodeList}
          className={openNodeList ? styles.OpenNodeList : styles.CloseNodeList}
        >
          <img
            src={plusBlock}
            alt=""
            style={{ width: "32px", marginLeft: "2px", marginTop: "3px" }}
          />
        </button>
        <p className={openNodeList ? styles.HideText : styles.ShowText}>
          Добавить блок
        </p>
      </div>
      <div
        className={`${styles.Panel} ${openNodeList ? styles.Dark : ""}`}
      ></div>
      <div className={styles.NavPanel}>
        <div>
          <Link to="/dashboard">
            <img src={backImage} alt="" />
          </Link>
          <p>Название сценария</p>
          <img src={pencilImage} alt="" />
        </div>
        <div></div>
        <div>
          <button style={{ width: "131px" }} onClick={saveFlow}>
            Сохранить
          </button>
          <button
            style={{
              width: "164px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img src={plusImage} alt="" />
            <span>Подключить бота</span>
          </button>
          <button style={{ width: "131px" }}>Опубликовать</button>
        </div>
      </div>
      <div
        className={styles.Canvas}
        style={{
          height: "calc(100vh - 90px)",
          pointerEvents: `${openNodeList ? "none" : "all"}`,
        }}
      >
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <p>Загрузка сценария...</p>
          </div>
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background />
            <Controls />
          </ReactFlow>
        )}
      </div>
    </div>
  );
}
