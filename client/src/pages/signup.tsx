import { LockOutlined, MailOutlined, FileTextOutlined, UserAddOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Checkbox, Flex, Form, Image, Input, QRCode, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
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
  const [enable2FA, setEnable2FA] = useState<boolean>(true);
  const [totp, setTotp] = useState<{ secret: string, uri: string }>()

  const onFinish = (values: SignupFormFields) => {
    if (totp === undefined) return;
    setLoading(true)
    setError(null)
    const options: RequestInit = {
      method: 'POST',
      body: JSON.stringify({
        name: values.name,
        email: values.email,
        password: values.password,
        totpSecret: enable2FA ? totp.secret : undefined,
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
          setError(String(output.error) ?? res.statusText)
        }
        setLoading(false)
      })
      .catch(error => {
        console.log(error)
        setError(String(error))
        setLoading(false)
      })
  };

  const loadTotp = async () => {
    setLoading(true)
    fetch('/api/auth/totp')
      .then(async res => {
        if (res.ok) {
          return res.json()
        }
        else {
          throw Error('Failed to generate TOTP. Please reload the page!')
        }
      })
      .then(data => {
        setTotp(data as { secret: string, uri: string })
        console.log(data);
        setLoading(false)
      })
      .catch(error => {
        setError(error)
        setLoading(false)
      })
  }

  useEffect(() => {
    if (!enable2FA || totp !== undefined) return;
    loadTotp();
  }, [enable2FA])

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
              { min: 3, message: 'Name should be atleast 3 characters long' },
              { max: 20, message: 'Name should be atmost 20 characters long' },
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
                validator: (_, value) => {
                  const result = validatePassword(value)
                  return result === true ? Promise.resolve()
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
          <Form.Item
            name="is2FAEnabled"
            valuePropName="checked"
            tooltip="In addition to password you will need authentication token everytime you login"
            label="Multi Factor Authentication"
            initialValue={enable2FA}
          >
            <Checkbox onChange={_ => setEnable2FA(!enable2FA)}>
              Enable 2FA using Authenticator App?
            </Checkbox>
          </Form.Item>
          {
            enable2FA && totp?.uri &&
            <Form.Item>
              <Flex gap="small" align='center' vertical>
                <QRCode value={totp.uri} />
                <Typography.Text>Scan to Add 2FA Authentication</Typography.Text>
              </Flex>
            </Form.Item>
          }
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