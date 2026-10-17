import workflowDark from "./workflow-anatomy/workflow.html?url";
import workflowLight from "./workflow-anatomy/workflow-light.html?url";
import ThemedAnatomyFigure from "./ThemedAnatomyFigure";

export default function WorkflowAutomation() {
  return (
    <ThemedAnatomyFigure
      darkSource={workflowDark}
      lightSource={workflowLight}
      title="Interactive isometric figure of AI workflow automation"
    />
  );
}
