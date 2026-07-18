import { RouterProvider } from "react-router-dom";
import { useBootstrapAuth } from "./app/use-bootstrap-auth";
import { router } from "./routes/router";

function App() {
  useBootstrapAuth();
  return <RouterProvider router={router} />;
}

export default App;
