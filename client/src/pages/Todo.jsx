import axios from "axios";
import "./todo.css";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { refresh } from "../redux/loading.slice.js";
import TodoItem from "../components/TodoItem/TodoItem.jsx";

const Todo = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state) => state.loading.status);
  const userExist = useSelector((state) => state.user.value);
  const [title, setTitle] = useState("");
  const [discription, setDiscription] = useState("");
  const [allTodos, setAllTodos] = useState([]);
  const userLogOut = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/todo-app/user/auth/logout",

        {
          withCredentials: true,
        }
      );
      dispatch(refresh());
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  const addTodo = async () => {
    const incompleteDetails = [title, discription].some((ele) => {
      return ele.trim === "";
    });
    if (incompleteDetails) return window.alert("incomplete details.");
    try {
      const res = await axios.post(
        "http://localhost:8080/api/todo-app/todo/create",
        {
          todoTitle: title,
          todoDiscription: discription,
        },
        { withCredentials: true }
      );
      if (res) {
        window.alert("todo added.");
        setTitle("");
        setDiscription("");
        getAllTodo();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllTodo = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/todo-app/todo/get",
        { withCredentials: true }
      );
      if (res) {
        setAllTodos(res.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (!userExist) {
      navigate("/");
    }
    getAllTodo();
  }, [userExist]);
  return (
    <div className="todoPageContainer">
      <div className="todoHeader">
        <h3 className="fullname">{userExist?.user.fullname}</h3>
        <button onClick={userLogOut}>logout</button>
      </div>
      <h2>Write Todos</h2>
      <div className="todoPageInputSection">
        <input
          type="text"
          placeholder="todo title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          name=""
          id=""
          placeholder="todo discription..."
          value={discription}
          onChange={(e) => setDiscription(e.target.value)}
        ></textarea>
        <button onClick={addTodo}>add todo</button>
      </div>
      <h2>Todo List</h2>
      <div className="todoPageItemContainer">
        {allTodos.map((todo) => (
          <TodoItem
            key={todo._id}
            todoId={todo._id}
            subTodoData={todo.subTodos}
            todoTitle={todo.todoTitle}
            todoDiscription={todo.todoDiscription}
            getAllTodo={getAllTodo}
          />
        ))}
      </div>
    </div>
  );
};

export default Todo;
