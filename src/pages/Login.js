import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        AuthService.login(username, password).then(
            () => {
                navigate("/home");
                window.location.reload();
            },
            (error) => {
                const resMessage =
                    (error.response && error.response.data && error.response.data.message) ||
                    error.message || error.toString();
                setLoading(false);
                setMessage(resMessage);
            }
        );
    };

    return (
        <div className="container page-center-container">
            <div className="card shadow-lg p-4 border-0 auth-card">
                <div className="text-center mb-4">
                    <h2 className="fw-bold text-primary">Giriş Yap</h2>
                    <p className="text-muted">Hoşgeldin! Hesabına erişmek için bilgelerini gir.</p>
                </div>
                <form onSubmit={handleLogin}>
                    {/*<NutrifitInputField
                        type="text"
                        label="Kullanıcı Adı"
                        value={username}
                        onChange={setUsername}
                    />*/}
                    <div className="form-group mb-3">
                        <label className="fw-bold text-secondary small mb-1">Kullanıcı Adı</label>
                        <input
                            type="text"
                            className="form-control form-control-lg bg-light border-0"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group mb-4">
                        <label className="fw-bold text-secondary small mb-1">Şifre</label>
                        <input
                            type="password"
                            className="form-control form-control-lg bg-light border-0"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button className="btn btn-primary w-100 btn-lg mb-3" disabled={loading}>
                        {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
                    </button>

                    {message && <div className="alert alert-danger text-center">{message}</div>}
                </form>
            </div>
        </div>
    );
};

export default Login;