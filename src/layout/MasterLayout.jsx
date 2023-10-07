import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { activeUser } from "../slices/userAuthenticationSlice";
import { NavLink } from "react-router-dom";
import { AppstoreOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { FiUser } from "react-icons/fi";
const {  Content, Sider } = Layout;

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const MasterLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const authUserInfo = useSelector((state) => state.userAuthenticate);
  const sessionDate = Math.round(Date.now() / 1000);
  const urlString = window.location.pathname.split("/");

  const [items, setItems] = useState([
    getItem("Teacher", "sub1", <LiaChalkboardTeacherSolid />, [
      getItem("Add Teacher", "/addteacher"),
      getItem("All Teacher", "/teachers"),
    ]),
    {
      type: "divider",
    },
    getItem("Student List", "sub2", <UsergroupAddOutlined />, [
      getItem("All Student", "/students"),
    ]),
    {
      type: "divider",
    },
    getItem("Department", "sub3", <AppstoreOutlined />, [
      getItem("Add Department", "/adddepartment"),
      getItem("All Department", "/department"),
    ]),
    {
      type: "divider",
    },
    getItem("Course", "sub4", <AppstoreOutlined />, [
      getItem("Add Course", "/addcourse"),
      getItem("All Course", "/course"),
    ]),
    {
      type: "divider",
    },
    getItem("Token", "sub5", <AppstoreOutlined />, [
      getItem("Add Token", "/addtoken"),
      getItem("All Token", "/token"),
    ]),
    {
      type: "divider",
    },
    getItem("Account", "sub6", <FiUser />, [
      getItem("User Account", "/profile"),
      getItem("Logout", "12"),
    ]),
    {
      type: "divider",
    },
  ]);

  const handleLogout = () => {
    dispatch(activeUser("logout"));
    localStorage.removeItem("user");
    navigate("/login");
  };

  const onClick = (e) => {
    if (e.key !== "12") {
      navigate(e.key);
    }

    if (e.keyPath[1] === "sub6") {
      if (e.key === "12") {
        handleLogout();
      }
    }
  };

  useEffect(() => {
    if (authUserInfo.userInfo === "logout") {
      navigate("/login");
    } else if (!(authUserInfo.userInfo.expireDate > sessionDate)) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    if (authUserInfo.userInfo.role === "student") {
      setItems(items.slice(items.length - 2, items.length - 1));
    } else if (authUserInfo.userInfo.role === "teacher") {
      setItems(items.slice(items.length - 2, items.length - 1));
    } else if (authUserInfo.userInfo.role === "teacher") {
      setItems(items.slice(0, items.length - 1));
    }
  }, []);

  return (
    <Layout>
      <Layout>
        <Sider
          width={200}
          style={{
            background: colorBgContainer,
          }}
        >
          <Menu
            onClick={onClick}
            mode="inline"
            items={items}
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            style={{
              height: "100vh",
              borderRight: 0,
            }}
          />
        </Sider>
        <Layout
          style={{
            padding: "0 24px 24px",
          }}
        >
          <Breadcrumb
            style={{
              margin: "16px 0",
            }}
          >
            <Breadcrumb.Item>
              <NavLink to="/">Dashboard</NavLink>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              {urlString[1] ? urlString[1] : "Home"}
            </Breadcrumb.Item>
          </Breadcrumb>

          <Content
            style={{
              padding: 24,
              margin: 0,
              height: "100%",
              background: colorBgContainer,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
export default MasterLayout;
