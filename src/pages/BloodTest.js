import React, {useState, useEffect} from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import UserService from "../services/user.service";

const BloodTest = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);

    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = () => {
        UserService.getBloodTestHistory().then(
            (res) => {
                console.log("Gelen Tahliller:", res.data);
                setHistory(res.data);
            },
            (err) => console.log(err)
        );
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = () => {
        if (!selectedFile) {
            alert("Lütfen dosya seçin.");
            return;
        }
        setLoading(true);
        UserService.uploadBloodTest(selectedFile).then(
            () => {
                setLoading(false);
                setSelectedFile(null);
                alert("Yüklendi! 🧬");
                fetchHistory();
            },
            () => {
                setLoading(false);
                alert("Hata oluştu.");
            }
        );
    };

    // --- GÜNCELLEME İŞLEMLERİ ---
    const startEditing = (test) => {
        setEditingId(test.id);
        setEditText(test.analysisResult || "");
    };

    const saveEdit = (id) => {
        UserService.updateBloodTest(id, editText).then(() => {
            setEditingId(null);
            fetchHistory();
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditText("");
    };

    // --- SİLME İŞLEMİ ---
    const deleteTest = (id) => {
        if (window.confirm("Bu tahlili silmek istediğine emin misin?")) {
            UserService.deleteBloodTest(id).then(() => fetchHistory());
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Tarih Yok";
        return new Date(dateString).toLocaleDateString("tr-TR", {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="dashboard-container pt-4">
            <div className="container" style={{maxWidth: "900px"}}>

                <div className="text-center mb-5">
                    <span style={{fontSize: "3rem"}}>🩸</span>
                    <h1 className="fw-bold text-dark">Kan Tahlili Analizi</h1>
                </div>

                {/* YÜKLEME ALANI */}
                <div className="card shadow-sm border-0 rounded-4 p-4 mb-5 bg-white">
                    <div className="card-body">
                        <h4 className="fw-bold mb-3 text-primary">➕ Yeni Tahlil Ekle</h4>
                        <div className="input-group mb-3">
                            <input className="form-control form-control-lg" type="file" onChange={handleFileChange}
                                   accept="image/*,application/pdf"/>
                        </div>
                        <button onClick={handleUpload} className="btn btn-primary btn-lg w-100 rounded-pill fw-bold"
                                disabled={loading}>
                            {loading ? "Analiz Ediliyor..." : "Yükle ve Yorumla 🚀"}
                        </button>
                    </div>
                </div>

                {/* GEÇMİŞ LİSTESİ */}
                <h4 className="fw-bold mb-4 text-secondary">📂 Tahlil Geçmişin ({history.length})</h4>

                {history.length > 0 ? (
                    <div className="d-flex flex-column gap-4">
                        {history.map((test, index) => (
                            <div key={test.id} className="card shadow border-0 rounded-4 overflow-hidden">

                                {/* KART BAŞLIĞI (HEADER) */}
                                <div
                                    className="card-header bg-light p-3 d-flex justify-content-between align-items-center">
                                    <div>
                                        <h5 className="mb-0 fw-bold text-dark">
                                            {index === 0 ? "🌟 En Güncel Sonuç" : `Tahlil Kaydı #${history.length - index}`}
                                        </h5>
                                        <span
                                            className="badge bg-secondary mt-1">📅 {formatDate(test.uploadDate || test.createdAt)}</span>
                                    </div>

                                    {/* BUTONLAR */}
                                    <div className="d-flex gap-2">
                                        <button
                                            className="btn btn-primary btn-sm fw-bold px-3"
                                            onClick={() => startEditing(test)}
                                        >
                                            ✏️ DÜZENLE
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm fw-bold px-3"
                                            onClick={() => deleteTest(test.id)}
                                        >
                                            🗑️ SİL
                                        </button>
                                    </div>
                                </div>

                                {/* KART İÇERİĞİ */}
                                <div className="card-body p-4 bg-white">
                                    {editingId === test.id ? (
                                        // DÜZENLEME MODU
                                        <div>
                                            <div className="alert alert-warning">Düzenleme Modundasınız</div>
                                            <textarea
                                                className="form-control mb-3 fs-5"
                                                rows="12"
                                                value={editText}
                                                onChange={(e) => setEditText(e.target.value)}
                                                style={{border: "2px solid #0d6efd"}}
                                            ></textarea>
                                            <div className="d-flex gap-2 justify-content-end">
                                                <button onClick={() => saveEdit(test.id)}
                                                        className="btn btn-success btn-lg">✅ KAYDET
                                                </button>
                                                <button onClick={cancelEdit}
                                                        className="btn btn-secondary btn-lg">İPTAL
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        // NORMAL GÖRÜNÜM (Markdown)
                                        <div style={{lineHeight: "1.8", fontSize: "1.05rem"}}>
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}>{test.analysisResult}</ReactMarkdown>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="alert alert-info text-center py-5">
                        <h4>Henüz hiç tahlil yüklenmemiş.</h4>
                        <p>Yukarıdaki alandan ilk tahlilini yükleyebilirsin.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BloodTest;