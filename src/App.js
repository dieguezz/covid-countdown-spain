import React, {
  useLayoutEffect,
  useEffect,
  useState,
  useMemo,
  useRef,
} from "react";
import ray from "./ray2.svg";
import "./index.css";
import { gsap } from "gsap";

import { TweenLite } from "gsap/all";
import { CSSPlugin } from "gsap/CSSPlugin";

gsap.registerPlugin(CSSPlugin);

const endDate1 = new Date(2020, 3, 26);
const endDate2 = new Date(2020, 4, 11);

function useWindowSize() {
  const isClient = typeof window === "object";

  function getSize() {
    return {
      width: isClient ? window.innerWidth : undefined,
      height: isClient ? window.innerHeight : undefined,
    };
  }

  const [windowSize, setWindowSize] = useState(getSize);

  useLayoutEffect(() => {
    if (!isClient) {
      return false;
    }

    function handleResize() {
      setWindowSize(getSize());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return windowSize;
}

function ClockNumber({ name, value, isSmall }) {
  const tl = TweenLite;
  const numbers = Array.from(new Array(10)).map((i, idx) => idx);
  const [translate, setTranslate] = useState(tl.to({}, 1, { paused: true }));
  let el = useRef(null);
  const baseHeight = isSmall ? 24 : 64;
  useLayoutEffect(() => {
    setTranslate(
      tl.to(el.current, 0.1, { y: (value && value * baseHeight * -1) || 0 })
    );
  }, [value, isSmall, baseHeight, tl]);

  return (
    <div className="item">
      <div className={`numbers ${name}`} ref={el}>
        {numbers.map((n, idx) => (
          <div key={name + idx} className="number">
            {n}
          </div>
        ))}
      </div>
    </div>
  );
}

function CountDown({ isSmall, title, subtitle, timer, className }) {
  const count = useMemo(
    () => ({
      d0: timer.days.length > 1 ? timer.days.charAt(0) : 0,
      d1: timer.days.length > 1 ? timer.days.charAt(1) : timer.days.charAt(0),
      h0: timer.hours.length > 1 ? timer.hours.charAt(0) : 0,
      h1:
        timer.hours.length > 1 ? timer.hours.charAt(1) : timer.hours.charAt(0),
      m0: timer.minutes.length > 1 ? timer.minutes.charAt(0) : 0,
      m1:
        timer.minutes.length > 1
          ? timer.minutes.charAt(1)
          : timer.minutes.charAt(0),
      s0: timer.seconds.length > 1 ? timer.seconds.charAt(0) : 0,
      s1:
        timer.seconds.length > 1
          ? timer.seconds.charAt(1)
          : timer.seconds.charAt(0),
    }),
    [timer]
  );
  return (
    <div className="countdown">
      <div className="countdown-header">
        <h2>{title}</h2>
        <time>{subtitle}</time>
      </div>
      <div className={`timer ${(className && className) || ""}`}>
        <div>
          <div className="number-wrapper">
            <ClockNumber isSmall={isSmall} name="days-0" value={count.d0} />
            <ClockNumber isSmall={isSmall} name="days-1" value={count.d1} />
          </div>
          <div className="text">Días</div>
        </div>
        <div>
          <div className="number-wrapper">
            <ClockNumber isSmall={isSmall} name="hours-0" value={count.h0} />
            <ClockNumber isSmall={isSmall} name="hours-1" value={count.h1} />
          </div>
          <div className="text">Horas</div>
        </div>
        <div>
          <div className="number-wrapper">
            <ClockNumber isSmall={isSmall} name="minutes-0" value={count.m0} />
            <ClockNumber isSmall={isSmall} name="minutes-1" value={count.m1} />
          </div>
          <div className="text">Minutos</div>
        </div>
        <div>
          <div className="number-wrapper">
            <ClockNumber isSmall={isSmall} name="seconds-0" value={count.s0} />
            <ClockNumber isSmall={isSmall} name="seconds-1" value={count.s1} />
          </div>
          <div className="text">Segundos</div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const windowSize = useWindowSize();
  const [timer, setTimer] = useState([
    {
      days: "0",
      hours: "0",
      minutes: "0",
      seconds: "0",
      miliseconds: "0",
    },
    {
      days: "0",
      hours: "0",
      minutes: "0",
      seconds: "0",
      miliseconds: "0",
    },
  ]);

  useLayoutEffect(() => {
    setInterval(() => {
      const difference1 = Math.abs(endDate1 - new Date());
      const difference2 = Math.abs(endDate2 - new Date());
      setTimer((timer) => [
        {
          days: Math.ceil(difference1 / (1000 * 60 * 60 * 24)).toString(),
          hours: Math.floor(
            (difference1 % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60).toString()
          ).toString(),
          minutes: Math.floor(
            (difference1 % (1000 * 60 * 60)) / (1000 * 60)
          ).toString(),
          seconds: Math.floor((difference1 % (1000 * 60)) / 1000).toString(),
        },
        {
          days: Math.ceil(difference2 / (1000 * 60 * 60 * 24)).toString(),
          hours: Math.floor(
            (difference2 % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60).toString()
          ).toString(),
          minutes: Math.floor(
            (difference2 % (1000 * 60 * 60)) / (1000 * 60)
          ).toString(),
          seconds: Math.floor((difference2 % (1000 * 60)) / 1000).toString(),
        },
      ]);
    }, 1000);
  }, []);

  const [isSmall, setisSmall] = useState(windowSize.width < 768);
  useEffect(() => {
    if (windowSize.width < 768) {
      if (!isSmall) {
        setisSmall(true);
      }
    } else {
      if (isSmall) {
        setisSmall(false);
      }
    }
  }, [windowSize.width, isSmall]);

  return (
    <div className="content">
      <h1>¿Cuánto tiempo queda de cuarentena?</h1>
      <div className="container">
        <CountDown
          title="Último día de cuarentena:"
          subtitle="27 de abril de 2020"
          isSmall={isSmall}
          end={endDate1}
          timer={timer[0]}
        ></CountDown>
        <CountDown
          className="small red"
          isSmall
          title="Posible prórroga hasta:"
          subtitle="11 de mayo de 2020"
          end={endDate2}
          timer={timer[1]}
        ></CountDown>
      </div>
      <p>
        Datos actualizados con el último{" "}
        <a
          href="https://www.boe.es/buscar/act.php?id=BOE-A-2020-4413"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="etereo"
        >
          BOE
        </a>{" "}
        <span className="flag"></span>
      </p>
      <p>
        <span>
          <img src={ray} alt="ray"></img>
        </span>
        Powered by
        <a href="https://etereo.io" target="_blank" rel="noopener noreferrer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="50"
            height="13"
            viewBox="0 0 100 26"
          >
            <g fill="#8a8a8a" fillRule="evenodd">
              <path
                fillRule="nonzero"
                d="M4.94 19.3c.78 1.91 2.466 3.72 5.12 3.72 1.439 0 3.145-.8 4.329-2.55.069-.11.207-.15.295-.15.208 0 .267.03 1.352.67.108.06.147.16.147.27 0 .19-.118.42-.217.6-1.272 2.41-3.382 4.03-6.834 4.03C3.492 25.89 0 21.68 0 16.68c0-6.41 4.093-8.87 8.107-8.87 4.506 0 7.011 4.07 7.011 6.67 0 .2-.059.34-.276.43L4.941 19.3zm5.07-4.96c0-2.2-1.174-3.8-2.742-3.8-1.874 0-3.057 1.72-3.057 3.96 0 .68.04 1.82.316 2.64l5.483-2.8z"
              ></path>
              <path d="M29.014 22.98c.069.1.098.21.098.3 0 .16-.088.29-.266.4l-1.025.65c-1.214.77-3.087 1.57-4.774 1.57-2.11 0-3.954-1.24-3.954-5.31v-6.4c0-1.85 0-4.3-2.476-4.3-.335 0-.512-.18-.512-.52V8.33c0-.34.177-.52.512-.52h2.476V5.87c0-.28.069-.5.305-.63.987-.55 2.791-1.64 4.182-2.85.05-.04.099-.08.148-.08h.05c.039 0 .078 0 .088.06v5.44h4.556c.335 0 .513.18.513.52v1.48c0 .34-.178.52-.513.52h-4.546V20.6c0 1.79.621 2.34 1.41 2.34.78 0 1.726-.54 2.426-.98l.04-.03c.108-.07.207-.1.305-.1.158 0 .296.09.405.27l.552.88z"></path>
              <path
                fillRule="nonzero"
                d="M35.168 19.3c.779 1.91 2.465 3.72 5.118 3.72 1.44 0 3.146-.8 4.33-2.55.068-.11.206-.15.295-.15.207 0 .267.03 1.351.67.109.06.148.16.148.27 0 .19-.118.42-.217.6-1.272 2.41-3.382 4.03-6.834 4.03-5.65 0-9.142-4.21-9.142-9.21 0-6.41 4.093-8.87 8.106-8.87 4.507 0 7.012 4.07 7.012 6.67 0 .2-.059.34-.276.43l-9.891 4.39zm5.069-4.96c0-2.2-1.174-3.8-2.742-3.8-1.874 0-3.057 1.72-3.057 3.96 0 .68.04 1.82.315 2.64l5.484-2.8zM70.089 19.3c.779 1.91 2.465 3.72 5.118 3.72 1.41 0 3.067-.77 4.25-2.44.03-.04.05-.08.08-.11.069-.11.207-.15.295-.15.207 0 .267.03 1.351.67.109.06.148.16.148.27 0 .19-.118.42-.217.6-1.272 2.41-3.382 4.03-6.834 4.03-5.65 0-9.142-4.21-9.142-9.21 0-6.41 4.093-8.87 8.107-8.87 4.506 0 7.011 4.07 7.011 6.67 0 .2-.059.34-.276.43L70.09 19.3zm5.069-4.96c0-2.2-1.174-3.8-2.742-3.8-1.874 0-3.057 1.72-3.057 3.96 0 .68.04 1.82.316 2.64l5.483-2.8zM91.045 7.77c3.383 0 6.657 2.04 8.156 5.46.543 1.24.799 2.52.799 3.79 0 3.43-1.893 6.67-5.108 8.12a8.333 8.333 0 0 1-3.452.75c-3.383 0-6.657-2.05-8.156-5.47a9.52 9.52 0 0 1-.789-3.78c0-3.43 1.874-6.67 5.089-8.13a8.526 8.526 0 0 1 3.461-.74zm-4.487 6.72c0 1.28.375 2.71.957 4.03 1.075 2.45 2.9 4.61 5 4.61.444 0 .897-.1 1.36-.31 1.48-.67 2.052-2.04 2.052-3.64 0-1.28-.375-2.71-.957-4.03-1.075-2.45-2.899-4.61-5-4.61-.443 0-.897.1-1.36.31-1.47.66-2.052 2.04-2.052 3.64z"
              ></path>
              <path d="M54.95 11.49c.652-2.26 3.078-3.66 5.494-3.66 2.13 0 3.846 1.2 3.846 3.56 0 1.04-.07 1.85-.897 2.2l-3.186 1.33a.78.78 0 0 1-.306.07c-.207 0-.315-.14-.315-.33 0-.09.02-.19.069-.3.266-.66.306-1.26.306-1.73 0-1.25-.671-1.79-1.608-1.79-1.558 0-2.91 1.73-3.422 2.99v6.71c0 1.88.838 3.29 2.505 3.29h.06c.334 0 .512.18.512.52v1.04c0 .34-.178.52-.513.52h-9.891c-.336 0-.513-.18-.513-.52v-1.04c0-.34.177-.52.513-.52h.078c1.667 0 2.476-1.41 2.476-3.29V16.2c0-1.85-.128-4.11-2.012-4.32-.335-.04-.414-.21-.395-.45v-1.17c0-.29.158-.4.494-.46 3.185-.71 4.171-1.12 6.134-1.82.049-.04.394-.15.443-.15h.08c.039 0 .049.01.049.06v3.6zM36.46 4.71s-1.066 1.03-.503 1.42c.572.39 2.011.1 2.633-.19.63-.3 1.883-.81 3.254-2.24 1.351-1.41 1.016-2.62.306-3.14s-2.11-.67-2.466-.1c-.207.33-.493 1.07-1.39 2.32-.592.8-1.608 1.66-1.834 1.93z"></path>
            </g>
          </svg>
        </a>
      </p>
    </div>
  );
}
export default App;
