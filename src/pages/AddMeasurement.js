import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../services/user.service";

const AddMeasurement = () => {
    const [kilo, setKilo] = useState("");
    const [boy, setBoy] = useState("");
    const [yas, setYas] = useState("");
    const [cinsiyet, setCinsiyet] = useState("ERKEK");
    const [hareketSeviyesi, setHareketSeviyesi] = useState("AZ_HAREKETLI");

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleAdd = (e) => {
        e.preventDefault();
        setLoading(true);

        const data = {
            kilo: parseFloat(kilo),
            boy: parseFloat(boy),
            yas: parseInt(yas),
            cinsiyet: cinsiyet,
            hareketSeviyesi: hareketSeviyesi
        };

        UserService.addMeasurement(data).then(
            () => {
                setLoading(false);
                navigate("/home");
            },
            (error) => {
                console.log(error);
                setLoading(false);
                alert("Ölçüm eklenirken bir hata oluştu.");
            }
        );
    };

    return (
        <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: "90vh", padding: "20px 0" }}>
            <div className="card shadow-lg border-0 rounded-4 p-4" style={{ maxWidth: "600px", width: "100%" }}>

                <div className="text-center mb-4">
                    <span style={{ fontSize: "3rem" }}>📏</span>
                    <h2 className="fw-bold mt-2 text-dark">Vücut Analizi Gir</h2>
                    <p className="text-muted">Doğru kalori hesabı için bilgileri eksiksiz doldur.</p>
                </div>

                <div className="card-body p-2">
                    <form onSubmit={handleAdd}>

                        <div className="row g-2">
                            {/* KİLO */}
                            <div className="col-md-6">
                                <div className="form-floating mb-3">
                                    <input type="number" step="0.1" className="form-control bg-light border-0 rounded-3"
                                        id="kiloInput" placeholder="kg" value={kilo} onChange={(e) => setKilo(e.target.value)} required />
                                    <label htmlFor="kiloInput" className="text-muted">Kilo (kg)</label>
                                </div>
                            </div>
                            {/* BOY */}
                            <div className="col-md-6">
                                <div className="form-floating mb-3">
                                    <input type="number" step="1" className="form-control bg-light border-0 rounded-3"
                                        id="boyInput" placeholder="cm" value={boy} onChange={(e) => setBoy(e.target.value)} required />
                                    <label htmlFor="boyInput" className="text-muted">Boy (cm)</label>
                                </div>
                            </div>
                        </div>

                        <div className="row g-2">
                            {/* YAŞ */}
                            <div className="col-md-6">
                                <div className="form-floating mb-3">
                                    <input type="number" className="form-control bg-light border-0 rounded-3"
                                        id="yasInput" placeholder="Yaş" value={yas} onChange={(e) => setYas(e.target.value)} required />
                                    <label htmlFor="yasInput" className="text-muted">Yaş</label>
                                </div>
                            </div>
                            {/* CİNSİYET */}
                            <div className="col-md-6">
                                <div className="form-floating mb-3">
                                    <select className="form-select bg-light border-0 rounded-3" id="cinsiyetSelect"
                                        value={cinsiyet} onChange={(e) => setCinsiyet(e.target.value)}>
                                        <option value="ERKEK">Erkek</option>
                                        <option value="KADIN">Kadın</option>
                                    </select>
                                    <label htmlFor="cinsiyetSelect">Cinsiyet</label>
                                </div>
                            </div>
                        </div>

                        {/* HAREKET SEVİYESİ */}
                        <div className="form-floating mb-4">
                            <select className="form-select bg-light border-0 rounded-3" id="hareketSelect"
                                value={hareketSeviyesi} onChange={(e) => setHareketSeviyesi(e.target.value)}>
                                <option value="HAREKETSIZ">Hareketsiz (Masa başı iş, spor yok)</option>
                                <option value="AZ_HAREKETLI">Az Hareketli (Haftada 1-3 gün hafif spor)</option>
                                <option value="ORTA_HAREKETLI">Orta Hareketli (Haftada 3-5 gün spor)</option>
                                <option value="COK_HAREKETLI">Çok Hareketli (Haftada 6-7 gün ağır spor)</option>
                                <option value="PROFESYONEL">Profesyonel / Çok Yoğun</option>
                            </select>
                            <label htmlFor="hareketSelect">Günlük Aktivite Düzeyi</label>
                        </div>

                        <div className="d-grid gap-2">
                            <button className="btn btn-primary btn-lg rounded-pill fw-bold shadow-sm" disabled={loading}>
                                {loading ? "Hesaplanıyor..." : "Analizi Kaydet"}
                            </button>
                            <button type="button" onClick={() => navigate("/home")} className="btn btn-light btn-lg rounded-pill text-muted">
                                İptal
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddMeasurement;