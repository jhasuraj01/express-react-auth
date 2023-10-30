import { Alert, Button, Card, Flex, Typography } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogoutOutlined } from '@ant-design/icons';


export function HomePage() {

  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogout = () => {
    setLoading(true)
    setError(null)
    fetch('/api/auth/logout')
      .then(async res => {
        if (res.ok) {
          navigate('auth/login')
        }
        else {
          const output = await res.json();
          setError(output.error ?? res.statusText)
        }
        setLoading(false)
      })
      .catch(error => {
        setError(error)
        setLoading(false)
      })
  };
  return (
    <>
      <Flex align="center" vertical>
        <Card style={{ padding: "24px 48px"}}>
          <Flex gap="middle" vertical>
            <Typography.Title level={2}>
              Welcome to my application!!
            </Typography.Title>
            <Button
              type="primary"
              onClick={handleLogout}
              size='large'
              icon={<LogoutOutlined />}
              loading={loading}>
              Logout Securely
            </Button>
          </Flex>
        </Card>
      </Flex>

      {
        error &&
        <Alert type='error' message={error} showIcon banner />
      }
    </>
  )
}