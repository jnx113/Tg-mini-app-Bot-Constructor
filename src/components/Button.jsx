import styles from "../styles/Button.module.css"

export default function Button({ text, width, img, color, isOutline, isDisabled, onClick }) {
  return (
    <button
      onClick={onClick}
      className={styles.Button}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '5px',
        width: width,
        backgroundColor: isOutline? color : "#252525",
        border: isOutline? '1px solid #252525': 'none',
        height: "38px",
        borderRadius: "6px",
        color: isOutline? '#252525': '#ffffff',
        boxSizing: 'border-box',
        boxShadow: '0 0 6px 0 #E3E3E3',
        opacity: isDisabled? '0.6': '1',
        cursor: isDisabled? 'not-allowed': 'pointer',
        pointerEvents: isDisabled? 'none': 'all'
      }}
    >
      {img ? <img src={img} alt="" style={{height: '10px'}}/> : ""}
      {text}
    </button>
  );
}
