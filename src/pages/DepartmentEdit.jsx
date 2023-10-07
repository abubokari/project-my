import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Card, Form, Input, Alert } from "antd";
import { Button } from "semantic-ui-react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

function AddDepartment() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL_KEY;
  let { id } = useParams();

  const navigate = useNavigate();
  const [inputField, setInputField] = useState({
    title: "",
    description: "",
  });
  const [err, setErr] = useState({});
  const [notfound, setNotfound] = useState("");
  const authUserInfo = useSelector((state) => state.userAuthenticate);

  const handleChange = (el) => {
    const { name, value } = el.target;
    setInputField((prev) => ({ ...prev, [name]: value }));
    setErr((prev) => ({ ...prev, [name]: "" }));
    setErr((prev) => ({ ...prev, message: "" }));
  };

  const notify = () =>
    toast.success("Department info update successfully.", {
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
      url: `${baseUrl}/backend/department/update`,
      headers: {
        "Content-Type": "application/json",
      },
      data: { ...inputField, id: id },
    };

    axios
      .request(config)
      .then((response) => {
        if ("error" in response.data) {
          if ("title" in response.data.error) {
            setErr((prev) => ({ ...prev, title: response.data.error.title }));
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
    if (id) {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${baseUrl}/backend/department/details/${id}`,
      };

      axios
        .request(config)
        .then((response) => {
          if ("data" in response.data) {
            setInputField((prev) => ({ ...prev, ...response.data.data }));
          } else if ("error" in response.data) {
            setNotfound(response.data.error);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  useEffect(() => {
    if (authUserInfo.userInfo.role !== "admin") {
      navigate("/");
    }
  }, []);

  const handleBack = () => {
    history.back();
  };

  return (
    <Card title="Edit Department Info">
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

      {notfound === "" ? (
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
            <Input
              placeholder="department name"
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
          <h3>{notfound}</h3>
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
  );
}

export default AddDepartment;
