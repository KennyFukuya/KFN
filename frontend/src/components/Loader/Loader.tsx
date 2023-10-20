import { ThreeCircles } from "react-loader-spinner";
import colors from "../../constants/colors";

function Loader() {
  return (
    <ThreeCircles
      height="100"
      width="100"
      color={colors.dark.secondary}
      visible={true}
      ariaLabel="three-circles-rotating"
    />
  );
}

export default Loader;
