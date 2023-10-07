import { useEffect, useState } from "react";
import { Card } from "antd";
import MCard from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { NavLink } from "react-router-dom";
import axios from "axios";

function Home() {
  const [course, setCourse] = useState([]);
  const [subCourse, setSubCourse] = useState([]);
  const baseUrl = import.meta.env.VITE_API_BASE_URL_KEY;
  const handleDepartment = (id) => {
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

      axios
        .request(config)
        .then((response) => {
          if ("data" in response.data) {
            setSubCourse(response.data.data);
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
          setCourse(response.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div>
      <Card title="All Department for 24/7 Support">
        <div>
          <div className="main-box">
            {course.length !== 0 ? (
              course.map((el, index) => (
                <NavLink to={`/chat/${el._id}`} key={index}>
                  <MCard sx={{ maxWidth: 345 }}>
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {el.title}
                      </Typography>
                    </CardContent>
                  </MCard>
                </NavLink>
              ))
            ) : (
              <MCard sx={{ maxWidth: 345 }}>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Loading...
                  </Typography>
                </CardContent>
              </MCard>
            )}
          </div>
          {/*           
          <div className="main-box data">
            {subCourse.length !== 0 &&
              course.length !== 0 &&
              subCourse.map((el, index) => (
                <Link href="/chat" key={index}>
                  <MCard sx={{ maxWidth: 345 }}>
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {el.title}
                      </Typography>
                    </CardContent>
                  </MCard>
                </Link>
              ))}
          </div> */}
        </div>
      </Card>
    </div>
  );
}

export default Home;
