import { useState, useEffect } from 'react';
import './App.css';
import styled from 'styled-components';
import initialTodos from "./todo.json";
import { nanoid } from 'nanoid';

const TodoEditor = styled.form`
  display: flex;
  flex-direction: row;
  gap: 5px;
  margin-bottom: 20px;
  border: 1px gray solid;
  box-sizing: border-box;
  padding: 10px;
  width: 300px;
  input {
    width: 180px;
    height: 20px;
    border: none;
    border-bottom: 2px solid gray;
    font-family: "Montserrat";
    &:focus {
      outline: none;
    }
    &::placeholder {
      font-family: "Montserrat";
      font-size: larger;
    }
  }
  button {
    width: 100px;
    border: none;
    color: #fff;
    background-color: #8a8a8a;
    cursor: pointer;
    font-family: "Montserrat";
    transition: 300ms;
    &:hover {
      background-color: #808080;
      transform: scale(1.05);
    }
  }
`;

const Filter = styled.input`
  width: 180px;
  height: 20px;
  border: none;
  border-bottom: 2px solid gray;
  font-family: "Montserrat";
  &:focus {
    outline: none;
  }
  &::placeholder {
    font-family: "Montserrat";
    font-size: larger;
  }
`;

const Info = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: row;
  gap: 5px;
  font-family: "Montserrat";
`;

const TodoList = styled.ul`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  list-style: none;
`;

function App() {
  const [todos, setTodos] = useState(initialTodos);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (localStorage.getItem("data")) {
      setTodos(JSON.parse(localStorage.getItem("data")));
    }
    else {
      const saveData = JSON.stringify(todos);
      localStorage.setItem("data", saveData);
    }
  }, [])
  useEffect(() => { 
    const newData = JSON.stringify(todos);
    localStorage.setItem("data", newData);
  }, [todos]);

  function outOfTotal() {
    let c = 0;
    todos.map(item => {
      if (item.completed) {
        c++;
      }
      return c;
    })
    return c;
  }
  
    return <>
      <TodoEditor onSubmit={(e) => {
        e.preventDefault();
        setTodos([...todos, { id: nanoid(), text: e.currentTarget.children[0].value, completed: false }]);
        e.currentTarget.children[0].value = "";
      }}>
        <input type="input" placeholder="Task" required />
        <button type="submit">Add task</button> 
      </TodoEditor>
      <div style={{display: "flex", flexDirection: "row", gap: "10px"}}>
        <Filter placeholder="Search" onInput={(e) => {
          setFilter(e.currentTarget.value);
        }}/>
        <Info>
          <li key="first">Total: {todos.length} |</li>
          <li key="second">Done: {outOfTotal()}</li>
        </Info>
      </div>
      <TodoList>
        {todos.map(item => {
          if (item.text.toLocaleLowerCase().includes(filter.toLocaleLowerCase())) {
            return <li key={item.id}><input type="checkbox" checked={item.completed} onChange={(e) => {
              const temp = todos.map(el => {
                if (el.id === item.id) {
                  el.completed = e.currentTarget.checked;
                }
                return el;
              })
              setTodos(temp);
            }} />  {item.text}</li>
          }
          else {
            return true;
          }
        })}
      </TodoList>
      
    </>
  
  
}

export default App;
