import React, { useState } from "react";
import SubTodoItem from "../SubTodoItem/SubTodoItem.jsx";
import "./todoItem.css";
import "../SubTodoItem/subtodoItem.css";
import axios from "axios";
const TodoItem = ({
  todoTitle,
  todoDiscription,
  subTodoData,
  todoId,
  getAllTodo,
}) => {
  const [displaySubTodo, setDisplaySubTodo] = useState(false);
  const [editable, setEditable] = useState(false);
  const [subTodoAddable, setSubTodoAddable] = useState(false);
  const [title, setTitle] = useState(todoTitle);
  const [discription, setDiscription] = useState(todoDiscription);
  const [subTodoTitle, setSubTodoTitle] = useState("");
  const [subTodoDiscription, setSubTodoDiscription] = useState("");

  const updateTodo = async () => {
    const incompleteDetails = [title, discription].some((ele) => {
      return ele.trim === "";
    });
    if (incompleteDetails) return window.alert("incomplete details.");
    try {
      const res = await axios.put(
        `http://localhost:8080/api/todo-app/todo/${todoId}/update`,
        {
          todoTitle: title,
          todoDiscription: discription,
        }
      );
      if (res) {
        window.alert("todo updated.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const removeTodo = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:8080/api/todo-app/todo/${todoId}/delete`
      );
      if (res) {
        window.alert("todo removed.");
        getAllTodo();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addSubTodo = async () => {
    const incompleteDetails = [subTodoTitle, subTodoDiscription].some((ele) => {
      return ele.trim === "";
    });
    if (incompleteDetails) return window.alert("incomplete details.");
    try {
      const res = await axios.post(
        `http://localhost:8080/api/todo-app/todo/${todoId}/subtodo`,
        {
          subTodoTitle,
          subTodoDiscription,
        }
      );
      if (res) {
        window.alert("sub todo added.");
        setSubTodoTitle("");
        setSubTodoDiscription("");
        getAllTodo();
        setSubTodoAddable(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="todoMainContainer">
      <div className="todoContainer">
        <div className="todoItemInputSection">
          {editable ? (
            <>
              <input
                type="text"
                placeholder="todos title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                name="discription"
                id=""
                placeholder="discription..."
                value={discription}
                onChange={(e) => setDiscription(e.target.value)}
              ></textarea>
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="todos title..."
                value={title}
                readOnly
              />
              <textarea
                name="discription"
                id=""
                placeholder="discription..."
                value={discription}
                readOnly
              ></textarea>
            </>
          )}
        </div>
        <div className="todoItemButtonSection">
          <button style={{ backgroundColor: "red" }} onClick={removeTodo}>
            D
          </button>
          {editable ? (
            <button
              style={{ backgroundColor: "green" }}
              onClick={() => {
                updateTodo();
                setEditable(false);
              }}
            >
              S
            </button>
          ) : (
            <button
              style={{ backgroundColor: "gold" }}
              onClick={() => setEditable(true)}
            >
              U
            </button>
          )}
        </div>
      </div>

      <button
        style={{
          border: "none",
          backgroundColor: "#fff",
          padding: "3px",
          margin: "15px 0px",
          fontSize: "1rem",
          fontWeight: "600",
        }}
        onClick={() => {
          setDisplaySubTodo(!displaySubTodo);
          setSubTodoAddable(false);
        }}
      >
        SubTodo
      </button>
      {displaySubTodo ? (
        <button
          style={{
            backgroundColor: "rgb(100, 188, 100)",
            padding: "5px 4px",
            border: "none",
            borderRadius: "5px",
          }}
          onClick={() => setSubTodoAddable(true)}
        >
          add SubTodo
        </button>
      ) : (
        ""
      )}
      <div
        className="subTodoItemList"
        style={displaySubTodo ? {} : { display: "none" }}
      >
        {subTodoAddable ? (
          <div className="subTodoContainer">
            <div className="subTodoItemInputSection">
              <input
                type="text"
                placeholder="title..."
                value={subTodoTitle}
                onChange={(e) => setSubTodoTitle(e.target.value)}
              />
              <textarea
                name="discription"
                id=""
                placeholder="discription..."
                value={subTodoDiscription}
                onChange={(e) => setSubTodoDiscription(e.target.value)}
              ></textarea>
            </div>
            <div className="subTodoItemButtonSection">
              <button
                style={{ backgroundColor: "red" }}
                onClick={() => setSubTodoAddable(false)}
              >
                C
              </button>
              <button style={{ backgroundColor: "green" }} onClick={addSubTodo}>
                A
              </button>
            </div>
          </div>
        ) : (
          subTodoData?.map((data) => (
            <SubTodoItem
              key={data._id}
              subTodoId={data._id}
              todoId={todoId}
              subTodoTitle={data.subTodoTitle}
              subTodoDiscription={data.subTodoDiscription}
              getAllTodo={getAllTodo}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TodoItem;
