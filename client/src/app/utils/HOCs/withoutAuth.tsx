import UserService from "app/services/UserService";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const withoutAuth = (Component: any) => {
  const AuthenticatedComponent = (props: any) => {
    const navigate = useNavigate();

    useEffect(() => {
      const getUser = async () => {
        try {
          await UserService.getUser();
          navigate("/account");
        } catch (error) {
          console.log("fine!");
        }
      };
      getUser();
    }, [navigate]);

    return <Component {...props} />; // Render whatever you want while the authentication occurs
  };

  return AuthenticatedComponent;
};
