import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import AuthService from "../services/auth.service";
import {toast} from 'react-toastify';

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);

        AuthService.login(username, password).then(
            () => {
                toast.success("Başarıyla giriş yapıldı! 👋");
                navigate("/home");
                window.location.reload();
            },
            (error) => {
                let customError = "Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.";

                if (error.includes("500") || error.includes("401") || error.includes("Unauthorized")) {
                    customError = "Kullanıcı adı veya şifre hatalı! ❌";
                } else if (error.includes("Network Error")) {
                    customError = "Sunucuya bağlanılamadı. Lütfen internetinizi kontrol edin.";
                }

                toast.error(customError);
                setLoading(false);
            }
        ).catch(() => {
            toast.error("Geçersiz Kullanıcı Bilgileri");
            setLoading(false);
        });
    };

    return (
        <div className="container d-flex align-items-center justify-content-center" style={{minHeight: "80vh"}}>
            <div className="card shadow-lg p-5 border-0 rounded-4" style={{width: "100%", maxWidth: "500px"}}>
                <div className="text-center mb-4">
                    <h1 className="fw-bold text-primary mb-2">Giriş Yap</h1>
                    <p className="text-muted fs-5">Hesabınıza erişmek için bilgilerinizi girin.</p>
                </div>
                <form onSubmit={handleLogin}>
                    <div className="form-group mb-4">
                        <label className="fw-bold text-secondary mb-2">Kullanıcı Adı</label>
                        <input
                            type="text"
                            className="form-control form-control-lg bg-light border-0 p-3"
                            placeholder="Kullanıcı adınız"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group mb-4">
                        <label className="fw-bold text-secondary mb-2">Şifre</label>
                        <input
                            type="password"
                            className="form-control form-control-lg bg-light border-0 p-3"
                            placeholder="Şifreniz"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button className="btn btn-primary w-100 btn-lg shadow fw-bold py-3" disabled={loading}>
                        {loading ? (
                            <><span className="spinner-border spinner-border-sm me-2"></span>Giriş Yapılıyor...</>
                        ) : "Giriş Yap"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;