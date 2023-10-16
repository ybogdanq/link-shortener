import UserService from "app/services/UserService";
import { IUserResponse } from "app/types/User";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const withAuth = (Component: any) => {
  const AuthenticatedComponent = (props: any) => {
    const navigate = useNavigate();
    const [data, setData] = useState<IUserResponse | null>();

    useEffect(() => {
      const getUser = async () => {
        try {
          const userData = await UserService.getUser();
          setData(userData.data ? userData.data : null);
        } catch (error) {
          navigate("/login");
        }
      };
      getUser();
    }, [navigate]);

    return !!data ? <Component {...props} /> : null; // Render whatever you want while the authentication occurs
  };

  return AuthenticatedComponent;
};
