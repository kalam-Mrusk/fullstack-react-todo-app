import { useEffect } from "react";
import "./App.css";
import { Outlet } from "react-router-dom";
import axios from "axios";
import { loginFailure, loginSuccess } from "../src/redux/user.slice.js";
import { loadingEnd } from "../src/redux/loading.slice.js";
import { useDispatch, useSelector } from "react-redux";
function App() {
  const dispatch = useDispatch();
  const refresh = useSelector((state) => state.loading.refresh);
  const getCurrentUser = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/todo-app/user/get-current-user",
        {
          withCredentials: true,
        }
      );
      dispatch(loginSuccess(res.data?.data));
      dispatch(loadingEnd());
    } catch (error) {
      console.log(error);
      dispatch(loginFailure());
      dispatch(loadingEnd());
    }
  };
  useEffect(() => {
    getCurrentUser();
  }, [refresh]);
  return <Outlet />;
}

export default App;
