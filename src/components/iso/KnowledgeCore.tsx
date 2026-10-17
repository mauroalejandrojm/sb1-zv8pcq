import ragDark from "./rag-anatomy/rag.html?url";
import ragLight from "./rag-anatomy/rag-light.html?url";
import ThemedAnatomyFigure from "./ThemedAnatomyFigure";

export default function KnowledgeCore() {
  return (
    <ThemedAnatomyFigure
      darkSource={ragDark}
      lightSource={ragLight}
      title="Interactive isometric figure of a retrieval-augmented knowledge system"
    />
  );
}
