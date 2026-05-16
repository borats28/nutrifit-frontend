import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import userService from "../services/user.service";
import { toast } from 'react-toastify';

const BodyAnalysis = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [analysisResult, setAnalysisResult] = useState("");
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Dosya boyutu kontrolü (Örn: 5MB sınırı)
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Dosya boyutu çok büyük! Lütfen 5MB'dan küçük bir görsel seçin.");
                return;
            }
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
            setAnalysisResult("");
        }
    };

    const handleUpload = () => {
        if (!selectedFile) {
            toast.warning("Lütfen önce bir fotoğraf seçin!");
            return;
        }

        setLoading(true);
        setAnalysisResult("");

        const formData = new FormData();
        formData.append("image", selectedFile);

        userService.analyzeBodyImage(formData).then(
            (response) => {
                const result = response.data.analysis || response.data;

                setAnalysisResult(typeof result === "object" ? JSON.stringify(result) : String(result));
                setLoading(false);
                toast.success("Vücut analizi başarıyla tamamlandı! 📸");
            },
            (err) => {
                toast.error(err);
                setLoading(false);
            }
        );
    };

    return (
        <div className="container mt-5 mb-5">
            <h2 className="text-center mb-4 fw-bold">📸 Yapay Zeka Vücut Analizi</h2>

            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-lg border-0 rounded-4">
                        <div className="card-body text-center p-5">

                            {/* RESİM YÜKLEME ALANI */}
                            {!preview ? (
                                <div className="upload-area p-5 border border-2 border-dashed rounded-4 bg-light">
                                    <p className="fs-4 text-muted mb-3">Vücut fotoğrafını yükle</p>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="form-control"
                                        onChange={handleFileChange}
                                    />
                                    <p className="text-muted small mt-3 mb-0">
                                        *Yüzünüzün görünmesine gerek yok. Formunuzun belli olduğu bir açı seçin.
                                    </p>
                                </div>
                            ) : (
                                <div className="mb-4">
                                    <img
                                        src={preview}
                                        alt="Önizleme"
                                        className="img-fluid rounded-4 shadow"
                                        style={{ maxHeight: "400px" }}
                                    />
                                    <div className="mt-3">
                                        <button
                                            className="btn btn-outline-danger btn-sm rounded-pill px-3"
                                            onClick={() => { setPreview(null); setSelectedFile(null); }}
                                            disabled={loading}
                                        >
                                            Farklı Fotoğraf Seç
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* ANALİZ BUTONU */}
                            <div className="d-grid gap-2 mt-4">
                                <button
                                    className="btn btn-primary btn-lg rounded-pill fw-bold shadow-sm"
                                    onClick={handleUpload}
                                    disabled={loading || !selectedFile}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Görsel İşleniyor...
                                        </>
                                    ) : "🔍 Fotoğrafı Analiz Et"}
                                </button>
                            </div>

                        </div>
                    </div>

                    {/* SONUÇ ALANI */}
                    {analysisResult && (
                        <div className="card mt-4 shadow-lg border-0 rounded-4 overflow-hidden">
                            <div className="card-header bg-success text-white py-3 text-center">
                                <h4 className="mb-0 fw-bold">📋 Analiz Raporu</h4>
                            </div>
                            <div className="card-body p-4 bg-white">
                                <div className="fs-6 lh-lg">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {analysisResult}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default BodyAnalysis;