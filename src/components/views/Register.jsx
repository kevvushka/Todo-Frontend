import { Form, Input, Button, Row, Col, notification } from "antd";
import { useNavigate } from "react-router";

export default function Register() {
    const navigate = useNavigate();

    const onFinish = async (values) => {
        fetch("http://localhost:3000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(values)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.success) {
                navigate("/login");
            } else {
                notification.error({
                    message: "Register failed",
                    description: data.message
                });
            }
        })
    };

    return (
        <Row type="flex" justify="center" align="middle" style={{minHeight: '100vh'}}>
            <Col span={4}>
                <h1>Register</h1>
                <Form
                    name="basic"
                    layout="vertical"
                    initialValues={{ username: "", password: "" }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Register Account</Button>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    )
}