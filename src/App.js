import React, {useState, useEffect} from "react";
import {Routes, Route, Link} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AuthService from "./services/auth.service";
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import AddMeasurement from "./pages/AddMeasurement";
import AddHealth from "./pages/AddHealth";
import BodyAnalysis from "./pages/BodyAnalysis";
import AiChat from "./pages/AiChat";
import BloodTest from "./pages/BloodTestUpload";
import NewAddGoal from "./pages/NewAddGoal";
import {Navigate} from "react-router-dom";

const ProtectedRoute = ({children, currentUser}) => {
    if (!currentUser) {
        return <Navigate to="/login" replace/>;
    }
    return children;
};

function App() {
    const [isUserLoading, setIsUserLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(undefined);

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (user) {
            setCurrentUser(user);
        }
        setIsUserLoading(false);
    }, []);

    const logOut = () => {
        AuthService.logout();
        setCurrentUser(undefined);
    };

    if (isUserLoading) {
        return <>Yükleniyor...</>
    }

    return (
        <div>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />

            <nav className="navbar navbar-expand navbar-dark bg-dark">
                <div className="container">
                    <Link to={"/"} className="navbar-brand fw-bold">
                        NutriFit
                    </Link>

                    <div className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <Link to={currentUser ? "/home" : "/"} className="nav-link">
                                Ana Sayfa
                            </Link>
                        </li>
                    </div>

                    {currentUser ? (
                        <div className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <Link to={"/profile"} className="nav-link">
                                    👤 {currentUser.username}
                                </Link>
                            </li>
                            <li className="nav-item">
                                <a href="/login" className="nav-link" onClick={logOut}>
                                    🚪 Çıkış Yap
                                </a>
                            </li>
                        </div>
                    ) : (
                        <div className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <Link to={"/login"} className="nav-link">
                                    Giriş
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to={"/register"} className="nav-link">
                                    Kayıt Ol
                                </Link>
                            </li>
                        </div>
                    )}
                </div>
            </nav>

            <div className="container mt-3">
                <Routes>
                    <Route path="/" element={<LandingPage/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>

                    <Route path="/home" element={<ProtectedRoute currentUser={currentUser}><Home/></ProtectedRoute>}/>
                    <Route path="/profile"
                           element={<ProtectedRoute currentUser={currentUser}><Profile/></ProtectedRoute>}/>
                    <Route path="/add-measurement"
                           element={<ProtectedRoute currentUser={currentUser}><AddMeasurement/></ProtectedRoute>}/>
                    <Route path="/add-goal"
                           element={<ProtectedRoute currentUser={currentUser}><NewAddGoal/></ProtectedRoute>}/>
                    <Route path="/add-health"
                           element={<ProtectedRoute currentUser={currentUser}><AddHealth/></ProtectedRoute>}/>
                    <Route path="/body-analysis"
                           element={<ProtectedRoute currentUser={currentUser}><BodyAnalysis/></ProtectedRoute>}/>
                    <Route path="/chat" element={<ProtectedRoute currentUser={currentUser}><AiChat/></ProtectedRoute>}/>
                    <Route path="/blood-test"
                           element={<ProtectedRoute currentUser={currentUser}><BloodTest/></ProtectedRoute>}/>
                </Routes>
            </div>
        </div>
    );
}

export default App;