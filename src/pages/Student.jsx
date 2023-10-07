import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Card, Alert } from "antd";
import {
  Icon,
  Menu,
  Button,
  Table,
  Header,
  Select,
  Modal,
  Input,
} from "semantic-ui-react";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

const baseUrl = import.meta.env.VITE_API_BASE_URL_KEY;

function Student() {
  const [rows, setRows] = useState([]);

  const [refresh, setRefresh] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const navigate = useNavigate();
  const authUserInfo = useSelector((state) => state.userAuthenticate);
  const [arrayData, setArrayData] = useState([]);

  let [remind, setRemind] = useState({
    startNumber: 0,
    endNumber: 10,
  });

  let currentPageNumber = Math.ceil(remind.endNumber / 10);
  const [open, setOpen] = useState(false);

  let showPerPageData = 10;

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${baseUrl}/backend/authentication/allstudent`,
    };

    axios
      .request(config)
      .then((response) => {
        if ("data" in response.data) {
          setRows(response.data.data);

          setRemind((data) => ({
            ...data,
            startNumber: 0,
            endNumber: 10,
          }));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [refresh]);

  const handleDelete = (id) => {
    setDeleteId(id);
    setOpen(true);
  };

  const handleLeft = () => {
    setRemind((data) => ({
      ...data,
      startNumber: data.startNumber - 10,
      endNumber: data.endNumber - 10,
    }));
  };

  const handleRight = () => {
    setRemind((data) => ({
      ...data,
      startNumber: data.startNumber + 10,
      endNumber: data.endNumber + 10,
    }));
  };

  useEffect(() => {
    const changeData = () => {
      setArrayData(rows.slice(remind.startNumber, remind.endNumber));
    };
    changeData();
  }, [remind]);

  const handleDemo = () => {};
  const handleCuctomPaginate = (data) => {
    let per_page_show = 10;
    let startNumbe = per_page_show * data - per_page_show;
    let endNumbe = per_page_show * data;

    setRemind((data) => ({
      ...data,
      startNumber: startNumbe,
      endNumber: endNumbe,
    }));
  };

  const [resetPassword, setResetPassword] = useState({
    email: "",
    password: "",
  });
  const [resetPassworde, setResetPassworde] = useState("");

  const handleEmailSend = () => {
    if (resetPassword.password == "") {
      setResetPassworde("Password field is required!");
    } else if (resetPassword.password.length < 6) {
      setResetPassworde("You must type a Minimum of 6 characters!");
    } else if (
      resetPassword.password !== "" &&
      resetPassword.password.length >= 6
    ) {
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${baseUrl}/backend/authentication/student/forgotpassword`,
        headers: {
          "Content-Type": "application/json",
        },
        data: { email: resetPassword.email, password: resetPassword.password },
      };

      axios
        .request(config)
        .then((response) => {
          if ("success" in response.data) {
            setForgotPassword(false);
            setResetPassword((prev) => ({
              ...prev,
              password: "",
            }));

            notify();

            console.log(response.data.success);
          } else if ("message" in response.data.error) {
            console.log(response.data.error.message);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const notify = () =>
    toast.success("Email send successfully.", {
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
    toast.success("Student remove successfully.", {
      position: "top-left",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  const [forgotPassword, setForgotPassword] = useState(false);
  const handleForgotPassword = (email) => {
    setForgotPassword(true);
    setResetPassword((prev) => ({ ...prev, email }));
  };

  useEffect(() => {
    if (authUserInfo.userInfo.role !== "admin") {
      navigate("/");
    }
  }, []);

  const handleChangeForgotPassword = (e) => {
    setResetPassword((prev) => ({
      ...prev,
      password: e.target.value,
    }));
    setResetPassworde("");
  };

  const handleDeleteStudent = () => {
    if (deleteId) {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${baseUrl}/backend/authentication/student/delete/${deleteId}`,
      };

      axios
        .request(config)
        .then((response) => {
          if ("data" in response.data) {
            setDeleteId("");
            setOpen(false);
            setRefresh(response.data.id);
            notifyDelete();
          } else if ("error" in response.data) {
            console.log(response.data.error);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const [myArr, setArr] = useState([{ key: "all", text: "All", value: "all" }]);

  const filterArray = (filterCriteria) => {
    const filteredRows = rows.filter((row) => {
      return (
        row._id.toLowerCase().includes(filterCriteria.toLowerCase()) ||
        row.uname.toLowerCase().includes(filterCriteria.toLowerCase()) ||
        row.email.toLowerCase().includes(filterCriteria.toLowerCase()) ||
        row.batchName.toLowerCase().includes(filterCriteria.toLowerCase()) ||
        row.phone.toString().includes(filterCriteria)
      );
    });
    return filteredRows;
  };

  const handleSearch = (e) => {
    if (e.target.value !== "") {
      let demoArray = [];
      filterArray(e.target.value).map((el) => {
        demoArray.push({ key: el._id, text: el.uname, value: el.uname });
      });
      setArr([{ key: "all", text: "All", value: "all" }, ...demoArray]);
    }
  };

  const handleSearchData = (e) => {
    if (e.target.innerHTML === "All") {
      console.log("alll", e.target.innerHTML);
    } else if (e.target.innerHTML !== "All") {
      if (e.target.childNodes[0].innerHTML !== undefined) {
        if (e.target.childNodes[0].innerHTML === "All") {
          setArrayData(rows.slice(remind.startNumber, remind.endNumber));
        } else {
          setArrayData([
            rows.find((age) => age.uname === e.target.childNodes[0].innerHTML),
          ]);
        }
      } else if (e.target.innerHTML) {
        if (e.target.innerHTML === "All") {
          setArrayData(rows.slice(remind.startNumber, remind.endNumber));
        } else {
          setArrayData([rows.find((age) => age.uname === e.target.innerHTML)]);
        }
      }
    }
  };

  return (
    <Card title="All Student List">
      <Modal
        closeIcon
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
      >
        <Header icon="archive" content="Are You Sure?" />
        <Modal.Content>
          <h4>Do you want to delete this User ?</h4>
        </Modal.Content>
        <Modal.Actions>
          <Button color="red" onClick={() => setOpen(false)}>
            <Icon name="remove" /> No
          </Button>
          <Button color="green" onClick={handleDeleteStudent}>
            <Icon name="checkmark" /> Yes
          </Button>
        </Modal.Actions>
      </Modal>

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

      <Modal
        closeIcon
        open={forgotPassword}
        onClose={() => {
          setForgotPassword(false);
          setResetPassword((prev) => ({ ...prev, password: "" }));
          setResetPassworde("");
        }}
        onOpen={() => setForgotPassword(true)}
        className="set-password"
      >
        <Header content="Password reset" />
        <Modal.Content>
          <TextField
            label="Set Password"
            onChange={handleChangeForgotPassword}
            value={resetPassword.password}
            multiline
            className="input-set-password"
          />

          {resetPassworde ? (
            <Alert
              className="ant-err"
              message={resetPassworde}
              banner
              closable
              type="error"
            />
          ) : (
            ""
          )}
        </Modal.Content>
        <Modal.Actions>
          <Button color="red" onClick={() => setForgotPassword(false)}>
            <Icon name="remove" /> Cancel
          </Button>
          <Button color="green" onClick={handleEmailSend}>
            <Icon name="checkmark" /> Send
          </Button>
        </Modal.Actions>
      </Modal>

      <Input type="text" onChange={handleSearch} placeholder="Search..." action>
        <input />
        <Select
          compact
          options={myArr}
          onChange={handleSearchData}
          defaultValue="all"
        />
      </Input>

      <Table celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>#ID</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Phone</Table.HeaderCell>
            <Table.HeaderCell>Reset Password</Table.HeaderCell>
            <Table.HeaderCell>Batch</Table.HeaderCell>
            <Table.HeaderCell>Action</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {arrayData.length !== 0 ? (
            arrayData.map((el, index) => (
              <Table.Row key={index}>
                <Table.Cell>{index + 1}</Table.Cell>
                <Table.Cell>{el.uname}</Table.Cell>
                <Table.Cell>{el.email}</Table.Cell>
                <Table.Cell>{el.phone}</Table.Cell>
                <Table.Cell>
                  <Button
                    onClick={() => handleForgotPassword(el.email)}
                    color="instagram"
                  >
                    Send
                  </Button>
                </Table.Cell>
                <Table.Cell>{el.batchName}</Table.Cell>
                <Table.Cell>
                  <Button
                    color="google plus"
                    onClick={() => handleDelete(el._id)}
                  >
                    Delete
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell textAlign="center" colSpan="9">
                <h4>Loading...</h4>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>

        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan="9">
              <Menu floated="right" pagination>
                <Menu.Item
                  as="a"
                  onClick={remind.startNumber >= 1 ? handleLeft : handleDemo}
                  icon
                >
                  <Icon name="chevron left" />
                </Menu.Item>

                {currentPageNumber >= 4 && (
                  <Menu.Item as="a" onClick={() => handleCuctomPaginate(1)}>
                    1
                  </Menu.Item>
                )}

                {currentPageNumber >= 5 && (
                  <Menu.Item as="a" onClick={() => handleCuctomPaginate(2)}>
                    2
                  </Menu.Item>
                )}

                {currentPageNumber > 5 && <Menu.Item as="a">...</Menu.Item>}

                {currentPageNumber - 2 > 0 && (
                  <Menu.Item
                    as="a"
                    onClick={() => handleCuctomPaginate(currentPageNumber - 2)}
                  >
                    {currentPageNumber - 2}
                  </Menu.Item>
                )}

                {currentPageNumber - 1 > 0 && (
                  <Menu.Item
                    as="a"
                    onClick={() => handleCuctomPaginate(currentPageNumber - 1)}
                  >
                    {currentPageNumber - 1}
                  </Menu.Item>
                )}

                <Menu.Item
                  as="a"
                  className="active-pagination"
                  onClick={() => handleCuctomPaginate(currentPageNumber)}
                >
                  {currentPageNumber}
                </Menu.Item>

                {currentPageNumber + 1 <=
                  Math.ceil(rows.length / showPerPageData) &&
                  currentPageNumber + 1 <
                    Math.ceil(rows.length / showPerPageData) - 1 && (
                    <Menu.Item
                      as="a"
                      onClick={() =>
                        handleCuctomPaginate(currentPageNumber + 1)
                      }
                    >
                      {currentPageNumber + 1}
                    </Menu.Item>
                  )}

                {currentPageNumber + 2 <=
                  Math.ceil(rows.length / showPerPageData) &&
                  currentPageNumber + 2 <
                    Math.ceil(rows.length / showPerPageData) - 1 && (
                    <Menu.Item
                      as="a"
                      onClick={() =>
                        handleCuctomPaginate(currentPageNumber + 2)
                      }
                    >
                      {currentPageNumber + 2}
                    </Menu.Item>
                  )}

                {currentPageNumber <
                  Math.ceil(rows.length / showPerPageData) - 1 &&
                  currentPageNumber + 3 <
                    Math.ceil(rows.length / showPerPageData) - 1 && (
                    <Menu.Item as="a">...</Menu.Item>
                  )}

                {currentPageNumber <
                  Math.ceil(rows.length / showPerPageData) - 1 && (
                  <Menu.Item
                    as="a"
                    onClick={() =>
                      handleCuctomPaginate(
                        Math.ceil(rows.length / showPerPageData) - 1
                      )
                    }
                  >
                    {Math.ceil(rows.length / showPerPageData) - 1}
                  </Menu.Item>
                )}

                {currentPageNumber <
                  Math.ceil(rows.length / showPerPageData) && (
                  <Menu.Item
                    as="a"
                    onClick={() =>
                      handleCuctomPaginate(
                        Math.ceil(rows.length / showPerPageData)
                      )
                    }
                  >
                    {Math.ceil(rows.length / showPerPageData)}
                  </Menu.Item>
                )}

                <Menu.Item
                  as="a"
                  onClick={
                    rows.length > remind.endNumber ? handleRight : handleDemo
                  }
                  icon
                >
                  <Icon name="chevron right" />
                </Menu.Item>
              </Menu>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    </Card>
  );
}

export default Student;
