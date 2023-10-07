import { Route, Routes } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Message from "./pages/Message";
import MasterLayout from "./layout/MasterLayout";
import Error from "./pages/Error";
import { io } from "socket.io-client";
import AddTeacher from "./pages/AddTeacher";
import Teacher from "./pages/Teacher";
import TeacherDetails from "./pages/TeacherDetails";
import TeacherReview from "./pages/TeacherReview";
import EditTeacher from "./pages/EditTeacher";
import Student from "./pages/Student";
import AddDepartment from "./pages/AddDepartment";
import Department from "./pages/Department";
import DepartmentEdit from "./pages/DepartmentEdit";
import Course from "./pages/Course";
import AddCourse from "./pages/AddCourse";
import EditCourse from "./pages/EditCourse";
import AddToken from "./pages/AddToken";
import Token from "./pages/Token";
import Profile from "./pages/Profile";
import Zoom from "./pages/Zoom";
const socket = io("https://pera.onrender.com/");

function App() {
  return (
    <Routes>
      <Route path="/" element={<MasterLayout />}>
        <Route index element={<Home />} />
        <Route path="/chat/:id" element={<Message socket={socket} />}></Route>
        <Route path="/addteacher" element={<AddTeacher />}></Route>
        <Route path="/teachers" element={<Teacher />}></Route>
        <Route path="/students" element={<Student />}></Route>
        <Route path="/department" element={<Department />}></Route>
        <Route path="/department/edit/:id" element={<DepartmentEdit />}></Route>
        <Route path="/adddepartment" element={<AddDepartment />}></Route>
        <Route path="/course" element={<Course />}></Route>

        <Route path="/profile" element={<Profile />}></Route>
        <Route path="/zoom" element={<Zoom />}></Route>


        <Route path="/addtoken" element={<AddToken />}></Route>
        <Route path="/token" element={<Token />}></Route>
        <Route path="/course/edit/:id" element={<EditCourse />}></Route>
        <Route path="/addcourse" element={<AddCourse />}></Route>
        <Route path="/teachers/review/:id" element={<TeacherReview />}></Route>
        <Route
          path="/teachers/details/:id"
          element={<TeacherDetails />}
        ></Route>
        <Route path="/teachers/edit/:id" element={<EditTeacher />}></Route>
        <Route path="*" element={<Error />}></Route>
      </Route>

      <Route path="/login" element={<SignIn />}></Route>
      <Route
        path="/cit/student/support/quality/auth/registration"
        element={<SignUp />}
      ></Route>
    </Routes>
  );
}

export default App;
