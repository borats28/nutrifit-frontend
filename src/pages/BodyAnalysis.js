import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import userService from "../services/user.service";

const BodyAnalysis = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [analysisResult, setAnalysisResult] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
            setAnalysisResult("");
            setError("");
        }
    };

    const handleUpload = () => {
        console.log("USER SERVICE İÇİNDEKİLER:", userService);
        if (!selectedFile) {
            setError("Lütfen önce bir fotoğraf seçin!");
            return;
        }
        setLoading(true);
        setError("");

        const formData = new FormData();
        formData.append("image", selectedFile);

        userService.analyzeBodyImage(formData).then(
            (response) => {
                const result = response.data.analysis || response.data;

                setAnalysisResult(typeof result === "object" ? JSON.stringify(result) : String(result));
                setLoading(false);
            },
            (err) => {
                console.error("Analiz Hatası:", err);
                if (err.response?.status === 404) {
                    setError("Sunucu adresi bulunamadı (404). Lütfen API URL'ini kontrol edin.");
                } else {
                    setError("Analiz yapılırken bir sorun oluştu.");
                }
                setLoading(false);
            }
        );
    };

    return (
        <div className="container mt-5 mb-5">
            <h2 className="text-center mb-4">📸 Yapay Zeka Vücut Analizi</h2>

            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow border-0">
                        <div className="card-body text-center p-5">

                            {/* RESİM YÜKLEME ALANI */}
                            {!preview ? (
                                <div className="upload-area p-5 border border-2 border-dashed rounded bg-light">
                                    <p className="fs-4 text-muted">Vücut fotoğrafını yükle</p>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="form-control mt-3"
                                        onChange={handleFileChange}
                                    />
                                    <p className="text-muted small mt-2">
                                        *Yüzünüzün görünmesine gerek yok. Formunuzun belli olduğu bir açı seçin.
                                    </p>
                                </div>
                            ) : (
                                <div className="mb-4">
                                    <img
                                        src={preview}
                                        alt="Önizleme"
                                        className="img-fluid rounded shadow"
                                        style={{ maxHeight: "400px" }}
                                    />
                                    <div className="mt-3">
                                        <button className="btn btn-outline-danger btn-sm" onClick={() => { setPreview(null); setSelectedFile(null); }}>
                                            Farklı Fotoğraf Seç
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* ANALİZ BUTONU */}
                            <div className="d-grid gap-2 mt-4">
                                <button
                                    className="btn btn-primary btn-lg"
                                    onClick={handleUpload}
                                    disabled={loading || !selectedFile}
                                >
                                    {loading ? (
                                        <span><span className="spinner-border spinner-border-sm me-2"></span>Analiz Ediliyor...</span>
                                    ) : "🔍 Fotoğrafı Analiz Et"}
                                </button>
                            </div>

                            {error && <div className="alert alert-danger mt-3">{error}</div>}

                        </div>
                    </div>

                    {/* SONUÇ ALANI */}
                    {analysisResult && (
                        <div className="card mt-4 shadow border-success">
                            <div className="card-header bg-success text-white">
                                <h4 className="mb-0">📋 Analiz Raporu</h4>
                            </div>
                            <div className="card-body p-4 bg-light">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {analysisResult}
                                </ReactMarkdown>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default BodyAnalysis;