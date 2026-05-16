import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import { toast } from 'react-toastify';

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();
        setLoading(true);

        AuthService.register(username, email, password).then(
            (response) => {
                toast.success(response.data.message || "Kaydınız başarıyla oluşturuldu! 🎉");
                AuthService.login(username, password).then(
                    () => {
                        navigate("/home");
                        window.location.reload();
                    },
                    () => {
                        navigate("/login");
                    }
                );
            },
            (error) => {
                toast.error(error);
                setLoading(false);
            }
        );
    };

    return (
        <div className="container d-flex align-items-center justify-content-center"
             style={{ minHeight: "90vh", padding: "40px 0" }}>
            <div className="card shadow-lg p-5 border-0 rounded-4" style={{ width: "100%", maxWidth: "550px" }}>
                <div className="text-center mb-4">
                    <h1 className="fw-bold text-success mb-2">Kayıt Ol</h1>
                    <p className="text-muted fs-5">NutriFit ailesine katılın.</p>
                </div>

                <form onSubmit={handleRegister}>
                    <div className="form-group mb-3">
                        <label className="fw-bold text-secondary mb-1">Kullanıcı Adı</label>
                        <input
                            type="text"
                            className="form-control form-control-lg bg-light border-0 p-3"
                            placeholder="Kullanıcı adınız"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group mb-3">
                        <label className="fw-bold text-secondary mb-1">E-posta</label>
                        <input
                            type="email"
                            className="form-control form-control-lg bg-light border-0 p-3"
                            placeholder="ornek@mail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group mb-4">
                        <label className="fw-bold text-secondary mb-1">Şifre</label>
                        <input
                            type="password"
                            className="form-control form-control-lg bg-light border-0 p-3"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button className="btn btn-success w-100 btn-lg shadow fw-bold py-3" disabled={loading}>
                        {loading ? (
                            <><span className="spinner-border spinner-border-sm me-2"></span>Kaydediliyor...</>
                        ) : "Hemen Katıl"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;