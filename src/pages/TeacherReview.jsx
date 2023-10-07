import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { Card } from "antd";
import { Icon, Menu, Button, Table } from "semantic-ui-react";
import axios from "axios";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
const baseUrl = import.meta.env.VITE_API_BASE_URL_KEY;

function TeacherReview() {
  const [rows, setRows] = useState([]);
  let { id } = useParams();
  const navigate = useNavigate();
  const authUserInfo = useSelector((state) => state.userAuthenticate);
  const [arrayData, setArrayData] = useState([]);

  let [remind, setRemind] = useState({
    startNumber: 0,
    endNumber: 10,
  });

  let currentPageNumber = Math.ceil(remind.endNumber / 10);

  let showPerPageData = 10;

  useEffect(() => {
    if (authUserInfo.userInfo.role !== "admin") {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${baseUrl}/backend/message/allfeedback/${id}`,
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

          console.log("feedback", response.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

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

  const handleBack = () => {
    history.back();
  };

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

  return (
    <Card title="All Feedback List">
      <Table celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>#ID</Table.HeaderCell>
            <Table.HeaderCell>Student Name</Table.HeaderCell>
            <Table.HeaderCell>Student Email</Table.HeaderCell>
            <Table.HeaderCell>Teacher Name</Table.HeaderCell>
            <Table.HeaderCell>Support Time Start</Table.HeaderCell>
            <Table.HeaderCell>Support Time End</Table.HeaderCell>
            <Table.HeaderCell>Feedback</Table.HeaderCell>
            <Table.HeaderCell>Comment</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {arrayData.length !== 0 ? (
            arrayData.map((el, index) => (
              <Table.Row key={index}>
                <Table.Cell>{index + 1}</Table.Cell>
                <Table.Cell>{el.studentId.uname}</Table.Cell>
                <Table.Cell>{el.studentId.email}</Table.Cell>
                <Table.Cell>{el.teacherId.uname}</Table.Cell>
                <Table.Cell>{el.started_time}</Table.Cell>
                <Table.Cell>{el.end_time}</Table.Cell>
                <Table.Cell>{el.feedback}</Table.Cell>
                <Table.Cell>{el.comment ? el.comment : "Empty"}</Table.Cell>
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
      <Button
        content="Back"
        onClick={handleBack}
        icon="left arrow"
        labelPosition="left"
      />
    </Card>
  );
}

export default TeacherReview;
