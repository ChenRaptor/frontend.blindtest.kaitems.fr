"use client"

import styles from './timer.module.css'

export default function Timer({ time, totalTime } : { time:number, totalTime:number }) {

  const jpn = totalTime/3;
  const color:any = time > 2*jpn ? "green" : time > jpn ? "yellow" : "red";

  const style = { "--currentColor":  `var(--${color})` } as React.CSSProperties;
  const gap = { "--currentOffsetDash":  Math.floor(440-(440*(time/totalTime))) } as React.CSSProperties;
  const dot = { "--transformZ": `${(Math.floor((360/totalTime)*time))}deg` } as React.CSSProperties;


  return (
    <div className={styles.time} style={style}>
      <div className={styles.circle}>
        <div className={styles.dot} style={dot}></div>
        <svg>
          <circle cx='70' cy='70' r='70'></circle>
          <circle cx='70' cy='70' r='70' style={gap}></circle>
        </svg>
        <div className={styles.sec}>{time}</div>
      </div>
    </div>
  )

}