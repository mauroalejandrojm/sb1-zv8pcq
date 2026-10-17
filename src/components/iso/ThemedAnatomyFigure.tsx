import * as React from "react";
import { useTheme } from "next-themes";

interface ThemedAnatomyFigureProps {
  darkSource: string;
  lightSource: string;
  title: string;
}

export default function ThemedAnatomyFigure({
  darkSource,
  lightSource,
  title,
}: ThemedAnatomyFigureProps) {
  const { resolvedTheme } = useTheme();
  const source = resolvedTheme === "light" ? lightSource : darkSource;
  const frame = React.useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = React.useState(480);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    setLoaded(false);
  }, [source]);

  const presentFigure = React.useCallback(() => {
    const iframe = frame.current;
    const document = iframe?.contentDocument;
    const stage = document?.querySelector<HTMLElement>(".iso-stage");
    if (!iframe?.parentElement || !document?.head || !stage) {
      console.error(`Unable to initialize isometric figure: ${title}`);
      return;
    }

    const background = window.getComputedStyle(iframe.parentElement).backgroundColor;
    const style = document.createElement("style");
    style.textContent = `
      html, body { background: ${background} !important; }
      .iso-page { width: 100% !important; max-width: none !important; margin: 0 !important; }
      .iso-figure { margin: 0 !important; }
      .iso-plate {
        padding: 0 !important;
        background: ${background} !important;
        box-shadow: none !important;
        --anatomy-paper: ${background} !important;
      }
      .iso-plate-corners, .iso-legend, .iso-ctl { display: none !important; }
    `;
    document.head.append(style);
    setHeight(Math.ceil(stage.getBoundingClientRect().height));
    setLoaded(true);
  }, []);

  React.useEffect(() => {
    if (!loaded || !frame.current?.contentDocument) return;

    const document = frame.current.contentDocument;
    const stage = document.querySelector(".iso-stage");
    if (!stage) return;
    const resize = () => {
      setHeight(Math.ceil(stage.getBoundingClientRect().height));
    };
    const observer = new ResizeObserver(resize);
    observer.observe(stage);
    resize();
    frame.current.contentWindow?.addEventListener("resize", resize);

    return () => {
      observer.disconnect();
      frame.current?.contentWindow?.removeEventListener("resize", resize);
    };
  }, [loaded, source]);

  return (
    <iframe
      key={source}
      ref={frame}
      src={source}
      title={title}
      loading="lazy"
      onLoad={presentFigure}
      className="block w-full border-0"
      style={{ height, visibility: loaded ? "visible" : "hidden" }}
    />
  );
}
