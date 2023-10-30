import { Flex } from "antd";
import { NavLink } from "react-router-dom";

export function NotFoundPage() {
  return (
    <Flex gap="large" style={{ padding: "24px" }} vertical>
      <h1>Oops!</h1>
      <p>The URL you requested not found!</p>
      <p>Navigate to {" "}<NavLink to="/">Home Page</NavLink></p>
    </Flex>
  );
}