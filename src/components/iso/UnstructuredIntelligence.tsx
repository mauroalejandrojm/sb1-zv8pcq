import intelDark from "./unstructured-anatomy/intel.html?url";
import intelLight from "./unstructured-anatomy/intel-light.html?url";
import ThemedAnatomyFigure from "./ThemedAnatomyFigure";

export default function UnstructuredIntelligence() {
  return (
    <ThemedAnatomyFigure
      darkSource={intelDark}
      lightSource={intelLight}
      title="Interactive isometric figure of unstructured data intelligence"
    />
  );
}
