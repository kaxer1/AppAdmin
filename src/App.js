import React, { Component } from 'react';
import './App.css';

import tasks from "./sample/tasks.json"

// COMPONENTES
import Tasks from "./components/Tasks";
import TaskForm from "./components/TaskForm";

class App extends Component {
  state = {
    tasks: tasks
  }

  addTask = (title, descripcion) => {
    const newTask ={
      title: title,
      description: descripcion,
      id: this.state.tasks.length,
      done: false
    }
    this.setState({
      tasks: [...this.state.tasks, newTask]
    })
    console.log(newTask);
  }

  render() {
    return (
      <div>
        <TaskForm addTask={this.addTask}/>
        <Tasks tasks={this.state.tasks} />
      </div>
    )
  }
}


export default App;


// function Helloword(props) {
//   console.log(props);
//   return (
//     <div id="hello">
//       <h4>{ props.text } </h4>
//       { props.sub }
//     </div>
//   )
// }

// class Helloword extends React.Component {

//   state = {
//     show: true
//   }

//   toggleShow = () => {
//     this.setState({show: !this.state.show}) 
//   }

//   render() {
//     if (this.state.show) {
//       return (
//         <div id="hello">
//           <h4>{ this.props.text } </h4>
//           { this.props.sub }
//           <button onClick={ this.toggleShow } > toggle show </button>
//         </div>
//       )
//     } else {
//       return (
//         <div> No hay elementos 
//           <button onClick={ this.toggleShow } > toggle show </button>
//         </div>

//       )
//     }
//   }
// }
// function App() {
//   return (
//     <div>
//       this is my componente: 
//       <Helloword text="holaaa" sub="subtitulo...."/> 
//       <Helloword text="perro" sub="subtitulo...."/> 
//       <Helloword text="eeee" sub="subtitulo...."/>
//     </div>
//   );
// }