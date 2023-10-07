import { useEffect, useState } from "react";
import { DownloadOutlined } from "@ant-design/icons";
import { Card, Button, Select, Form, Input, Alert } from "antd";
import MCard from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Badge, Avatar } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ScrollToBottom from "react-scroll-to-bottom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useDispatch, useSelector } from "react-redux";
import Checkbox from "@mui/material/Checkbox";
import logo from "../assets/images/favicon.png";
import { styled } from "@mui/material/styles";
import ImageIcon from "@mui/icons-material/Image";
import Plane from "../assets/images/plane.png";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import { red } from "@mui/material/colors";
import { MdOutlineCancel } from "react-icons/md";
import { IoCheckmarkSharp } from "react-icons/io5";
import { BsSignStop } from "react-icons/bs";
import Divider from "@mui/material/Divider";
import Buttons from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Modal, Header, Icon, Button as ButtonS } from "semantic-ui-react";
import { changeStatus } from "../slices/statusSlice";
import { changeStatust } from "../slices/teacherStatusSlice";
import { updateStudent } from "../slices/studentRequestSlice";
import { updateUser } from "../slices/userInfoSlice";
import { updateMessageList } from "../slices/messageListSlice";
import { updateMessageId } from "../slices/messageIdSlice";
import { updateTeacherList } from "../slices/teacherListSlice";
import { supportStopStatus } from "../slices/studentSupportStopSlice";
import { supportStopStatusTeacher } from "../slices/teacherSupportStopSlice";
import FileDownload from "js-file-download";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment/moment";

const { Option } = Select;

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

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.4)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(1.8)",
      opacity: 0,
    },
  },
}));

const imageUrl = import.meta.env.VITE_API_IMAGE_URL_KEY;

