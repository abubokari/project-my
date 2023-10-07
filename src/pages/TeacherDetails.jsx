import React, { useEffect, useState } from "react";
import { Card, Image } from "antd";
import { Button, Table } from "semantic-ui-react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

function TeacherDetails() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL_KEY;
  const [teacher, setTeacher] = useState({});
  const navigate = useNavigate();
  const authUserInfo = useSelector((state) => state.userAuthenticate);
  const [err, setErr] = useState("");
  let { id } = useParams();
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
            setErr(response.data.error);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  return (
    <Card title="Teacher Info">
      <Table definition>
        <Table.Body>
          {err == "" && "email" in teacher ? (
            <>
              <Table.Row>
                <Table.Cell>Picture</Table.Cell>
                <Table.Cell>
                  {"picture" in teacher && teacher.picture !== "" ? (
                    <Image
                      width={150}
                      src={`http://localhost:1111/api/v1/frontend/public/images/${teacher.picture}`}
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
                <Table.Cell>{teacher.uname}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Email</Table.Cell>
                <Table.Cell>{teacher.email}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Phone</Table.Cell>
                <Table.Cell>{teacher.phone}</Table.Cell>
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
                </Table.Cell>
              </Table.Row>
            </>
          ) : (
            <Table.Row>
              <Table.Cell>Error</Table.Cell>
              <Table.Cell>
                <b>{err}</b>
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
  );
}

export default TeacherDetails;
