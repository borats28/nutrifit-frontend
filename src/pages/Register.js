import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";

const Register = () => {
    const [username] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [successful, setSuccessful] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [adSoyad, setAdSoyad] = useState("");

    const handleRegister = (e) => {
        e.preventDefault();
        setMessage("");
        setSuccessful(false);
        setLoading(true);

        AuthService.register(username, email, password, adSoyad).then(
            (response) => {
                setMessage(response.data.message);
                setSuccessful(true);
                AuthService.login(username, password).then(
                    () => { navigate("/home"); window.location.reload(); },
                    () => { navigate("/login"); }
                );
            },
            (error) => {
                const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
                setMessage(resMessage);
                setSuccessful(false);
                setLoading(false);
            }
        );
    };

    return (
        <div className="container page-center-container">
            <div className="card shadow-lg p-4 border-0 auth-card">
                <div className="text-center mb-4">
                    <h2 className="fw-bold text-success">Kayıt Ol</h2>
                    <p className="text-muted">NutriFit ailesine katıl ve değişimi başlat.</p>
                </div>
                <form onSubmit={handleRegister}>
                    {!successful && (
                        <div>
                            <div className="form-group mb-3">
                                <label className="fw-bold text-secondary small mb-1">Adınız ve Soyadınız</label>
                                <input type="text" className="form-control form-control-lg bg-light border-0" value={adSoyad} onChange={(e) => setAdSoyad(e.target.value)} required />
                            </div>
                            <div className="form-group mb-3">
                                <label className="fw-bold text-secondary small mb-1">Email</label>
                                <input type="email" className="form-control form-control-lg bg-light border-0" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                            <div className="form-group mb-4">
                                <label className="fw-bold text-secondary small mb-1">Şifre</label>
                                <input type="password" className="form-control form-control-lg bg-light border-0" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </div>
                            <button className="btn btn-success w-100 btn-lg mb-3" disabled={loading}>
                                {loading ? "Kaydediliyor..." : "Kayıt Ol"}
                            </button>
                        </div>
                    )}
                    {message && <div className={successful ? "alert alert-success" : "alert alert-danger"}>{message}</div>}
                </form>
            </div>
        </div>
    );
};

export default Register;