function Message({ socket }) {
  const [course, setCourse] = useState([]);
  let { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_BASE_URL_KEY;
  useEffect(() => {
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
            setCourse(response.data.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);
  const authUserInfo = useSelector((state) => state.userAuthenticate);
  const stopStudentChat = useSelector(
    (state) => state.supportStopStudent.status
  );

  const stopTeacherChat = useSelector(
    (state) => state.supportStopTeacher.status
  );

  const [stopSupportButtonTea, setStopSupportButtonTea] =
    useState(stopTeacherChat);

  const teacherStatus = useSelector((state) => state.status.statusCondition);
  const listOfStudent = useSelector((state) => state.allStudent.data);
  const listOfMessage = useSelector((state) => state.messageList.data);
  const listOfTeacher = useSelector((state) => state.teacherList.data);
  const teacherStatusToggle = useSelector(
    (state) => state.teacherToggle.statusCondition
  );

  const [messageRender, setMessageRender] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [messageList, setMessageList] = useState(listOfMessage);
  const uniqueMessageList = [...new Set(messageList)];

  uniqueMessageList.sort((a, b) => {
    const nameA = Number(a.orderId);
    const nameB = Number(b.orderId);
    if (nameA < nameB) {
      return 1;
    }
    if (nameA > nameB) {
      return -1;
    }

    return 0;
  });

  const [teacherList, setTeacherList] = useState(listOfTeacher);
  const [studentList, setStudentList] = useState(listOfStudent);
  const [teacherAll, setTeacherAll] = useState([]);
  const [storeTeacher, setStoreTeacher] = useState([]);

  const uniqueListTeacher = [...new Set(teacherList)];

  uniqueListTeacher.sort((a, b) => {
    const nameA = Number(a.orderId);
    const nameB = Number(b.orderId);
    if (nameA < nameB) {
      return 1;
    }
    if (nameA > nameB) {
      return -1;
    }

    return 0;
  });

  const messageIdStore = useSelector((state) => state.message.data);
  const [allStudent, setAllStudent] = useState([]);
  const [checked, setChecked] = useState([]);
  const [dateTime, setDateTime] = useState("");

  const uniqueArray = [...new Set(studentList)];

  useEffect(() => {
    if (authUserInfo.userInfo.role === "admin") {
      navigate("/");
    }
  }, []);

  const [teacherListToggle, setTeacherListToggle] = useState(teacherStatus);
  const [departmentListToggle, setDepartmentListToggle] =
    useState(teacherStatusToggle);

  const formatAMPM = (date) => {
    let month = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let currentMonth = month[date.getMonth()];
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = `${currentMonth} ${date.getDate()}, ${hours}:${minutes} ${ampm}`;
    return strTime;
  };

  const removeStudent = (id) => {
    if (id) {
      socket.emit("studentRemoved", {
        id: id,
      });

      socket.on("removedStudent", (data) => {
        if (data) {
          const updatedStudentList = studentList.filter(
            (student) => student._id !== data
          );
          const updatedTeacherList = teacherAll.filter(
            (student) => student._id !== data
          );
          const uniqueStudent = [...new Set(updatedStudentList)];

          setStudentList(uniqueStudent);
          setTeacherAll(updatedTeacherList);
          dispatch(updateStudent([...uniqueStudent]));
          localStorage.setItem(
            "listStudent",
            JSON.stringify([...uniqueStudent])
          );

          if (
            authUserInfo.userInfo.role === "student" &&
            authUserInfo.userInfo.id === data
          ) {
            setDepartmentListToggle(true);
            setTeacherListToggle(false);

            dispatch(changeStatus(false));
            localStorage.setItem("status", JSON.stringify(false));

            dispatch(changeStatust(true));
            localStorage.setItem("teacherStatus", JSON.stringify(true));
          }
        }
      });
    }
  };

  const removedStudentGlobal = () => {
    socket.emit("studentRemovedGlobal", {
      id: authUserInfo.userInfo.id,
    });
  };

  socket.on("removedStudentAll", (data) => {
    if (data) {
      const updatedStudentList = studentList.filter(
        (student) => student._id !== data
      );
      const updatedTeacherList = teacherAll.filter(
        (student) => student._id !== data
      );
      const uniqueStudent = [...new Set(updatedStudentList)];

      setStudentList(uniqueStudent);
      setTeacherAll(updatedTeacherList);
      dispatch(updateStudent([...uniqueStudent]));
      localStorage.setItem("listStudent", JSON.stringify([...uniqueStudent]));

      if (
        authUserInfo.userInfo.role === "student" &&
        authUserInfo.userInfo.id === data
      ) {
        setDepartmentListToggle(true);
        setTeacherListToggle(false);
        setChecked([]);
        dispatch(changeStatus(false));
        localStorage.setItem("status", JSON.stringify(false));

        dispatch(changeStatust(true));
        localStorage.setItem("teacherStatus", JSON.stringify(true));
      }
    }
  });

  const handleToggle = (value) => () => {
    setChecked(value);
    setDepartmentListToggle(false);
    setTeacherListToggle(true);

    dispatch(changeStatus(true));
    localStorage.setItem("status", JSON.stringify(true));

    dispatch(changeStatust(false));
    localStorage.setItem("teacherStatus", JSON.stringify(false));

    let courseId = course.find((val, index) => index == value);
    setDateTime(formatAMPM(new Date()));

    if (courseId._id) {
      socket.emit("studentRequest", {
        id: courseId._id,
        dateTime: formatAMPM(new Date()),
        studentId: authUserInfo.userInfo.id,
      });
    }
  };

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${baseUrl}/backend/authentication/allstudentf`,
    };

    axios
      .request(config)
      .then((response) => {
        if ("data" in response.data) {
          setAllStudent(response.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${baseUrl}/backend/authentication/allteacherlist`,
    };

    axios
      .request(config)
      .then((response) => {
        if ("data" in response.data) {
          setStoreTeacher(response.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const [showMessages, setShowMessages] = useState([]);
  const [messageShowAll, setMessageShowAll] = useState(true);

  showMessages.sort((a, b) => {
    const nameA = Number(a.created_at);
    const nameB = Number(b.created_at);
    if (nameA > nameB) {
      return 1;
    }
    if (nameA < nameB) {
      return -1;
    }

    return 0;
  });

  useEffect(() => {
    if ("teacherId" in messageIdStore) {
      const leftMessage = {
        msgsenderid: authUserInfo.userInfo.id,
        msgreceiveid:
          messageIdStore.teacherId === authUserInfo.userInfo.id
            ? messageIdStore.studentId
            : messageIdStore.teacherId,
      };
      const rightMessage = {
        msgsenderid:
          messageIdStore.teacherId === authUserInfo.userInfo.id
            ? messageIdStore.studentId
            : messageIdStore.teacherId,
        msgreceiveid: authUserInfo.userInfo.id,
      };

      let config = {
        method: "get",
        maxBodyLength: Infinity,
        headers: {
          "Content-Type": "application/json",
          ids: JSON.stringify([leftMessage, rightMessage]),
        },
        url: `${baseUrl}/backend/message/allmessage`,
      };

      axios
        .request(config)
        .then((response) => {
          if ("data" in response.data) {
            setShowMessages(response.data.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [messageShowAll, messageRender]);

  socket.on("removedStudentGlobal", (data) => {
    if (data) {
      const updatedStudentList = studentList.filter(
        (student) => student._id !== data.studentId
      );
      const updatedTeacherList = teacherAll.filter(
        (student) => student._id !== data.studentId
      );
      const uniqueStudent = [...new Set(updatedStudentList)];

      setStudentList(uniqueStudent);
      setTeacherAll(updatedTeacherList);
      dispatch(updateStudent([...uniqueStudent]));
      localStorage.setItem("listStudent", JSON.stringify([...uniqueStudent]));

      if (
        authUserInfo.userInfo.role === "student" &&
        authUserInfo.userInfo.id === data.studentId
      ) {
        setTeacherListToggle(false);
        setChecked([]);
        dispatch(changeStatus(false));
        localStorage.setItem("status", JSON.stringify(false));
      }
    }
  });

  const handleMessageList = (el) => {
    let time = formatAMPM(new Date());
    let sortId = Date.now();

    let userData = JSON.stringify({
      teacherId: authUserInfo.userInfo.id,
      studentId: el._id,
      studentEmail: el.email,
      teacherEmail: authUserInfo.userInfo.email,
      startTime: time,
      orderId: sortId,
      endTime: "",
    });

    dispatch(
      updateUser({
        teacherId: authUserInfo.userInfo.id,
        studentId: el._id,
        studentEmail: el.email,
        teacherEmail: authUserInfo.userInfo.email,
        startTime: time,
        orderId: sortId,
        endTime: "",
      })
    );

    localStorage.setItem("userInfo", userData);

    if (authUserInfo.userInfo.role === "teacher") {
      let messageDataIds = {
        teacherId: authUserInfo.userInfo.id,
        studentId: el._id,
        started_time: time,
        orderId: sortId,
        endTime: "",
      };

      socket.emit("messageLocalIds", messageDataIds);
    }

    socket.emit("addStudent", {
      teacherId: authUserInfo.userInfo.id,
      studentId: el._id,
      studentEmail: el.email,
      teacherEmail: authUserInfo.userInfo.email,
      startTime: time,
      orderId: sortId,
      endTime: "",
    });

    socket.on("removedStudentSingle", (data) => {
      if (data) {
        if (authUserInfo.userInfo.id === data.teacherId) {
          const myArrayDataOne = [...messageList, data];
          const myArrayDataTwo = [...uniqueMessageList, data];

          const uniqueArrayOne = myArrayDataOne.filter((item, index, self) => {
            return (
              index ===
              self.findIndex(
                (i) => i.studentId === item.studentId && i._id === item._id
              )
            );
          });

          const uniqueArrayTwo = myArrayDataTwo.filter((item, index, self) => {
            return (
              index ===
              self.findIndex(
                (i) => i.studentId === item.studentId && i._id === item._id
              )
            );
          });

          // setMessageList((prev) => [...prev, data]);

          // dispatch(updateMessageList([...uniqueMessageList, data]));

          // localStorage.setItem(
          //   "listMessage",
          //   JSON.stringify([...uniqueMessageList, data])
          // );

          setMessageList(uniqueArrayOne);

          dispatch(updateMessageList(uniqueArrayTwo));

          localStorage.setItem("listMessage", JSON.stringify(uniqueArrayTwo));
        }
      }
    });
  };

  const handleStoreId = (el) => {
    if (authUserInfo.userInfo.role === "teacher") {
      dispatch(updateMessageId(el));
      localStorage.setItem("messageId", JSON.stringify(el));

      socket.emit("messageLocalIds", { ...el, editText: "stop" });
      setMessageRender(Date.now());
    } else if (authUserInfo.userInfo.role === "student") {
      dispatch(updateMessageId(el));
      localStorage.setItem("messageId", JSON.stringify(el));

      socket.emit("messageLocalIds", el);
      setMessageRender(Date.now());
    }
  };

  socket.on("forTeacherList", (data) => {
    if (data) {
      if (authUserInfo.userInfo.id === data.studentId) {
        // change this code.....
        const myArrayDataTwos = [...uniqueListTeacher, data];

        const uniqueArrayTwos = myArrayDataTwos.filter((item, index, self) => {
          return (
            index ===
            self.findIndex(
              (i) => i.teacherId === item.teacherId && i._id === item._id
            )
          );
        });

        setTeacherList(uniqueArrayTwos);
        dispatch(updateTeacherList(uniqueArrayTwos));
        localStorage.setItem("listTeacher", JSON.stringify(uniqueArrayTwos));
      }
    }
  });

  const download = (e, imageId, id) => {
    e.preventDefault();
    axios({
      url: `${baseUrl}/backend/message/image/download/${imageId}`,
      method: "GET",
      responseType: "blob",
    }).then((res) => {
      FileDownload(res.data, imageId);

      // picture
      socket.emit("messageDeleteImage", {
        id: id,
        picture: imageId,
        allmsg: showMessages,
      });
    });
  };

  const [modalShow, setModalShow] = useState(false);
  const [imageUpload, setImageUpload] = useState("");
  const [errmsg, setErrmsg] = useState("");

  const handleImageData = (e) => {
    setImageUpload(e.target.files[0]);
  };

  const handleSubmit = () => {
    const messageText = messageInput.trim();
    const regex = /^(https?:\/\/)/;
    const emptyRegex = /\S/;

    if (emptyRegex.test(messageText)) {
      if (regex.test(messageText)) {
        let messageData = {
          msgsenderid: authUserInfo.userInfo.id,
          msgreceiveid:
            messageIdStore.teacherId === authUserInfo.userInfo.id
              ? messageIdStore.studentId
              : messageIdStore.teacherId,
          message: messageText,
          messageType: "link",
        };

        socket.emit("messageCreate", messageData);
      } else {
        let messageData = {
          msgsenderid: authUserInfo.userInfo.id,
          msgreceiveid:
            messageIdStore.teacherId === authUserInfo.userInfo.id
              ? messageIdStore.studentId
              : messageIdStore.teacherId,
          message: messageText,
          messageType: "text",
        };

        socket.emit("messageCreate", messageData);
      }
    }
  };

  const notifyImage = () =>
    toast.success("Picture upload successfully.", {
      position: "top-left",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  const handlePress = (e) => {
    if (e.key === "Enter") {
      if (authUserInfo.userInfo.role === "student") {
        if (stopSupportButtonStu) {
          const messageText = messageInput.trim();
          const regex = /^(https?:\/\/)/;
          const emptyRegex = /\S/;

          if (emptyRegex.test(messageText)) {
            if (regex.test(messageText)) {
              let messageData = {
                msgsenderid: authUserInfo.userInfo.id,
                msgreceiveid:
                  messageIdStore.teacherId === authUserInfo.userInfo.id
                    ? messageIdStore.studentId
                    : messageIdStore.teacherId,
                message: messageText,
                messageType: "link",
              };

              socket.emit("messageCreate", messageData);
            } else {
              let messageData = {
                msgsenderid: authUserInfo.userInfo.id,
                msgreceiveid:
                  messageIdStore.teacherId === authUserInfo.userInfo.id
                    ? messageIdStore.studentId
                    : messageIdStore.teacherId,
                message: messageText,
                messageType: "text",
              };

              socket.emit("messageCreate", messageData);
            }
          }
        }
      } else if (authUserInfo.userInfo.role === "teacher") {
        if (stopSupportButtonTea.length != 0) {
          if (
            stopSupportButtonTea.find(
              (info) => info.studentId === messageIdStore.studentId
            ).button
          ) {
            const messageText = messageInput.trim();
            const regex = /^(https?:\/\/)/;
            const emptyRegex = /\S/;

            if (emptyRegex.test(messageText)) {
              if (regex.test(messageText)) {
                let messageData = {
                  msgsenderid: authUserInfo.userInfo.id,
                  msgreceiveid:
                    messageIdStore.teacherId === authUserInfo.userInfo.id
                      ? messageIdStore.studentId
                      : messageIdStore.teacherId,
                  message: messageText,
                  messageType: "link",
                };

                socket.emit("messageCreate", messageData);
              } else {
                let messageData = {
                  msgsenderid: authUserInfo.userInfo.id,
                  msgreceiveid:
                    messageIdStore.teacherId === authUserInfo.userInfo.id
                      ? messageIdStore.studentId
                      : messageIdStore.teacherId,
                  message: messageText,
                  messageType: "text",
                };

                socket.emit("messageCreate", messageData);
              }
            }
          }
        }
      }
    }
  };

  const handleSubmitImage = () => {
    let messageData = {
      picture: imageUpload,
      msgsenderid: authUserInfo.userInfo.id,
      msgreceiveid:
        messageIdStore.teacherId === authUserInfo.userInfo.id
          ? messageIdStore.studentId
          : messageIdStore.teacherId,
      message: "demo",
      messageType: "images",
    };

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${baseUrl}/backend/message/imagecreate`,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: messageData,
    };

    axios
      .request(config)
      .then((response) => {
        if ("error" in response.data) {
          setErrmsg(response.data.error);
        } else if ("success" in response.data) {
          const date = new Date(response.data.data.created_at);
          const seconds = Math.round(date.getTime() / 1000);

          const messageObj = {
            _id: response.data.data._id,
            msgreceiveid: response.data.data.msgreceiveid,
            msgsenderid: response.data.data.msgsenderid,
            message: response.data.data.message,
            messageType: response.data.data.messageType,
            created_at: seconds,
            updated_at: response.data.data.updated_at,
            __v: 0,
          };

          setShowMessages((prev) => [...prev, messageObj]);

          socket.emit("messageImageRander", "data-rerander");

          setImageUpload("");
          notifyImage();
          setModalShow(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  function convertTimestamp(isoTimestamp) {
    // Parse the ISO timestamp into a Date object
    const date = new Date(isoTimestamp);

    // Extract year, month, day, hour, and minute components
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-based
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");

    // Create the custom format string
    const customFormat = `${year}${month}${day} ${hour}:${minute}`;

    return customFormat;
  }

  const [feedbackDataStore, setFeedbackDataStore] = useState({});

  const [stopSupportButtonStu, setStopSupportButtonStu] =
    useState(stopStudentChat);

  useEffect(() => {
    socket.on("connected", (message) => {
      console.log(message);
    });

    socket.on("createMessage", (data) => {
      if (data) {
        if ("success" in data) {
          setMessageInput("");
          setShowMessages((prev) => [...prev, data]);
        }
      }
    });

    socket.on("deleteImageMessage", (data) => {
      if (data) {
        setShowMessages(data);
        setMessageRender(Date.now());
      }
    });

    socket.on("imageRanderMessage", (data) => {
      if (data) {
        setMessageRender(Date.now());
      }
    });

    socket.on("idsLocalMessage", (data) => {
      if (data) {
        if (authUserInfo.userInfo.role === "student") {
          if (data.studentId === authUserInfo.userInfo.id) {
            if ("editText" in data) {
            } else {
              setStopSupportButtonStu(true);
              dispatch(supportStopStatus(true));
              localStorage.setItem("studentSupportStop", JSON.stringify(true));
            }

            dispatch(updateMessageId(data));
            localStorage.setItem("messageId", JSON.stringify(data));
            setMessageShowAll(!messageShowAll);
          }
        } else if (authUserInfo.userInfo.role === "teacher") {
          if (data.teacherId === authUserInfo.userInfo.id) {
            if ("editText" in data) {
            } else {
              let stopObj = {
                teacherId: authUserInfo.userInfo.id,
                studentId: data.studentId,
                button: true,
              };

              setStopSupportButtonTea((prev) => {
                const allArray = [stopObj, ...prev];

                const uniqueData = {};

                const result = allArray.filter((item) => {
                  if (!uniqueData[item.studentId]) {
                    uniqueData[item.studentId] = true;
                    return true;
                  }
                  return false;
                });

                dispatch(supportStopStatusTeacher([...result]));

                localStorage.setItem(
                  "teacherSupportStop",
                  JSON.stringify([...result])
                );

                return [...result];
              });
            }

            dispatch(updateMessageId(data));
            localStorage.setItem("messageId", JSON.stringify(data));
            setMessageShowAll(!messageShowAll);
          }
        }
      }
    });

    socket.on("requestStudent", (data) => {
      setTeacherAll(data);

      if (authUserInfo.userInfo.role === "teacher") {
        if (
          data.findIndex((el) => el._id === authUserInfo.userInfo.id) !== -1
        ) {
          setStudentList((myData) => {
            dispatch(
              updateStudent([
                ...myData,
                { ...data[data.length - 1], started_time: Date.now() },
              ])
            );

            localStorage.setItem(
              "listStudent",
              JSON.stringify([
                ...myData,
                { ...data[data.length - 1], started_time: Date.now() },
              ])
            );

            return [
              ...myData,
              { ...data[data.length - 1], started_time: Date.now() },
            ];
          });
        }
      }
    });

    socket.on("showFeedback", (data) => {
      if (data) {
        if (authUserInfo.userInfo.id === data.studentId) {
          setSupportModel(true);
          setFeedbackDataStore(data);

          setStopSupportButtonStu(false);
          dispatch(supportStopStatus(false));
          localStorage.setItem("studentSupportStop", JSON.stringify(false));
        }
      }
    });

    socket.on("addFeedback", (data) => {
      if (data) {
        setFeedbackDataStore({});
        setComment("");
        setSupportModel(false);
      }
    });

    return () => {
      socket.off("connected");
      socket.off("createMessage");
      socket.off("deleteImageMessage");
      socket.off("idsLocalMessage");
      socket.off("requestStudent");
      socket.off("imageRanderMessage");
      socket.off("showFeedback");
      socket.off("addFeedback");
    };
  }, []);

  const [supportModel, setSupportModel] = useState(false);

  const [comment, setComment] = useState("");
  const [feedback, setFeedback] = useState("");
  const [feedbackErr, setFeedbackErr] = useState(false);

  const handleChangeFee = (data) => {
    setFeedback(data);
    setFeedbackErr(false);
  };

  const handleStopSupport = (data) => {
    const updatedData = stopSupportButtonTea.map((item) => {
      if (item.studentId === data.studentId) {
        return { ...item, button: false };
      }
      return item;
    });

    setStopSupportButtonTea(updatedData);
    dispatch(supportStopStatusTeacher([...updatedData]));
    localStorage.setItem(
      "teacherSupportStop",
      JSON.stringify([...updatedData])
    );

    socket.emit("feedbackShow", { ...data, endTime: formatAMPM(new Date()) });
  };

  const handleSubmitFeedback = () => {
    if (feedback == "") {
      setFeedbackErr(true);
    } else {
      socket.emit("feedbackAdd", {
        feedback,
        comment,
        data: feedbackDataStore,
      });
      setDepartmentListToggle(true);
      dispatch(changeStatust(true));
      localStorage.setItem("teacherStatus", JSON.stringify(true));
    }
  };

  const handleEmpty = () => {};

  // console.log("messageIdStore", messageIdStore);

  return (
    <>
      <Card title="All Course for 24/7 Support">
        <div className="contents">
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
              <ButtonS color="red" onClick={() => setModalShow(false)}>
                <Icon name="remove" /> Cancel
              </ButtonS>
              <ButtonS color="green" onClick={handleSubmitImage}>
                <Icon name="checkmark" /> Update
              </ButtonS>
            </Modal.Actions>
          </Modal>

          <Modal
            closeIcon
            open={supportModel}
            onClose={() => {
              setSupportModel(false);
              setFeedbackDataStore({});
              setComment("");
              setDepartmentListToggle(true);
              dispatch(changeStatust(true));
              localStorage.setItem("teacherStatus", JSON.stringify(true));
            }}
            className="set-password"
          >
            <Header content="Student Feedback" />
            <Modal.Content>
              <Form
                name="basic"
                labelCol={{
                  span: 4,
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
                <Form.Item label="Feedback">
                  <Select
                    placeholder="select your experience"
                    onChange={handleChangeFee}
                    name="feedback"
                  >
                    <Option value="Good">Good</Option>
                    <Option value="Batter">Batter</Option>
                    <Option value="Best">Best</Option>
                    <Option value="Excellent">Excellent</Option>
                  </Select>

                  {feedbackErr && (
                    <Alert
                      className="ant-err"
                      message="Feedback field is required!"
                      banner
                      closable
                      type="error"
                    />
                  )}
                </Form.Item>
                <Form.Item label="Comment">
                  <Input.TextArea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="your comment"
                    autoSize={{ minRows: 4, maxRows: 6 }}
                  />
                </Form.Item>
              </Form>
            </Modal.Content>
            <Modal.Actions>
              <ButtonS color="green" onClick={handleSubmitFeedback}>
                Submit
              </ButtonS>
            </Modal.Actions>
          </Modal>

          <div className="content-leftsidebar">
            {authUserInfo.userInfo.role === "student" &&
              departmentListToggle && (
                <MCard sx={{ maxWidth: 410, marginBottom: 3 }}>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      Department All Course
                    </Typography>

                    <List
                      sx={{
                        width: "100%",
                        maxWidth: 400,
                        bgcolor: "background.paper",
                      }}
                      className="course-title"
                    >
                      {course.length !== 0
                        ? course.map((value, index) => {
                            const labelId = `checkbox-list-label-${index}`;

                            return (
                              <ListItem key={index} disablePadding>
                                <ListItemButton
                                  role={undefined}
                                  onClick={handleToggle(index)}
                                  dense
                                >
                                  <ListItemIcon>
                                    <Checkbox
                                      edge="start"
                                      checked={checked === index ? true : false}
                                      tabIndex={-1}
                                      disableRipple
                                      inputProps={{
                                        "aria-labelledby": labelId,
                                      }}
                                    />
                                  </ListItemIcon>
                                  <ListItemText
                                    id={labelId}
                                    primary={`${value.title}`}
                                  />
                                </ListItemButton>
                              </ListItem>
                            );
                          })
                        : ""}
                    </List>
                  </CardContent>
                </MCard>
              )}

            {teacherListToggle && (
              <MCard sx={{ maxWidth: 410, marginBottom: 3 }}>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Support Teacher List
                  </Typography>
                  <CardHeader
                    avatar={
                      <Avatar
                        sx={{ bgcolor: red[500] }}
                        aria-label="recipe"
                        src={logo}
                      >
                        C
                      </Avatar>
                    }
                    action={
                      <>
                        <span className="wait-please">wait please</span>
                        <IconButton
                          aria-label="settings"
                          onClick={removedStudentGlobal}
                        >
                          <MdOutlineCancel />
                        </IconButton>
                      </>
                    }
                    title="Cit 24/7 Support"
                    subheader={dateTime}
                  />
                </CardContent>
              </MCard>
            )}

            {studentList.length != 0 &&
              authUserInfo.userInfo.role === "teacher" && (
                <MCard sx={{ maxWidth: 410, marginBottom: 3 }}>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      Support Student List
                    </Typography>

                    {studentList.length != 0 &&
                      uniqueArray.map((el, index) => (
                        <>
                          <CardHeader
                            key={index}
                            avatar={
                              el.picture ? (
                                <Avatar
                                  aria-label="recipe"
                                  src={`${imageUrl}/${el.picture}`}
                                >
                                  C
                                </Avatar>
                              ) : (
                                <Avatar
                                  sx={{ bgcolor: red[500] }}
                                  aria-label="recipe"
                                  src={logo}
                                >
                                  C
                                </Avatar>
                              )
                            }
                            action={
                              <>
                                <IconButton
                                  aria-label="settings"
                                  onClick={() => removeStudent(el._id)}
                                >
                                  <MdOutlineCancel />
                                </IconButton>
                                <IconButton
                                  aria-label="settings"
                                  onClick={() => handleMessageList(el)}
                                >
                                  <IoCheckmarkSharp />
                                </IconButton>
                              </>
                            }
                            title={el.uname}
                            subheader={formatAMPM(new Date(el.started_time))}
                          />
                          {index + 1 !== uniqueArray.length ? <Divider /> : ""}
                        </>
                      ))}
                  </CardContent>
                </MCard>
              )}

            {messageList.length !== 0 && (
              <MCard sx={{ maxWidth: 410 }}>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Message List
                  </Typography>
                  {messageList.length !== 0 &&
                    uniqueMessageList.length !== 0 &&
                    allStudent.length !== 0 &&
                    uniqueMessageList.map((el, index) => (
                      <>
                        <CardHeader
                          avatar={
                            allStudent.find(
                              (iteam) => iteam._id == el.studentId
                            ).picture ? (
                              <Avatar
                                sx={{ bgcolor: red[500] }}
                                aria-label="recipe"
                                src={`${imageUrl}/${
                                  allStudent.find(
                                    (iteam) => iteam._id == el.studentId
                                  ).picture
                                }`}
                              >
                                C
                              </Avatar>
                            ) : (
                              <Avatar
                                sx={{ bgcolor: red[500] }}
                                aria-label="recipe"
                                src={logo}
                              >
                                C
                              </Avatar>
                            )
                          }
                          action={
                            stopSupportButtonTea.length != 0 ? (
                              stopSupportButtonTea.find(
                                (info) => info.studentId === el.studentId
                              ).button ? (
                                <IconButton
                                  aria-label="settings"
                                  onClick={() => handleStopSupport(el)}
                                >
                                  <BsSignStop />
                                </IconButton>
                              ) : (
                                ""
                              )
                            ) : (
                              ""
                            )
                          }
                          title={
                            allStudent.find(
                              (iteam) => iteam._id == el.studentId
                            ).uname
                          }
                          subheader={el.started_time}
                          onClick={() => handleStoreId(el)}
                        />

                        {index + 1 !== uniqueMessageList.length ? (
                          <Divider />
                        ) : (
                          ""
                        )}
                      </>
                    ))}
                </CardContent>
              </MCard>
            )}

            {authUserInfo.userInfo.role === "student" &&
              teacherList.length != 0 &&
              storeTeacher.length != 0 &&
              uniqueListTeacher.length != 0 && (
                <MCard sx={{ maxWidth: 410 }}>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      Message List
                    </Typography>

                    {teacherList.length != 0 &&
                      storeTeacher.length != 0 &&
                      allStudent.length != 0 &&
                      uniqueListTeacher.length != 0 &&
                      uniqueListTeacher.map((el, index) => (
                        <>
                          <CardHeader
                            avatar={
                              allStudent.find(
                                (iteam) => iteam._id == el.studentId
                              ).picture ? (
                                <Avatar
                                  sx={{ bgcolor: red[500] }}
                                  aria-label="recipe"
                                  src={`${imageUrl}/${
                                    storeTeacher.find(
                                      (iteam) => iteam._id == el.teacherId
                                    ).picture
                                  }`}
                                >
                                  C
                                </Avatar>
                              ) : (
                                <Avatar
                                  sx={{ bgcolor: red[500] }}
                                  aria-label="recipe"
                                  src={logo}
                                >
                                  C
                                </Avatar>
                              )
                            }
                            title={
                              storeTeacher.find(
                                (iteam) => iteam._id == el.teacherId
                              ).uname
                            }
                            subheader={el.started_time}
                            onClick={() => handleStoreId(el)}
                          />

                          {index + 1 !== uniqueListTeacher.length ? (
                            <Divider />
                          ) : (
                            ""
                          )}
                        </>
                      ))}
                  </CardContent>
                </MCard>
              )}
          </div>

          <div className="content-rightsidebar">
            <div className="content-rightbar-top">
              <div className="message-topleft">
                {"orderId" in messageIdStore ? (
                  ""
                ) : (
                  <StyledBadge
                    overlap="circular"
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    variant="dot"
                    id="active-user"
                  >
                    <Avatar
                      alt="Remy Sharp"
                      sx={{ width: 50, height: 50 }}
                      src={logo}
                    />
                  </StyledBadge>
                )}

                {authUserInfo.userInfo.role === "student" &&
                "orderId" in messageIdStore ? (
                  authUserInfo.userInfo.id === messageIdStore.studentId ? (
                    storeTeacher.length != 0 &&
                    storeTeacher.find(
                      (el) => el._id === messageIdStore.teacherId
                    ).picture ? (
                      <StyledBadge
                        overlap="circular"
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        variant="dot"
                        id="active-user"
                      >
                        <Avatar
                          alt="Remy Sharp"
                          sx={{ width: 50, height: 50 }}
                          src={`${imageUrl}/${
                            storeTeacher.find(
                              (el) => el._id === messageIdStore.teacherId
                            ).picture
                          }`}
                        />
                      </StyledBadge>
                    ) : (
                      <StyledBadge
                        overlap="circular"
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        variant="dot"
                        id="active-user"
                      >
                        <Avatar
                          alt="Remy Sharp"
                          sx={{ width: 50, height: 50 }}
                          src={logo}
                        />
                      </StyledBadge>
                    )
                  ) : (
                    <StyledBadge
                      overlap="circular"
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                      }}
                      variant="dot"
                      id="active-user"
                    >
                      <Avatar
                        alt="Remy Sharp"
                        sx={{ width: 50, height: 50 }}
                        src={logo}
                      />
                    </StyledBadge>
                  )
                ) : (
                  ""
                )}

                {authUserInfo.userInfo.role === "teacher" &&
                "orderId" in messageIdStore ? (
                  authUserInfo.userInfo.id === messageIdStore.teacherId ? (
                    allStudent.length != 0 &&
                    allStudent.find((el) => el._id === messageIdStore.studentId)
                      .picture ? (
                      <StyledBadge
                        overlap="circular"
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        variant="dot"
                        id="active-user"
                      >
                        <Avatar
                          alt="Remy Sharp"
                          sx={{ width: 50, height: 50 }}
                          src={`${imageUrl}/${
                            allStudent.find(
                              (el) => el._id === messageIdStore.studentId
                            ).picture
                          }`}
                        />
                      </StyledBadge>
                    ) : (
                      <StyledBadge
                        overlap="circular"
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        variant="dot"
                        id="active-user"
                      >
                        <Avatar
                          alt="Remy Sharp"
                          sx={{ width: 50, height: 50 }}
                          src={logo}
                        />
                      </StyledBadge>
                    )
                  ) : (
                    <StyledBadge
                      overlap="circular"
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                      }}
                      variant="dot"
                      id="active-user"
                    >
                      <Avatar
                        alt="Remy Sharp"
                        sx={{ width: 50, height: 50 }}
                        src={logo}
                      />
                    </StyledBadge>
                  )
                ) : (
                  ""
                )}

                <div>
                  {"orderId" in messageIdStore ? (
                    ""
                  ) : (
                    <h3 className="message-sendername">Cit 24/7 Support</h3>
                  )}

                  {authUserInfo.userInfo.role === "student" &&
                  "orderId" in messageIdStore ? (
                    authUserInfo.userInfo.id === messageIdStore.studentId ? (
                      storeTeacher.length != 0 &&
                      storeTeacher.find(
                        (el) => el._id === messageIdStore.teacherId
                      ).uname ? (
                        <h3 className="message-sendername">
                          {
                            storeTeacher.find(
                              (el) => el._id === messageIdStore.teacherId
                            ).uname
                          }
                        </h3>
                      ) : (
                        ""
                      )
                    ) : (
                      <h3 className="message-sendername">Cit 24/7 Support</h3>
                    )
                  ) : (
                    ""
                  )}

                  {authUserInfo.userInfo.role === "teacher" &&
                  "orderId" in messageIdStore ? (
                    authUserInfo.userInfo.id === messageIdStore.teacherId ? (
                      allStudent.length != 0 &&
                      allStudent.find(
                        (el) => el._id === messageIdStore.studentId
                      ).uname ? (
                        <h3 className="message-sendername">
                          {
                            allStudent.find(
                              (el) => el._id === messageIdStore.studentId
                            ).uname
                          }
                        </h3>
                      ) : (
                        ""
                      )
                    ) : (
                      <h3 className="message-sendername">Cit 24/7 Support</h3>
                    )
                  ) : (
                    ""
                  )}
                  <p className="message-useracive">Online</p>
                </div>
              </div>
              <div>
                <MoreVertIcon className="content__top__icon" />
              </div>
            </div>

            <ScrollToBottom className="content-centermsg">
              {showMessages.length != 0 &&
                showMessages.map((item, index) =>
                  item.msgsenderid === authUserInfo.userInfo.id ? (
                    <div className="content-centermsg-leftbar" key={index}>
                      {item.messageType === "text" ? (
                        <>
                          <p className="main-message-left">
                            <p className="sendername-message">{item.message}</p>
                          </p>
                          <p className="sendername-messageleftbar">
                            {moment(
                              convertTimestamp(item.updated_at),
                              "YYYYMMDD hh:mm"
                            ).fromNow()}
                          </p>
                        </>
                      ) : item.messageType === "link" ? (
                        <>
                          <p className="main-message-left">
                            <a
                              href={item.message}
                              target="_blank"
                              className="sendername-message link-left"
                            >
                              {item.message}
                            </a>
                          </p>

                          <p className="sendername-messageleftbar">
                            {moment(
                              convertTimestamp(item.updated_at),
                              "YYYYMMDD hh:mm"
                            ).fromNow()}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="main-message-left">
                            <p className="sendername-message">
                              <span className="image-download-photo">
                                Photo
                              </span>
                              {item.message ? (
                                <Button
                                  type="primary"
                                  onClick={(e) =>
                                    download(e, item.message, item._id)
                                  }
                                  icon={<DownloadOutlined />}
                                >
                                  Download
                                </Button>
                              ) : (
                                "Removed"
                              )}
                            </p>
                          </p>
                          <p className="sendername-messageleftbar">
                            {moment(
                              convertTimestamp(item.updated_at),
                              "YYYYMMDD hh:mm"
                            ).fromNow()}
                          </p>
                        </>
                      )}
                    </div>
                  ) : item.msgreceiveid === authUserInfo.userInfo.id &&
                    item.messageType === "text" ? (
                    <div className="content-centermsg-rightbar">
                      <p className="main-message-rightbar">{item.message}</p>
                      <p className="sendername-messagerightbar">
                        {moment(
                          convertTimestamp(item.updated_at),
                          "YYYYMMDD hh:mm"
                        ).fromNow()}
                      </p>
                    </div>
                  ) : item.msgreceiveid === authUserInfo.userInfo.id &&
                    item.messageType === "link" ? (
                    <div className="content-centermsg-rightbar">
                      <a
                        href={item.message}
                        target="_blank"
                        className="main-message-rightbar link-right"
                      >
                        {item.message}
                      </a>
                      <p className="sendername-messagerightbar">
                        {moment(
                          convertTimestamp(item.updated_at),
                          "YYYYMMDD hh:mm"
                        ).fromNow()}
                      </p>
                    </div>
                  ) : item.msgreceiveid === authUserInfo.userInfo.id &&
                    item.messageType === "images" ? (
                    <div className="content-centermsg-rightbar">
                      <p className="main-message-rightbar">
                        <span className="image-download-photo">Photo</span>

                        {item.message ? (
                          <Button
                            type="primary"
                            onClick={(e) => download(e, item.message, item._id)}
                            icon={<DownloadOutlined />}
                          >
                            Download
                          </Button>
                        ) : (
                          "Removed"
                        )}
                      </p>
                      <p className="sendername-messagerightbar">
                        {moment(
                          convertTimestamp(item.updated_at),
                          "YYYYMMDD hh:mm"
                        ).fromNow()}
                      </p>
                    </div>
                  ) : (
                    ""
                  )
                )}
            </ScrollToBottom>

            <div className="message-sendbox">
              <div className="message-sendboxleft">
                <input
                  type="text"
                  className="message-inputbox"
                  placeholder="Message"
                  onKeyUp={handlePress}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                />
                <ImageIcon
                  className="messgae-btncamera"
                  onClick={
                    authUserInfo.userInfo.role === "student"
                      ? stopSupportButtonStu
                        ? () => setModalShow((e) => !e)
                        : handleEmpty
                      : authUserInfo.userInfo.role === "teacher"
                      ? stopSupportButtonTea.length != 0
                        ? stopSupportButtonTea.find(
                            (info) =>
                              info.studentId === messageIdStore.studentId
                          ).button
                          ? () => setModalShow((e) => !e)
                          : handleEmpty
                        : handleEmpty
                      : ""
                  }
                />
              </div>

              <div className="message-sendboxright">
                <span
                  className="message-sendbtn"
                  onClick={
                    authUserInfo.userInfo.role === "student"
                      ? stopSupportButtonStu
                        ? handleSubmit
                        : handleEmpty
                      : authUserInfo.userInfo.role === "teacher"
                      ? stopSupportButtonTea.length != 0
                        ? stopSupportButtonTea.find(
                            (info) =>
                              info.studentId === messageIdStore.studentId
                          ).button
                          ? handleSubmit
                          : handleEmpty
                        : handleEmpty
                      : ""
                  }
                >
                  <img src={Plane} alt="submiticon" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}

export default Message;
