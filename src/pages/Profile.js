import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";

const Profile = () => {
    const currentUser = AuthService.getCurrentUser();

    // STATE TANIMLARI
    const [measurements, setMeasurements] = useState([]);
    const [latestMeas, setLatestMeas] = useState(null);
    const [healthRecords, setHealthRecords] = useState([]);

    // Planlar
    const [dietPlan, setDietPlan] = useState(null);
    const [workoutPlan, setWorkoutPlan] = useState(null);

    const [editingHealthId, setEditingHealthId] = useState(null);
    const [editHealthText, setEditHealthText] = useState("");

    useEffect(() => {
        if (currentUser) fetchUserData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchUserData = () => {
        // Ölçüm Geçmişi ve Grafik Verisi Hazırlama
        UserService.getHistory().then((res) => {
            const formattedData = res.data.map(item => {
                const rawDate = item.measurementDate || item.date || item.createdAt || new Date().toISOString();
                return {
                    ...item,
                    displayDate: new Date(rawDate).toLocaleDateString("tr-TR", { day: 'numeric', month: 'numeric' }),
                    kilo: parseFloat(item.kilo)
                };
            }).reverse();

            setMeasurements(formattedData);
            if (formattedData.length > 0) setLatestMeas(formattedData[formattedData.length - 1]);
        });

        // Sağlık Verileri
        UserService.getHealthRecords().then((res) => setHealthRecords(res.data));

        // Diyet Planı
        UserService.getLatestDiet().then((res) => { if (res.data) setDietPlan(res.data); });

        // SPOR PLANI (YENİ EKLENEN KISIM)
        UserService.getLatestWorkout().then((res) => { if (res.data) setWorkoutPlan(res.data); });
    };

    // --- FONKSİYONLAR (Edit, Save, Delete) ---
    const startEditing = (record) => {
        const id = record.id || record.healthId;
        setEditingHealthId(id);
        setEditHealthText(record.notes);
    };

    const saveHealth = (targetId) => {
        if (!editHealthText.trim()) return;
        UserService.updateHealth(targetId, { notes: editHealthText })
            .then(() => { setEditingHealthId(null); fetchUserData(); })
            .catch(err => console.log(err));
    };

    const deleteHealth = (targetId) => {
        if (window.confirm("Bu sağlık kaydını silmek istediğine emin misin?")) {
            UserService.deleteHealth(targetId)
                .then(() => fetchUserData())
                .catch(err => console.log(err));
        }
    };

    if (!currentUser) return <div className="container mt-5">Giriş yapmalısınız.</div>;

    return (
        <div className="container mt-4 mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                <div>
                    <h2 className="fw-bold text-dark mb-0">👤 Profil ve Gelişim</h2>
                    <p className="text-muted mb-0">Merhaba {currentUser.username}, işte güncel analizlerin.</p>
                </div>
            </div>

            <div className="row">
                {/* (Grafik, Ölçümler, Sağlık) */}
                <div className="col-lg-5 mb-4">

                    {/* GRAFİK */}
                    <div className="card shadow-sm border-0 mb-3">
                        <div className="card-header bg-white">
                            <h5 className="mb-0 fw-bold text-primary">📈 Kilo Değişim Grafiği</h5>
                        </div>
                        <div className="card-body">
                            <div style={{ width: "100%", height: "300px" }}>
                                {measurements.length > 1 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={measurements}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="displayDate" />
                                            <YAxis domain={['auto', 'auto']} />
                                            <Tooltip />
                                            <Line type="monotone" dataKey="kilo" stroke="#0d6efd" strokeWidth={3} activeDot={{ r: 8 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="d-flex align-items-center justify-content-center h-100">
                                        <p className="text-muted">Grafik için en az 2 ölçüm girmelisiniz.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* SON DURUM */}
                    <div className="card shadow-sm border-0 mb-3">
                        <div className="card-header bg-info text-white"><h5 className="mb-0">📏 Son Vücut Analizi</h5></div>
                        <div className="card-body">
                            {latestMeas ? (
                                <div className="row text-center">
                                    <div className="col-6 mb-2"><strong>Kilo:</strong> {latestMeas.kilo} kg</div>
                                    <div className="col-6 mb-2"><strong>Boy:</strong> {latestMeas.boy} cm</div>
                                    <div className="col-6"><strong>BMI:</strong> {latestMeas.calculations?.bmiValue}</div>
                                    <div className="col-6"><strong>BMR:</strong> {latestMeas.calculations?.bmrValue}</div>
                                </div>
                            ) : <p className="text-center">Veri yok.</p>}
                        </div>
                    </div>

                    {/* SAĞLIK NOTLARI */}
                    <div className="card shadow-sm border-0 mb-3">
                        <div className="card-header bg-danger text-white"><h5 className="mb-0">🩺 Sağlık Notları</h5></div>
                        <div className="card-body">
                            {healthRecords.length > 0 ? (
                                <ul className="list-group list-group-flush">
                                    {healthRecords.map((rec, index) => {
                                        const recordId = rec.id || rec.healthId;
                                        return (
                                            <li key={'health-' + index} className="list-group-item px-0">
                                                {editingHealthId === recordId ? (
                                                    <div className="input-group">
                                                        <input type="text" className="form-control" value={editHealthText} onChange={(e) => setEditHealthText(e.target.value)} />
                                                        <button onClick={() => saveHealth(recordId)} className="btn btn-success">Kaydet</button>
                                                        <button onClick={() => setEditingHealthId(null)} className="btn btn-secondary">İptal</button>
                                                    </div>
                                                ) : (
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <span>⚠️ {rec.notes}</span>
                                                        <div>
                                                            <button onClick={() => startEditing(rec)} className="btn btn-sm btn-outline-primary me-2">✏️</button>
                                                            <button onClick={() => deleteHealth(recordId)} className="btn btn-sm btn-outline-danger">🗑️</button>
                                                        </div>
                                                    </div>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : <p className="text-muted text-center">Kayıtlı sağlık sorunu yok.</p>}
                        </div>
                    </div>
                </div>

                {/* SAĞ KOLON (Planlar) */}
                <div className="col-lg-7">

                    {/* DİYET PLANI */}
                    <div className="card shadow-sm border-0 mb-4">
                        <div className="card-header bg-primary text-white"><h5 className="mb-0">🍽️ Aktif Beslenme Planı</h5></div>
                        <div className="card-body">
                            {dietPlan ? (
                                <div className="plan-scroll-container" style={{ maxHeight: "400px", overflowY: "auto" }}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{dietPlan.aiResponse}</ReactMarkdown>
                                </div>
                            ) : <div className="text-center py-4 text-muted">Henüz diyet planın yok.</div>}
                        </div>
                    </div>

                    {/* SPOR PLANI (YENİ EKLENDİ) */}
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-warning text-white"><h5 className="mb-0">🏋️ Aktif Antrenman Planı</h5></div>
                        <div className="card-body">
                            {workoutPlan ? (
                                <div className="plan-scroll-container" style={{ maxHeight: "400px", overflowY: "auto" }}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{workoutPlan.aiResponse}</ReactMarkdown>
                                </div>
                            ) : <div className="text-center py-4 text-muted">Henüz spor planın yok.</div>}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
export default Profile;