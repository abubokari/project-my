import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Card } from "antd";
import { Button, Form, Input, Select, Alert } from "antd";
import axios from "axios";
import { useSelector } from "react-redux";

const { Option } = Select;

function AddTeacher() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL_KEY;
  const navigate = useNavigate();
  const [department, setDepartment] = useState([]);
  const authUserInfo = useSelector((state) => state.userAuthenticate);
  const [course, setCourse] = useState([]);
  const [inputField, setInputField] = useState({
    uname: "",
    email: "",
    phone: "",
    password: "",
    token: "",
    cpassword: "",
    department: "",
    course: "",
    role: "",
  });
  const [err, setErr] = useState({});

  const handleChange = (el) => {
    const { name, value } = el.target;
    setInputField((prev) => ({ ...prev, [name]: value }));
    setErr((prev) => ({ ...prev, [name]: "" }));
    setErr((prev) => ({ ...prev, message: "" }));
  };

  const handleChangeDepartment = (id) => {
    if (id) {
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${baseUrl}/backend/course/showwithdepartment`,
        headers: {
          "Content-Type": "application/json",
        },
        data: { departmentId: id },
      };
      setInputField((prev) => ({ ...prev, department: id }));
      setErr((prev) => ({ ...prev, department: "" }));

      axios
        .request(config)
        .then((response) => {
          if ("data" in response.data) {
            setCourse(response.data.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  useEffect(() => {
    if (authUserInfo.userInfo.role !== "admin") {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${baseUrl}/backend/department/show`,
    };

    axios
      .request(config)
      .then((response) => {
        if ("data" in response.data) {
          setDepartment(response.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleChangeCourse = (data) => {
    setInputField((prev) => ({ ...prev, course: data }));
    setErr((prev) => ({ ...prev, course: "" }));
  };
  const handleChangeRole = (data) => {
    setInputField((prev) => ({ ...prev, role: data }));
    setErr((prev) => ({ ...prev, role: "" }));
  };
  const notify = () =>
    toast.success("Teacher add successfully.", {
      position: "top-left",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  const handleSubmit = () => {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${baseUrl}/backend/authentication/register/teacher`,
      headers: {
        "Content-Type": "application/json",
      },
      data: inputField,
    };

    axios
      .request(config)
      .then((response) => {
        if ("error" in response.data) {
          if ("uname" in response.data.error) {
            setErr((prev) => ({ ...prev, uname: response.data.error.uname }));
          } else if ("email" in response.data.error) {
            setErr((prev) => ({ ...prev, email: response.data.error.email }));
          } else if ("password" in response.data.error) {
            setErr((prev) => ({
              ...prev,
              password: response.data.error.password,
            }));
          } else if ("cpassword" in response.data.error) {
            setErr((prev) => ({
              ...prev,
              cpassword: response.data.error.cpassword,
            }));
          } else if ("phone" in response.data.error) {
            setErr((prev) => ({ ...prev, phone: response.data.error.phone }));
          } else if ("department" in response.data.error) {
            setErr((prev) => ({
              ...prev,
              department: response.data.error.department,
            }));
          } else if ("course" in response.data.error) {
            setErr((prev) => ({ ...prev, course: response.data.error.course }));
          } else if ("role" in response.data.error) {
            setErr((prev) => ({ ...prev, role: response.data.error.role }));
          } else if ("token" in response.data.error) {
            setErr((prev) => ({
              ...prev,
              token: response.data.error.token,
            }));
          } else if ("message" in response.data.error) {
            setErr((prev) => ({
              ...prev,
              message: response.data.error.message,
            }));
          }
        } else if ("success" in response.data) {
          notify();
          setTimeout(() => {
            navigate("/teachers");
          }, 3000);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Card title="New Teacher Assign">
      <ToastContainer
        position="top-left"
        autoClose={2000}
        type="success"
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
        initialValues={{
          remember: true,
        }}
        autoComplete="off"
      >
        <Form.Item label="Name">
          <Input
            placeholder="teacher name"
            name="uname"
            onChange={handleChange}
            value={inputField.uname}
          />

          {err && err.uname ? (
            <Alert
              className="ant-err"
              message={err.uname}
              banner
              closable
              type="error"
            />
          ) : (
            ""
          )}
        </Form.Item>

        <Form.Item label="E-mail">
          <Input
            placeholder="email address"
            name="email"
            onChange={handleChange}
            value={inputField.email}
          />

          {err && err.email ? (
            <Alert
              className="ant-err"
              message={err.email}
              banner
              closable
              type="error"
            />
          ) : err.message ? (
            <Alert
              className="ant-err"
              message={err.message}
              banner
              closable
              type="error"
            />
          ) : (
            ""
          )}
        </Form.Item>

        <Form.Item label="Password">
          <Input.Password
            placeholder="password"
            name="password"
            onChange={handleChange}
            value={inputField.password}
          />

          {err && err.password ? (
            <Alert
              className="ant-err"
              message={err.password}
              banner
              closable
              type="error"
            />
          ) : (
            ""
          )}
        </Form.Item>

        <Form.Item label="Confirm Password">
          <Input.Password
            placeholder="confirm password"
            name="cpassword"
            onChange={handleChange}
            value={inputField.cpassword}
          />

          {err && err.cpassword ? (
            <Alert
              className="ant-err"
              message={err.cpassword}
              banner
              closable
              type="error"
            />
          ) : (
            ""
          )}
        </Form.Item>

        <Form.Item label="Phone">
          <Input
            placeholder="phone"
            name="phone"
            onChange={handleChange}
            value={inputField.phone}
          />

          {err && err.phone ? (
            <Alert
              className="ant-err"
              message={err.phone}
              banner
              closable
              type="error"
            />
          ) : (
            ""
          )}
        </Form.Item>

        <Form.Item label="Department">
          <Select
            onChange={handleChangeDepartment}
            name="department"
            placeholder="select department"
          >
            {department.length !== 0 &&
              department.map((option, index) => (
                <option key={index} value={option._id}>
                  {option.title}
                </option>
              ))}
          </Select>

          {err && err.department ? (
            <Alert
              className="ant-err"
              message={err.department}
              banner
              closable
              type="error"
            />
          ) : (
            ""
          )}
        </Form.Item>

        <Form.Item label="Course">
          <Select
            placeholder="select course"
            name="course"
            onChange={handleChangeCourse}
          >
            {course.length !== 0 &&
              course.map((option, index) => (
                <option key={index} value={option._id}>
                  {option.title}
                </option>
              ))}
          </Select>

          {err && err.course ? (
            <Alert
              className="ant-err"
              message={err.course}
              banner
              closable
              type="error"
            />
          ) : (
            ""
          )}
        </Form.Item>

        <Form.Item label="Role">
          <Select
            placeholder="select role"
            name="role"
            onChange={handleChangeRole}
          >
            <Option value="student">Student</Option>
            <Option value="teacher">Teacher</Option>
          </Select>

          {err && err.role ? (
            <Alert
              className="ant-err"
              message={err.role}
              banner
              closable
              type="error"
            />
          ) : (
            ""
          )}
        </Form.Item>

        <Form.Item label="Token">
          <Input
            placeholder="Secret Token"
            onChange={handleChange}
            value={inputField.token}
            name="token"
          />

          {err && err.token ? (
            <Alert
              className="ant-err"
              message={err.token}
              banner
              closable
              type="error"
            />
          ) : (
            ""
          )}
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}

export default AddTeacher;
