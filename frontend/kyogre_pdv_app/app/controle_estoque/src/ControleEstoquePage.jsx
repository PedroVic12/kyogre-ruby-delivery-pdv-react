import { RouterProvider } from "react-router-dom";
import router from "./router";

export default function ControleEstoquePage() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
} 