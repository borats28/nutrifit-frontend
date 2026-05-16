import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import UserService from "../services/user.service";
import {toast} from 'react-toastify'; // Toastify eklendi

const NewAddGoal = () => {
    const [hedefKilo, setHedefKilo] = useState("");
    const [hedefTarih, setHedefTarih] = useState("");
    const [targetBodyFat, setTargetBodyFat] = useState("");

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleAdd = (e) => {
        e.preventDefault();
        setLoading(true);

        const data = {
            hedefKilo: parseFloat(hedefKilo),
            hedefTarih,
            targetBodyFat: targetBodyFat ? parseFloat(targetBodyFat) : null
        };

        UserService.addGoal(data).then(
            () => {
                setLoading(false);
                toast.success("Hedefin başarıyla kaydedildi! 🎯");
                navigate("/home");
            },
            (err) => {
                toast.error(err);
                setLoading(false);
            }
        );
    };

    return (
        <div className="container d-flex align-items-center justify-content-center" style={{minHeight: "80vh"}}>
            <div className="card shadow-lg border-0 rounded-4 p-4" style={{maxWidth: "500px", width: "100%"}}>

                {/* MODERN BAŞLIK ALANI */}
                <div className="text-center mb-4">
                    <span style={{fontSize: "3rem"}} role="img" aria-label="target">🎯</span>
                    <h2 className="fw-bold mt-2 text-dark">Yeni Hedef Belirle</h2>
                    <p className="text-muted">Sağlık yolculuğunda yeni bir sayfa aç.</p>
                </div>

                <div className="card-body p-2">
                    <form onSubmit={handleAdd}>

                        {/* HEDEF KİLO */}
                        <div className="form-floating mb-3">
                            <input
                                type="number"
                                step="0.1"
                                className="form-control bg-light border-0 rounded-3"
                                id="hedefKiloInput"
                                placeholder="Örn: 75.5"
                                value={hedefKilo}
                                onChange={(e) => setHedefKilo(e.target.value)}
                                required
                            />
                            <label htmlFor="hedefKiloInput" className="text-muted">Hedef Kilo (kg)</label>
                        </div>

                        {/* HEDEF YAĞ ORANI */}
                        <div className="form-floating mb-3">
                            <input
                                type="number"
                                step="0.1"
                                className="form-control bg-light border-0 rounded-3"
                                id="yagOraniInput"
                                placeholder="Örn: 15"
                                value={targetBodyFat}
                                onChange={(e) => setTargetBodyFat(e.target.value)}
                            />
                            <label htmlFor="yagOraniInput" className="text-muted">Hedef Yağ Oranı % (Opsiyonel)</label>
                        </div>

                        {/* HEDEF TARİH */}
                        <div className="form-floating mb-4">
                            <input
                                type="date"
                                className="form-control bg-light border-0 rounded-3"
                                id="tarihInput"
                                value={hedefTarih}
                                onChange={(e) => setHedefTarih(e.target.value)}
                                required
                            />
                            <label htmlFor="tarihInput" className="text-muted">Hedef Tarih</label>
                        </div>

                        {/* BUTONLAR */}
                        <div className="d-grid gap-2">
                            <button
                                type="submit"
                                className="btn btn-primary btn-lg rounded-pill fw-bold shadow-sm"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        Kaydediliyor...
                                    </>
                                ) : "Hedefi Kaydet"}
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate("/home")}
                                className="btn btn-light btn-lg rounded-pill text-muted"
                                disabled={loading}
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

export default NewAddGoal;