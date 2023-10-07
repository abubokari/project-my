import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Card } from "antd";
import { Form, Input, Select, Alert } from "antd";
import { Button } from "semantic-ui-react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function EditCourse() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL_KEY;
  const navigate = useNavigate();

  const [department, setDepartment] = useState([]);
  const [course, setCourse] = useState({});
  const [inputField, setInputField] = useState({
    department: "",
    title: "",
    description: "",
  });
  const authUserInfo = useSelector((state) => state.userAuthenticate);

  const [selectedDepartment, setSelectedDepartment] = useState("");

  const [err, setErr] = useState({});
  const [error, setError] = useState("");

  let { id } = useParams();

  const handleChange = (el) => {
    const { name, value } = el.target;
    setInputField((prev) => ({ ...prev, [name]: value }));
    setErr((prev) => ({ ...prev, [name]: "" }));
    setErr((prev) => ({ ...prev, message: "" }));
  };

  const handleChangeDepartment = (info) => {
    setInputField((prev) => ({ ...prev, department: info }));
    setSelectedDepartment(info);
  };

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

  const notify = () =>
    toast.success("Course info update successfully.", {
      position: "top-left",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  useEffect(() => {
    if (id) {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${baseUrl}/backend/course/edit/${id}`,
      };

      axios
        .request(config)
        .then((response) => {
          if ("data" in response.data) {
            setCourse({ ...response.data.data });
            setSelectedDepartment(response.data.data[0].departmentId.title);
            setInputField((prev) => ({
              ...prev,
              title: response.data.data[0].title,
              description: response.data.data[0].description,
              department: response.data.data[0].departmentId._id,
            }));
          } else if ("error" in response.data) {
            setError("No data found in this ID.");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  const handleSubmit = () => {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${baseUrl}/backend/course/update`,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        title: inputField.title,
        departmentId: inputField.department,
        description: inputField.description,
        id: id,
      },
    };

    axios
      .request(config)
      .then((response) => {
        if ("error" in response.data) {
          if ("title" in response.data.error) {
            setErr((prev) => ({ ...prev, title: response.data.error.title }));
          } else if ("department" in response.data.error) {
            setErr((prev) => ({
              ...prev,
              department: response.data.error.department,
            }));
          }
        } else if ("success" in response.data) {
          notify();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (authUserInfo.userInfo.role !== "admin") {
      navigate("/");
    }
  }, []);

  const handleBack = () => {
    history.back();
  };

  return (
    <>
      <Card title="Edit Course Info">
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

        {error === "" ? (
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
            <Form.Item label="Course">
              <Input
                placeholder="course name"
                name="title"
                onChange={handleChange}
                value={inputField.title}
              />

              {err && err.title ? (
                <Alert
                  className="ant-err"
                  message={err.title}
                  banner
                  closable
                  type="error"
                />
              ) : (
                ""
              )}
            </Form.Item>

            <Form.Item label="Description">
              <Input.TextArea
                rows={4}
                name="description"
                value={inputField.description}
                onChange={handleChange}
                placeholder="description"
              />
            </Form.Item>

            <Form.Item label="Department">
              <Select
                onChange={handleChangeDepartment}
                value={selectedDepartment}
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

            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Button type="primary" onClick={handleSubmit}>
                Update
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <>
            <h3>{error}</h3>
            <br />
            <Button
              content="Back"
              onClick={handleBack}
              icon="left arrow"
              labelPosition="left"
            />
          </>
        )}
      </Card>
    </>
  );
}

export default EditCourse;
