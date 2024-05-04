import CanvasJSReact from "../../lib/canvasjs.react";
// const CanvasJS = CanvasJSReact.CanvasJS;
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

export default function BarGraph(props) {
  const { dataPoints, title, axisY } = props;
  const options = {
    title,
    theme: "light2",
    axisY,
    data: [
      {
        // Change type to "doughnut", "line", "splineArea", etc.
        type: "column",

        dataPoints,
      },
    ],
  };
  return <CanvasJSChart options={options} />;
}
