import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import userService from "../services/user.service";

const AddHealth = () => {
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleAdd = (e) => {
        setLoading(true);

        const data = {
            notes: notes
        };

        userService.addHealthRecord(data).then(
            () => {
                setLoading(false);
                navigate("/profile"); 
            },
            (error) => {
                console.log(error);
                setLoading(false);
                alert("Kayıt eklenirken bir hata oluştu.");
            }
        );
        e.preventDefault();
    };

    return (
        <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: "80vh" }}>
            <div className="card shadow-lg border-0 rounded-4 p-4" style={{ maxWidth: "600px", width: "100%" }}>

                <div className="text-center mb-4">
                    <span style={{ fontSize: "3rem" }}>🩺</span>
                    <h2 className="fw-bold mt-2 text-dark">Sağlık Durumu Ekle</h2>
                    <p className="text-muted">Alerjiler, sakatlıklar veya kronik rahatsızlıklar...</p>
                </div>

                <div className="card-body p-2">
                    <form onSubmit={handleAdd}>

                        <div className="alert alert-info border-0 rounded-3 mb-4">
                            <small>
                                💡 <strong>İpucu:</strong> Buraya girdiğin bilgiler (Örn: "Gluten alerjim var", "Bel fıtığım var") Yapay Zeka tarafından dikkate alınır ve Diyet/Spor planın buna göre hazırlanır.
                            </small>
                        </div>

                        {/* AÇIKLAMA GİRİŞİ */}
                        <div className="form-floating mb-4">
                            <textarea
                                className="form-control bg-light border-0 rounded-3"
                                placeholder="Detay girin"
                                id="notesInput"
                                style={{ height: "150px" }}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                required
                            ></textarea>
                            <label htmlFor="notesInput" className="text-muted">Rahatsızlığınızı detaylıca yazın</label>
                        </div>

                        <div className="d-grid gap-2">
                            <button
                                className="btn btn-danger btn-lg rounded-pill fw-bold shadow-sm"
                                disabled={loading}
                            >
                                {loading ? "Kaydediliyor..." : "Kaydı Ekle"}
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate("/home")}
                                className="btn btn-light btn-lg rounded-pill text-muted"
                            >
                                İptal
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddHealth;