import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useSelector } from "react-redux";
import { Card, Form, Input, Alert, Image } from "antd";
import { Button, Table, Modal, Header, Icon } from "semantic-ui-react";
import { styled } from "@mui/material/styles";
import Buttons from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const VisuallyHiddenInput = styled("input")`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;

function Profile() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL_KEY;
  const [user, setUser] = useState({});
  const authUserInfo = useSelector((state) => state.userAuthenticate.userInfo);
  const [inputField, setInputField] = useState({
    oldpassword: "",
    password: "",
    cpassword: "",
  });

  const [error, setError] = useState("");
  const [err, setErr] = useState({});

  const handleBack = () => {
    history.back();
  };

  useEffect(() => {
    if (authUserInfo.id) {
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${baseUrl}/backend/authentication/userinfo`,
        headers: {
          "Content-Type": "application/json",
        },
        data: { id: authUserInfo.id },
      };

      axios
        .request(config)
        .then((response) => {
          if ("data" in response.data) {
            setUser({ ...response.data.data[0] });
          } else if ("error" in response.data) {
            setError(response.data.error);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  const notify = () =>
    toast.success("Password update successfully.", {
      position: "top-left",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  const notifyImage = () =>
    toast.success("Picture update successfully.", {
      position: "top-left",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  const handleChange = (el) => {
    const { name, value } = el.target;
    setInputField((prev) => ({ ...prev, [name]: value }));
    setErr((prev) => ({ ...prev, [name]: "" }));
  };

  const [toggle, setToggle] = useState(false);
  const handleToggle = () => {
    setToggle((prev) => !prev);
  };

  const [modalShow, setModalShow] = useState(false);
  const [errmsg, setErrmsg] = useState("");

  const handleChangePassword = () => {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${baseUrl}/backend/authentication/passwordchange`,
      headers: {
        "Content-Type": "application/json",
      },
      data: { ...inputField, id: authUserInfo.id },
    };

    axios
      .request(config)
      .then((response) => {
        if ("success" in response.data) {
          setInputField((prev) => ({ ...prev, oldpassword: "" }));
          setInputField((prev) => ({ ...prev, password: "" }));
          setInputField((prev) => ({ ...prev, cpassword: "" }));
          notify();
          setToggle(false);
        } else if ("error" in response.data) {
          if ("oldpassword" in response.data.error) {
            setErr((prev) => ({
              ...prev,
              oldpassword: response.data.error.oldpassword,
            }));
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
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [imageUpload, setImageUpload] = useState("");

  const handleImageData = (e) => {
    setImageUpload(e.target.files[0]);
  };

  const handleSubmit = () => {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${baseUrl}/backend/authentication/user/imagecreate`,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: { picture: imageUpload, id: authUserInfo.id },
    };

    axios
      .request(config)
      .then((response) => {
        if ("error" in response.data) {
          setErrmsg(response.data.error);
        } else if ("success" in response.data) {
          setImageUpload("");
          setModalShow(false);
          setUser((prev) => ({ ...prev, picture: response.data.success }));
          notifyImage();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <Card title="Profile Info">
        <Modal
          closeIcon
          open={modalShow}
          onClose={() => {
            setModalShow(false);
            setImageUpload("");
            setErrmsg("");
          }}
          onOpen={() => setModalShow(true)}
          className="set-password"
        >
          <Header content="Update Photo" />
          <Modal.Content>
            <Buttons
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
              href="#file-upload"
            >
              Upload a file
              <VisuallyHiddenInput
                type="file"
                name="picture"
                onChange={handleImageData}
              />
            </Buttons>
            {errmsg ? (
              <Alert
                className="ant-err"
                message={errmsg}
                banner
                closable
                type="error"
              />
            ) : (
              ""
            )}
          </Modal.Content>
          <Modal.Actions>
            <Button color="red" onClick={() => setModalShow(false)}>
              <Icon name="remove" /> Cancel
            </Button>
            <Button color="green" onClick={handleSubmit}>
              <Icon name="checkmark" /> Update
            </Button>
          </Modal.Actions>
        </Modal>

        <Table definition>
          <Table.Body>
            {error == "" && "email" in user ? (
              <>
                <Table.Row>
                  <Table.Cell>
                    Picture
                    <Button
                      type="primary"
                      className="edit-image"
                      onClick={() => setModalShow((e) => !e)}
                    >
                      Edit
                    </Button>
                  </Table.Cell>
                  <Table.Cell>
                    {"picture" in user && user.picture !== "" ? (
                      <Image
                        width={150}
                        src={`http://localhost:1111/api/v1/frontend/public/images/${user.picture}`}
                      />
                    ) : (
                      <Image
                        width={150}
                        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                      />
                    )}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Name</Table.Cell>
                  <Table.Cell>{user.uname}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Email</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Phone</Table.Cell>
                  <Table.Cell>{user.phone}</Table.Cell>
                </Table.Row>

                {user.batchName && (
                  <Table.Row>
                    <Table.Cell>Batch Name</Table.Cell>
                    <Table.Cell>{user.batchName}</Table.Cell>
                  </Table.Row>
                )}

                <Table.Row>
                  <Table.Cell>Password</Table.Cell>
                  <Table.Cell>
                    <Button type="primary" onClick={handleToggle}>
                      Change
                    </Button>
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
      </Card>
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
      {toggle && (
        <Card className="update-course" title="Change Password">
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
            <Form.Item label="Old Password">
              <Input
                placeholder="old password"
                name="oldpassword"
                onChange={handleChange}
                value={inputField.oldpassword}
              />

              {err && err.oldpassword ? (
                <Alert
                  className="ant-err"
                  message={err.oldpassword}
                  banner
                  closable
                  type="error"
                />
              ) : (
                ""
              )}
            </Form.Item>

            <Form.Item label="New Password">
              <Input.Password
                placeholder="new password"
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

            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Button type="primary" onClick={handleChangePassword}>
                Update
              </Button>
            </Form.Item>
          </Form>
        </Card>
      )}
    </>
  );
}

export default Profile;
