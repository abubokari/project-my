import { useEffect, useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Card } from "antd";
import { Form, Input, Select, Alert } from "antd";
import { Button, Table } from "semantic-ui-react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

function EditTeacher() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL_KEY;
  const navigate = useNavigate();
  const authUserInfo = useSelector((state) => state.userAuthenticate);

  const [department, setDepartment] = useState([]);
  const [course, setCourse] = useState([]);
  const [inputField, setInputField] = useState({
    token: "",
    department: "",
    course: "",
  });
  const [deleteInput, setDeleteInput] = useState({
    course: "",
  });
  const [errDelete, setErrDelete] = useState({});

  const handleChangeDelete = (el) => {
    setDeleteInput((prev) => ({ ...prev, course: el }));
    setErrDelete((prev) => ({ ...prev, course: "" }));
  };
  const [csah, setCash] = useState("");
  const [error, setError] = useState("");

  const [err, setErr] = useState({});
  const [teacher, setTeacher] = useState({});

  let { id } = useParams();

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

  const notify = () =>
    toast.success("Teacher info update successfully.", {
      position: "top-left",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  const notifyDelete = () =>
    toast.success("Course Delete successfully.", {
      position: "top-left",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  const notifyExist = () =>
    toast.warn("This info have already exist.", {
      position: "top-left",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  const handleBack = () => {
    history.back();
  };

  useEffect(() => {
    if (authUserInfo.userInfo.role !== "admin") {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    if (id) {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${baseUrl}/backend/authentication/teacher/details/${id}`,
      };

      axios
        .request(config)
        .then((response) => {
          if ("data" in response.data) {
            setTeacher({ ...response.data.data });
          } else if ("error" in response.data) {
            setError(response.data.error);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [csah]);

  const handleSubmit = () => {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${baseUrl}/backend/authentication/teacher/edit`,
      headers: {
        "Content-Type": "application/json",
      },
      data: { ...inputField, id: id, type: "update" },
    };

    axios
      .request(config)
      .then((response) => {
        if ("error" in response.data) {
          if ("department" in response.data.error) {
            setErr((prev) => ({
              ...prev,
              department: response.data.error.department,
            }));
          } else if ("course" in response.data.error) {
            setErr((prev) => ({ ...prev, course: response.data.error.course }));
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
          setCash(Date.now());
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleAddMore = () => {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${baseUrl}/backend/authentication/teacher/edit`,
      headers: {
        "Content-Type": "application/json",
      },
      data: { ...inputField, id: id, type: "addmore" },
    };

    axios
      .request(config)
      .then((response) => {
        if ("error" in response.data) {
          if ("department" in response.data.error) {
            setErr((prev) => ({
              ...prev,
              department: response.data.error.department,
            }));
          } else if ("course" in response.data.error) {
            setErr((prev) => ({ ...prev, course: response.data.error.course }));
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
          if (response.data.success === "This info have already exist.") {
            notifyExist();
          } else {
            notify();
            setCash(Date.now());
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const [courseUpdateTable, setCourseUpdateTable] = useState("1");
  const handleCourseDel = () => {
    setCourseUpdateTable("2");
  };

  const handleCourseDelete = () => {
    if (deleteInput.course == "") {
      setErrDelete((prev) => ({
        ...prev,
        course: "Course field is required!",
      }));
    } else if (deleteInput.course !== "") {
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${baseUrl}/backend/authentication/teacher/course/delete`,
        headers: {
          "Content-Type": "application/json",
        },
        data: { id: id, course: deleteInput.course },
      };

      axios
        .request(config)
        .then((response) => {
          if ("success" in response.data) {
            setCourseUpdateTable("1");
            notifyDelete();
            setCash(Date.now());
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <>
      <Card title="Edit Teacher Info">
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

        <div className="edit-teacher">
          <div className="edit-teacher-form">
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
                {err && err.message ? (
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

              <Form.Item
                wrapperCol={{
                  offset: 8,
                  span: 16,
                }}
              >
                <Button type="primary" onClick={handleSubmit}>
                  Update
                </Button>

                <Button type="primary" onClick={handleAddMore}>
                  Add More
                </Button>
              </Form.Item>
            </Form>
          </div>
          <div className="edit-teacher-table">
            <Table definition>
              <Table.Body>
                {error == "" && "email" in teacher ? (
                  <>
                    <Table.Row>
                      <Table.Cell>Name</Table.Cell>
                      <Table.Cell>{teacher.uname}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>Department</Table.Cell>
                      <Table.Cell>{teacher.department.title}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>Course</Table.Cell>
                      <Table.Cell>
                        {teacher.course.map((el, index, arr) =>
                          arr.length - 1 !== index ? el.title + ", " : el.title
                        )}

                        {teacher.course.length >= 2 ? (
                          courseUpdateTable == "2" ? (
                            <span
                              type="primary"
                              className="ui button course-edit-btn"
                              onClick={() => setCourseUpdateTable("1")}
                            >
                              Cancel
                            </span>
                          ) : (
                            <Button
                              type="primary"
                              className="course-edit-btn"
                              onClick={handleCourseDel}
                            >
                              Edit
                            </Button>
                          )
                        ) : (
                          ""
                        )}
                      </Table.Cell>
                    </Table.Row>
                  </>
                ) : (
                  <Table.Row>
                    <Table.Cell>Error</Table.Cell>
                    <Table.Cell>
                      <b>{error}</b>
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
            <Button
              content="Back"
              onClick={handleBack}
              icon="left arrow"
              labelPosition="left"
            />
          </div>
        </div>
      </Card>

      {courseUpdateTable == "2" && (
        <Card className="update-course" title="Update Teacher Course">
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
            <Form.Item label="Course">
              <Select
                placeholder="select course"
                onChange={handleChangeDelete}
                name="course"
              >
                {teacher.length !== 0 &&
                  teacher.course.map((option, index) => (
                    <option key={index} value={option._id}>
                      {option.title}
                    </option>
                  ))}
              </Select>

              {errDelete && errDelete.course ? (
                <Alert
                  className="ant-err"
                  message={errDelete.course}
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
              <Button type="primary" onClick={handleCourseDelete}>
                Delete
              </Button>
            </Form.Item>
          </Form>
        </Card>
      )}
    </>
  );
}

export default EditTeacher;
