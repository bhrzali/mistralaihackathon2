import { Outlet } from "react-router";

export default function TailwindXLayout() {
  return (
    <div>
      <h1>Tailwind experiments</h1>
      {/* will either be <Home/> or <Settings/> */}
      <Outlet />
    </div>
  );
}
