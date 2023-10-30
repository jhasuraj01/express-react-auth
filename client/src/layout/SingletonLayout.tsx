import { Flex } from "antd";
import { Outlet } from "react-router-dom";

export function SingletonLayout() {

  const styles: React.CSSProperties = {
    minHeight: '100vh',
    padding: '24px',
    boxSizing: 'border-box',
  }

  return (
    <Flex align="center" justify="center" style={styles}>
        <Outlet />
    </Flex>
  );
}