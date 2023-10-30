import { LockOutlined, MailOutlined, FileTextOutlined, UserAddOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Flex, Form, Image, Input, Typography } from 'antd';
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import undrawFingerprint from '../assets/undraw-fingerprint.svg';
import { validateEmail, validatePassword } from '../utils';

interface SignupFormFields {
  name: string;
  email: string;
  password: string;
}

export const SignUpPage: React.FC = () => {

  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const onFinish = (values: SignupFormFields) => {
    setLoading(true)
    setError(null)
    const options: RequestInit = {
      method: 'POST',
      body: JSON.stringify({
        name: values.name,
        email: values.email,
        password: values.password,
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }
    fetch('/api/auth/signup', options)
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
        console.log(error)
        setError(error)
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
        validateTrigger='onBlur'
        disabled={loading}
      >
        <Flex style={{ width: '360px' }} gap="small" vertical>
          <Form.Item>
            <Flex justify='center'>
              <Image height={100} preview={false} src={undrawFingerprint} />
            </Flex>
            <Typography.Title level={3}>
              Create your new account
            </Typography.Title>
          </Form.Item>
          <Form.Item
            name="name"
            label="Full Name"
            rules={[
              { required: true, message: 'Name can\'t be blank!' },
            ]}
          >
            <Input
              addonBefore={<FileTextOutlined />}
              placeholder="Ram..."
              size='large' />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Email can\'t be blank!' },
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
              { required: true, message: 'Password can\'t be blank!' },
              {
                validator: (_, value) =>
                  validatePassword(value)
                    ? Promise.resolve()
                    : Promise.reject("Password is Invalid"),
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
            name="password-confirm"
            label="Confirm Password"
            rules={[
              { required: true, message: 'Confirm can\'t be blank!' },
              {
                validator: (_, value) =>
                  validatePassword(value)
                    ? Promise.resolve()
                    : Promise.reject("Password is Invalid"),
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
          <Form.Item>
            <Flex justify='center'>
              <Button
                type="primary"
                htmlType="submit"
                size='large'
                icon={<UserAddOutlined />}
                loading={loading}>
                Create Account
              </Button>
            </Flex>
          </Form.Item>
          <Form.Item>
            <Typography.Text>
              Already have an account?
              {" "}
              <NavLink to='../login'>Login Here</NavLink>
            </Typography.Text>
          </Form.Item>
          {
            error &&
            <Form.Item>
              <Alert type='error' message={error} showIcon />
            </Form.Item>
          }
        </Flex>
      </Form>
    </Card>
  );
};