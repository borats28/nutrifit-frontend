import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import UserService from "../services/user.service";

const BloodTestUpload = () => {
    const [file, setFile] = useState(null);
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);

    const handleUpload = () => {
        if (!file) return;
        setLoading(true);
        UserService.uploadBloodTest(file).then(
            (res) => {
                setResult(res.data.analysisResult);
                setLoading(false);
            },
            (err) => {
                console.log(err);
                setLoading(false);
            }
        );
    };

    return (
        <div className="container mt-5">
            <div className="card shadow mx-auto" style={{ maxWidth: "700px" }}>
                <div className="card-header bg-danger text-white text-center p-4">
                    <h3>🩸 Kan Tahlili Analizi</h3>
                </div>
                <div className="card-body p-5 text-center">
                    <p className="text-muted">Tahlil kağıdının fotoğrafını yükle. AI değerleri okuyup beslenme planına entegre etsin.</p>

                    <input type="file" className="form-control mb-3" onChange={(e) => setFile(e.target.files[0])} />

                    <button className="btn btn-danger w-100" onClick={handleUpload} disabled={loading}>
                        {loading ? "Analiz Ediliyor..." : "Tahlili Yükle ve Analiz Et"}
                    </button>

                    {result && (
                        <div className="alert alert-light mt-4 text-start border">
                            <h5>📋 Analiz Sonucu:</h5>
                            <ReactMarkdown>{result}</ReactMarkdown>
                            <hr />
                            <small className="text-success fw-bold">Bu sonuçlar kaydedildi. Diyet planı oluştururken dikkate alınacak.</small>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BloodTestUpload;