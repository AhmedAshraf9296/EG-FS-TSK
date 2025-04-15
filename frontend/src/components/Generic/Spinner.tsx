import { useState, CSSProperties } from "react";
import ScaleLoader  from "react-spinners/ScaleLoader";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};
type Props = {
    loading:boolean   
}
function Spinner(props:Props) {
  let [loading, setLoading] = useState(true);
  let [color, setColor] = useState("#1C2434");

  return (
    <div className="spinner-container">
      {/* <button onClick={() => setLoading(!loading)}>Toggle Loader</button> */}
      {/* <input value={color} onChange={(input) => setColor(input.target.value)} placeholder="Color of the loader" /> */}

      <ScaleLoader
        color={color}
        loading={props.loading}
        width={15}
        // cssOverride={override}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
}

export default Spinner;