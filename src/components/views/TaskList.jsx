import { DeleteOutlined } from "@ant-design/icons";
import { Input, Button, Checkbox, List, Col, Row, Space, Divider } from "antd";
import produce from "immer";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

export default function TaskList() {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([
        {id: 1, name: "Task 1", completed: false},
        {id: 2, name: "Task 2", completed: true},
    ]);

    useEffect(() => {
        if(localStorage.getItem("token") === null || 
            localStorage.getItem("token") === "" || 
            localStorage.getItem("token") === undefined ||
            localStorage.getItem("token") === "undefined"
            ) {
            navigate("/login");
        } else {
            fetch("http://localhost:3000/user", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
            })
            .then(response => response.json())
            .then(data => {
                if(data.success) {
                    setTasks(data.user.tasks);
                }
            })
        }
    }, []);

    const handleNameChange = (task, event) => {
        const newTasks = produce(tasks, draft => {
            const index = draft.findIndex(t => t.id === task.id);
            draft[index].name = event.target.value;
        });

        setTasks(newTasks);

        fetch("http://localhost:3000/user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({
                tasks: newTasks
            })
        })
    };

    const handleCompletedChange = (task, event) => {
        const newTasks = produce(tasks, draft => {
            const index = draft.findIndex(t => t.id === task.id);
            draft[index].completed = event.target.checked;
        });

        setTasks(newTasks);

        fetch("http://localhost:3000/user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({
                tasks: newTasks
            })
        })
    };

    const handleAddTask = () => {
        const newTasks = produce(tasks, draft => {
            draft.push({
                id: draft.length + 1,
                name: "",
                completed: false
            });
        });

        setTasks(newTasks);

        fetch("http://localhost:3000/user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({
                tasks: newTasks
            })
        })
    };

    const handleDeleteTask = (task) => {
        const newTasks = produce(tasks, draft => {
            const index = draft.findIndex(t => t.id === task.id);
            draft.splice(index, 1);
        });

        setTasks(newTasks);

        fetch("http://localhost:3000/user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({
                tasks: newTasks
            })
        })
    };

    const handleLogOut = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <Row type="flex" justify="center" style={{minHeight: '100vh', marginTop: '6rem'}}>
            <Col span={12}>
                <Button onClick={handleLogOut}>Logout</Button>
                <h1>Task List</h1>
                <Button onClick={handleAddTask}>Add Task</Button>
                <Divider />
                <List
                    size="small"
                    bordered
                    dataSource={tasks}
                    renderItem={(task) => <List.Item key={task.id}>
                        <Row type="flex" justify="space-between" align="middle" style={{width: '100%'}}>
                            <Space>
                                <Checkbox checked={task.completed} onChange={(e) => handleCompletedChange(task, e)} />
                                <Input value={task.name} onChange={(event) => handleNameChange(task, event)} />
                            </Space>
                            <Button type="text" onClick={() => handleDeleteTask(task)}><DeleteOutlined /></Button>
                        </Row>
                    </List.Item>}
                />
            </Col>
        </Row>
    )
}