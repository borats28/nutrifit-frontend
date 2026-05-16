import React, {useState} from "react";
import ReactMarkdown from "react-markdown";
import UserService from "../services/user.service";
import {toast} from 'react-toastify';

const BloodTestUpload = () => {
    const [file, setFile] = useState(null);
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);

    const handleUpload = () => {
        if (!file) {
            toast.warning("Lütfen önce bir dosya seçin.");
            return;
        }

        setLoading(true);
        setResult("");

        UserService.uploadBloodTest(file).then(
            (res) => {
                // Backend'den gelen analiz sonucunu state'e aktar
                setResult(res.data.analysisResult);
                setLoading(false);
                toast.success("Tahlil başarıyla analiz edildi ve kaydedildi!");
            },
            (err) => {
                toast.error("Tahlil yüklenemedi: " + err);
                setLoading(false);
            }
        );
    };

    return (
        <div className="container mt-5">
            <div className="card shadow mx-auto" style={{maxWidth: "700px"}}>
                <div className="card-header bg-danger text-white text-center p-4">
                    <h3 className="mb-0">🩸 Kan Tahlili Analizi</h3>
                </div>
                <div className="card-body p-5 text-center">
                    <p className="text-muted">Tahlil kağıdının fotoğrafını yükle. AI değerleri okuyup beslenme planına
                        entegre etsin.</p>

                    {/* Dosya seçildiğinde state'i güncelle */}
                    <input
                        type="file"
                        className="form-control mb-3"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files[0])}
                    />

                    <button
                        className="btn btn-danger w-100 py-2 fw-bold"
                        onClick={handleUpload}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                Analiz Ediliyor (Bu işlem biraz sürebilir)...
                            </>
                        ) : "Tahlili Yükle ve Analiz Et"}
                    </button>

                    {result && (
                        <div className="alert alert-light mt-4 text-start border shadow-sm">
                            <h5 className="border-bottom pb-2 mb-3">📋 Analiz Sonucu:</h5>
                            <div className="fs-6 lh-lg">
                                <ReactMarkdown>{result}</ReactMarkdown>
                            </div>
                            <hr/>
                            <small className="text-success fw-bold">
                                ✅ Bu sonuçlar kaydedildi. Diyet planı oluştururken dikkate alınacak.
                            </small>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BloodTestUpload;