import { LockOutlined, MailOutlined, LoginOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Checkbox, Flex, Form, Image, Input, Typography } from 'antd';
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { validateEmail, validatePassword } from '../utils';
import undrawFingerprint from '../assets/undraw-fingerprint.svg';


interface LoginFormFields {
  email: string;
  password: string;
  isSessionLogin: boolean;
  totpToken: string;
}

export const LoginPage: React.FC = () => {

  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const onFinish = (values: LoginFormFields) => {
    setLoading(true)
    setError(null)
    const options: RequestInit = {
      method: 'POST',
      body: JSON.stringify({
        email: values.email,
        password: values.password,
        isSessionLogin: values.isSessionLogin,
        totpToken: values.totpToken,
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }
    fetch('/api/auth/login', options)
      .then(async res => {
        if (res.ok) {
          navigate('/')
        }
        else {
          const output = await res.json();
          setError(output.error ?? res.statusText)
        }
        setLoading(false)
      })
      .catch(error => {
        setError(String(error))
        setLoading(false)
      })
  };

  return (
    <Card>
      <Form
        name="login"
        size='middle'
        initialValues={{ remember: false }}
        onFinish={onFinish}
        style={{ padding: '24px' }}
        layout='vertical'
        disabled={loading}
      >
        <Flex style={{ width: '360px' }} gap="small" vertical>
          <Form.Item>
            <Flex justify='center'>
              <Image height={100} preview={false} src={undrawFingerprint} />
            </Flex>
            <Typography.Title level={3}>
              Login with your account
            </Typography.Title>
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input your Email!' },
              {
                validator: (_, value) =>
                  validateEmail(value)
                    ? Promise.resolve()
                    : Promise.reject("Email is Invalid"),
              },
            ]}
          >
            <Input
              addonBefore={<MailOutlined />}
              placeholder="email@example.com"
              size='large' />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please input your Password!' },
              {
                validator: (_, value) => {
                  const result = validatePassword(value)
                  return result === true  ? Promise.resolve()
                    : Promise.reject(result ?? "Invalid Password");
                }
              },
            ]}
            tooltip="Please use a combination of upper and lower case alphabets, numbers and special symbols for your password."
          >
            <Input.Password
              addonBefore={<LockOutlined />}
              placeholder="Abc@123..."
              size='large'
            />
          </Form.Item>
          <Form.Item
            name="totpToken"
            label="Authenticator App Code"
          >
            <Input.Password
              addonBefore={<LockOutlined />}
              placeholder="123456"
              size='large'
            />
          </Form.Item>
          <Form.Item
            name="isSessionLogin"
            valuePropName="checked"
            tooltip="You will be logged out once you close your browser"
            label="Session Login"
            initialValue={true}
          >
            <Checkbox>
              Logout when browser is shutdown?
            </Checkbox>
          </Form.Item>
          <Form.Item>
            <Flex justify='center'>
              <Button type="primary" htmlType="submit" size='large' icon={<LoginOutlined />} loading={loading}>Login Securely</Button>
            </Flex>
          </Form.Item>
          <Form.Item>
            <Typography.Text>
              Don't have an account?
              {" "}
              <NavLink to='../signup'>Register Here</NavLink>
            </Typography.Text>
          </Form.Item>
          {
            error &&
            <Form.Item>
              <Alert type='error' message={error} showIcon/>
            </Form.Item>
          }
        </Flex>
      </Form>
    </Card>
  );
};