import { Alert } from "antd";
import { useEffect, useState } from "react"
import { LoadingOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";

interface SecuredComponentsProps {
  children: React.ReactNode | React.ReactNode[]
}
export function UnSecuredComponents({ children }: SecuredComponentsProps) {
  
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAuthenticatedUser = async () => {
    setLoading(true)
    setError(null)
    fetch('/api/auth/user')
      .then(async res => {
        if (res.ok) {
          navigate('/');
        }
        else {
          setError(null);
        }
        setLoading(false)
      })
      .catch(error => {
        setError(error)
        setLoading(false)
      })
  };

  useEffect(() => {
    fetchAuthenticatedUser();
  }, [])


  if(loading) {
    return (
      <LoadingOutlined />
    )
  }

  if(error) {
    return (
      <Alert type='error' message={error} showIcon />
    )
  }

  return (
    <>
      {children}
    </>
  )
}