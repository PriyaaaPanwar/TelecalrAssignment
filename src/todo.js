import React, { useState, useEffect } from "react";
import { List, X, Clock, Folder, Edit, Trash, Plus } from "lucide-react";
import { Button, Form, InputGroup, Modal } from "react-bootstrap";
import logo from "./img/lofo.png";

const TodoList = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filters, setFilters] = useState([
    { name: "Personal", color: "red" },
    { name: "Freelance", color: "blue" },
    { name: "Work", color: "yellow" },
  ]);
  const [activeFilters, setActiveFilters] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState(filters[0]);
  const [newFilterName, setNewFilterName] = useState("");
  const [showNewFilterModal, setShowNewFilterModal] = useState(false);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(storedTasks);
    const storedFilters =
      JSON.parse(localStorage.getItem("filters")) || filters;
    setFilters(storedFilters);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("filters", JSON.stringify(filters));
  }, [tasks, filters]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const addTask = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      const newTaskObj = {
        id: Date.now(),
        text: newTask,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        category: selectedFilter.name,
        color: selectedFilter.color,
        completed: false,
        date: currentDate.toISOString().split("T")[0],
      };
      setTasks([...tasks, newTaskObj]);
      setNewTask("");
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleTaskCompletion = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const startEditingTask = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const updateTask = () => {
    setTasks(
      tasks.map((task) => (task.id === editingTask.id ? editingTask : task))
    );
    setShowModal(false);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const toggleFilter = (filterName) => {
    setActiveFilters((prevFilters) =>
      prevFilters.includes(filterName)
        ? prevFilters.filter((f) => f !== filterName)
        : [...prevFilters, filterName]
    );
  };

  const filteredTasks = tasks.filter(
    (task) =>
      activeFilters.length === 0 || activeFilters.includes(task.category)
  );

  const addNewFilter = () => {
    if (newFilterName.trim()) {
      const newColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
      const newFilter = { name: newFilterName, color: newColor };
      setFilters([...filters, newFilter]);
      setNewFilterName("");
      setShowNewFilterModal(false);
    }
  };

  return (
    <div className="d-flex bg-light" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <div
        className={`bg-white p-4 ${sidebarOpen ? "d-block" : "d-none"}`}
        style={{ width: "250px", transition: "all 0.3s" }}
      >
        <div className="d-flex align-items-center mb-4">
          <img
            src={logo}
            alt="User"
            className="rounded-circle me-3"
            style={{ width: "50px", height: "50px" }}
          />
          <div>
            <h6 className="mb-0">Do-it</h6>
            <small className="text-muted m-3">Priya Panwar</small>
          </div>
        </div>
        <div className="mb-4">
          <h6 className="mb-3">Filters</h6>
          {filters.map((filter, index) => (
            <Button
              key={index}
              variant={
                activeFilters.includes(filter.name) ? "primary" : "light"
              }
              className="w-100 mb-2 text-start d-flex align-items-center"
              style={{
                border: `1px solid ${filter.color}`,
                backgroundColor: activeFilters.includes(filter.name)
                  ? filter.color
                  : "white",
              }}
              onClick={() => toggleFilter(filter.name)}
            >
              <span
                className="me-2"
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: filter.color,
                }}
              ></span>
              {filter.name}
            </Button>
          ))}
          <Button
            variant="link"
            className="p-0 text-decoration-none"
            onClick={() => setShowNewFilterModal(true)}
          >
            <small className="text-muted">
              <Plus size={12} className="me-1" />
              Add filter
            </small>
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div
        className="flex-grow-1 p-4"
        style={{ backgroundColor: "#e0e0ff", overflowY: "auto" }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Button variant="light" onClick={toggleSidebar}>
            {sidebarOpen ? <X size={20} /> : <List size={20} />}
          </Button>
        </div>
        <h2 className="mb-3">Today main focus</h2>
        <Form onSubmit={addTask} className="mb-4">
          <InputGroup className="bg-white rounded">
            <InputGroup.Text className="bg-white border-0">
              <div className="d-flex align-items-center">
                {filters.map((filter, index) => (
                  <div
                    key={index}
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      backgroundColor: filter.color,
                      margin: "2px",
                      cursor: "pointer",
                      border:
                        selectedFilter.name === filter.name
                          ? "2px solid black"
                          : "none",
                    }}
                    onClick={() => setSelectedFilter(filter)}
                  ></div>
                ))}
              </div>
            </InputGroup.Text>
            <Form.Control
              placeholder="What is your next task?"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="border-0 shadow-none"
            />
            <InputGroup.Text className="bg-white border-0">
              <Clock size={18} className="text-muted me-2" />
              <Folder size={18} className="text-muted" />
            </InputGroup.Text>
          </InputGroup>
        </Form>
        <div>
          {Object.entries(
            filteredTasks.reduce((acc, task) => {
              (acc[task.date] = acc[task.date] || []).push(task);
              return acc;
            }, {})
          ).map(([date, dateTasks]) => (
            <div key={date} className="mb-4">
              <h5 className="mb-3">{formatDate(date)}</h5>
              {dateTasks.map((task) => (
                <div
                  key={task.id}
                  className="d-flex align-items-center justify-content-between m-3 p-3 bg-white rounded"
                  style={{
                    border: `2px solid ${task.color}`, // Add a border with the task's color
                  }}
                >
                  <Button
                    variant={task.completed ? "success" : "outline-secondary"} // Change button variant based on task completion
                    onClick={() => toggleTaskCompletion(task.id)}
                    className="mx-3"
                    style={{
                      padding: "0.5rem 1rem", // Add padding for better button size
                    }}
                  >
                    {task.completed ? "Completed" : "Mark Complete"}{" "}
                    {/* Button text */}
                  </Button>
                  <div className="flex-grow-1">
                    <h6
                      className={`mb-0 ${task.completed ? "text-muted" : ""}`}
                    >
                      {task.text}
                    </h6>
                    <small className="text-muted">{task.time}</small>
                  </div>

                  <div className="d-flex">
                    <Button
                      variant="link"
                      onClick={() => startEditingTask(task)}
                      className="me-2"
                    >
                      <Edit size={16} />
                    </Button>
                    <Button variant="link" onClick={() => deleteTask(task.id)}>
                      <Trash size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header>
            <Modal.Title>Edit Task</Modal.Title>
            <Button
              variant="link"
              onClick={() => setShowModal(false)}
              style={{
                border: "none",
                fontSize: "1.5rem",
                padding: 0,
                marginLeft: "auto", // Aligns the button to the right
              }}
            >
              <X />
            </Button>
          </Modal.Header>
          <Modal.Body>
            <Form.Control
              as="textarea"
              rows={3}
              value={editingTask ? editingTask.text : ""}
              onChange={(e) =>
                setEditingTask({ ...editingTask, text: e.target.value })
              }
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={updateTask}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={showNewFilterModal}
          onHide={() => setShowNewFilterModal(false)}
        >
          <Modal.Header>
            <Modal.Title>New Filter</Modal.Title>
            <Button
              variant="link"
              onClick={() => setShowNewFilterModal(false)}
              style={{
                border: "none",
                fontSize: "1.5rem",
                padding: 0,
                marginLeft: "auto", // Aligns the button to the right
              }}
            >
              <X />
            </Button>
          </Modal.Header>
          <Modal.Body>
            <Form.Control
              placeholder="Filter Name"
              value={newFilterName}
              onChange={(e) => setNewFilterName(e.target.value)}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={addNewFilter}>
              Add Filter
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default TodoList;
