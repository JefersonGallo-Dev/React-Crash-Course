
// // Using class component //
// import React from "react"
// class App extends React.Component{
//   render() {
//     return <h1>Hello from s class</h1>
//   }
// }
// export default App;



// Using functions //
import Header from "./components/Header";
import Tasks from "./components/Tasks";
import { useState, useEffect } from "react";
import AddTask from "./components/AddTask";


function App() {

  const [showAddTask, setShowAddTask] = useState(true)
  const [tasks, setTasks] = useState([
    // {
    //   id: 1,
    //   text: "Doctors Appointment",
    //   day: "Monday",
    //   reminder: true,
    // },
    // {
    //   id: 2,
    //   text: "U Meeting",
    //   day: "Friday",
    //   reminder: true,
    // },
    // {
    //   id: 3,
    //   text: "Exam",
    //   day: "Sunday",
    //   reminder: true,
    // }
  ])

  useEffect(() => {
    const getTasks = async () => {
      const taskFromServer = await fetchTasks();
      setTasks(taskFromServer);
    }
    getTasks(); 
  }, []);

  // Fetch tasks //
  const fetchTasks = async () => {
    const res = await fetch("http://localhost:5000/tasks");
    const data = await res.json();
    console.log(data);
    return data
  };

  // Fetch task //
  const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`);
    const data = await res.json();
    console.log(data);
    return data
  };

  // // Delete a task //
  // const deleteTask = (id) => {
  //   console.log("Delete: ", id)
  //   setTasks(tasks.filter((task) => task.id !== id))
  // }
  // Delete a task from json server //
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: "DELETE",
    });
    
    console.log("Delete: ", id)
    setTasks(tasks.filter((task) => task.id !== id))
  }

  // // Toggle reminder //
  // const toggleReminder = (id) => {
  //   console.log("Reminder:", id)
  //   setTasks(tasks.map((task) =>
  //     task.id === id ? { ...task, reminder: !task.reminder } : task))
  // }

  // Toggle reminder //
  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id);
    const updTask = {...taskToToggle,
      reminder: !taskToToggle.reminder
    }
    
    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(updTask)
    });

    const data = await res.json()
    console.log(data.reminder)
    
    console.log("Reminder:", id)
    setTasks(tasks.map((task) =>
      task.id === id ? { ...task, reminder: data.reminder } : task))
  }

  // // Add task //
  // const addTask = (task) => {
  //   console.log(task)
  //   const id = Math.floor(Math.random() * 1000) + 1
  //   const newTask = { id, ...task }
  //   setTasks([...tasks, newTask])
  // }

  // Add task for json server //
  const addTask = async (task) => {
    const res = await fetch("http://localhost:5000/tasks",{
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(task)
    })

    const data = await res.json()
    setTasks([...tasks, data])
  }

  return (
    <div className="container">
      <Header
        title="Task Tracker"
        onAdd={() => setShowAddTask(!showAddTask)} 
        showAdd={showAddTask}
      />
      {showAddTask && <AddTask onAdd={addTask} />}
      {tasks.length > 0 ? <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder} /> : "No tasks to show"}
      {/* <Header /> */}
      {/* <h1>Hello world!</h1>
      <h2>Hello {name}</h2> */}
    </div>
  );
}
export default App;


