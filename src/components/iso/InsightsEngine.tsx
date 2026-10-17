import insightDark from "./insight-anatomy/insight.html?url";
import insightLight from "./insight-anatomy/insight-light.html?url";
import ThemedAnatomyFigure from "./ThemedAnatomyFigure";

export default function InsightsEngine() {
  return (
    <ThemedAnatomyFigure
      darkSource={insightDark}
      lightSource={insightLight}
      title="Interactive isometric figure of an insight engine"
    />
  );
}
