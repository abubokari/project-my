import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { Card } from "antd";
import { Icon, Button, Table, Header, Modal } from "semantic-ui-react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
const baseUrl = import.meta.env.VITE_API_BASE_URL_KEY;

function Department() {
  const [rows, setRows] = useState([]);
  const [refresh, setRefresh] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const authUserInfo = useSelector((state) => state.userAuthenticate);

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
          setRows(response.data.data);
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

  const notifyDelete = () =>
    toast.success("Department remove successfully.", {
      position: "top-left",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  const handleDeleteDepartment = () => {
    if (deleteId) {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${baseUrl}/backend/department/delete/${deleteId}`,
      };

      axios
        .request(config)
        .then((response) => {
          if ("data" in response.data) {
            setDeleteId("");
            setOpen(false);
            setRefresh(Date.now());
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

  useEffect(() => {
    if (authUserInfo.userInfo.role !== "admin") {
      navigate("/");
    }
  }, []);

  return (
    <Card title="All Department List">
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
          <Button color="green" onClick={handleDeleteDepartment}>
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

      <Table celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>#ID</Table.HeaderCell>
            <Table.HeaderCell>Department Name</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell>Course</Table.HeaderCell>
            <Table.HeaderCell>Action</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {rows.length !== 0 ? (
            rows.map((el, index) => (
              <Table.Row key={index}>
                <Table.Cell>{index + 1}</Table.Cell>
                <Table.Cell>{el.title}</Table.Cell>
                <Table.Cell>
                  {el.description ? el.description : "Empty"}
                </Table.Cell>
                <Table.Cell>
                  {el.courseId
                    ? el.courseId.map((el, index, arr) =>
                        arr.length - 1 !== index ? (
                          <p key={index + 2}>{el.title}</p>
                        ) : (
                          el.title
                        )
                      )
                    : "Empty"}
                </Table.Cell>
                <Table.Cell>
                  <Button.Group>
                    <Button color="blue">
                      <NavLink to={`/department/edit/${el._id}`}>Edit</NavLink>
                    </Button>
                    <Button.Or />
                    <Button
                      color="google plus"
                      onClick={() => handleDelete(el._id)}
                    >
                      Delete
                    </Button>
                  </Button.Group>
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
      </Table>
    </Card>
  );
}

export default Department;
