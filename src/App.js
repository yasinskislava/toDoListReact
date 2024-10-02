import { Component } from 'react';
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

const Timer = styled.p`
    font-family: "Montserrat";
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

class App extends Component {
  state = {
    todos: initialTodos,
    filter: '',
    show: true,
    seconds: 0
  }
  componentDidMount() {
    if (localStorage.getItem("data")) {
      this.setState({ todos: JSON.parse(localStorage.getItem("data")) });
    }
    else {
      const saveData = JSON.stringify(this.state.todos);
      localStorage.setItem("data", saveData);
    }
    this.timer = setInterval(() => {
      this.setState((prevState) => ({
        seconds: prevState.seconds + 1,
      }));
    }, 1000);
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }
  componentDidUpdate() {
    const newData = JSON.stringify(this.state.todos);
    localStorage.setItem("data", newData);
  }
  outOfTotal() {
    let c = 0;
    this.state.todos.map(item => {
      if (item.completed) {
        c++;
      }
      return c;
    })
    return c;
  }
  render() {
    return <>
      <TodoEditor onSubmit={(e) => {
        e.preventDefault();
        const tempArr = this.state.todos;
        tempArr.push({ id: nanoid(), text: e.currentTarget.children[0].value, completed: false });
        this.setState({ todos: tempArr });
        e.currentTarget.children[0].value = "";
      }}>
        <input type="input" placeholder="Task" required />
        <button type="submit">Add task</button> 
      </TodoEditor>
      <div style={{display: "flex", flexDirection: "row", gap: "10px"}}>
        <Filter placeholder="Search" onInput={(e) => {
          this.setState({ filter: e.currentTarget.value });
        }}/>
        <Info>
          <li key="first">Total: {this.state.todos.length} |</li>
          <li key="second">Done: {this.outOfTotal()}</li>
        </Info>
      </div>
      <TodoList>
        {this.state.todos.map(item => {
          if (item.text.toLocaleLowerCase().includes(this.state.filter.toLocaleLowerCase())) {
            return <li key={item.id}><input type="checkbox" checked={item.completed} onChange={(e) => {
              const tempArr = this.state.todos;
              tempArr[this.state.todos.findIndex((todo) => todo.id === item.id)].completed = e.currentTarget.checked;
              this.setState({ todos: tempArr });
            }} />  {item.text}</li>
          }
          else {
            return true;
          }
        })}
      </TodoList>
      {this.state.show ? <Timer>{Math.floor(this.state.seconds / 3600)}:{Math.floor(this.state.seconds % 3600 / 60)}:{this.state.seconds % 3600 % 60}</Timer> : null}
      <button type='button' onClick={() => {
        this.setState({ show: false });
      }}>Stop</button>
    </>
  }
  
}

export default App;
