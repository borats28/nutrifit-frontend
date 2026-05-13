import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import html2pdf from 'html2pdf.js';
import UserService from "../services/user.service";
import AuthService from "../services/auth.service";
import fitnessImage from "../images/fitnes.jpg";
import diyetImage from "../images/diyet.jpg";

const Home = () => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(undefined);
    const [lastMeasurement, setLastMeasurement] = useState(null);
    const [currentGoal, setCurrentGoal] = useState(null);

    const [dietPlan, setDietPlan] = useState(null);
    const [workoutPlan, setWorkoutPlan] = useState(null);
    const [aiLoading, setAiLoading] = useState(false);

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (user) {
            setCurrentUser(user);
            fetchUserData();
        }
    }, []);

    const fetchUserData = () => {
        UserService.getHistory().then((res) => { if (res.data.length > 0) setLastMeasurement(res.data[0]); });
        UserService.getMyGoals().then((res) => { if (res.data.length > 0) setCurrentGoal(res.data[0]); });
        UserService.getLatestDiet().then((res) => { if (res.data) setDietPlan(res.data); });
        UserService.getLatestWorkout().then((res) => { if (res.data) setWorkoutPlan(res.data); });
    };

    const downloadPDF = (elementId, filename) => {
        const element = document.getElementById(elementId);

        const scrollContainer = element.querySelector('.plan-scroll-container');
        const originalHeight = scrollContainer ? scrollContainer.style.height : null;
        const originalOverflow = scrollContainer ? scrollContainer.style.overflowY : null;

        if (scrollContainer) {
            scrollContainer.style.height = 'auto';
            scrollContainer.style.overflowY = 'visible';
        }

        const opt = {
            margin: 10,
            filename: filename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save().then(() => {
            if (scrollContainer) {
                scrollContainer.style.height = originalHeight || '400px';
                scrollContainer.style.overflowY = originalOverflow || 'auto';
            }
        });
    };

    const handleCreateDiet = () => {
        setAiLoading(true); setDietPlan(null); setWorkoutPlan(null);
        UserService.createDietPlan().then((res) => { setDietPlan(res.data); setAiLoading(false); }, () => { setAiLoading(false); alert("Hata oluştu."); });
    };

    const handleCreateWorkout = () => {
        setAiLoading(true); setWorkoutPlan(null); setDietPlan(null);
        UserService.createWorkoutPlan().then((res) => { setWorkoutPlan(res.data); setAiLoading(false); }, () => { setAiLoading(false); alert("Hata oluştu."); });
    };

    if (!currentUser) return <div className="container mt-5 text-center">Yükleniyor...</div>;

    return (
        <div className="dashboard-container pt-4">
            <div className="container">

                <div className="row mb-5">
                    <div className="col-12">
                        <h1 className="fw-bold text-dark display-5">Merhaba, {currentUser.username}! 👋</h1>
                        <p className="text-muted fs-5">Bugün hedeflerine bir adım daha yaklaşmak için ne yapmak istersin?</p>
                    </div>
                </div>

                <div className="row mb-5 g-4">
                    <div className="col-6 col-md-3">
                        <div className="stat-card" style={{ borderLeftColor: '#0d6efd' }}>
                            <div className="stat-value">{lastMeasurement?.kilo || "-"} <small className="fs-6 text-muted">kg</small></div>
                            <div className="stat-label">Mevcut Kilo</div>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div className="stat-card" style={{ borderLeftColor: '#198754' }}>
                            <div className="stat-value">{currentGoal?.hedefKilo || "-"} <small className="fs-6 text-muted">kg</small></div>
                            <div className="stat-label">Hedef Kilo</div>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div className="stat-card" style={{ borderLeftColor: '#ffc107' }}>
                            <div className="stat-value">{lastMeasurement?.calculations?.bmiValue || "-"}</div>
                            <div className="stat-label">Vücut Kitle Endeksi</div>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div className="stat-card" style={{ borderLeftColor: '#dc3545' }}>
                            <div className="stat-value">{lastMeasurement?.calculations?.bmrValue || "-"} <small className="fs-6 text-muted">kcal</small></div>
                            <div className="stat-label">Günlük İhtiyaç</div>
                        </div>
                    </div>
                </div>

                <div className="row mb-4">
                    <div className="col-12"><h4 className="fw-bold mb-3 text-secondary">🚀 Yapay Zeka & Planlama</h4></div>
                </div>

                {aiLoading ? (
                    <div className="alert alert-warning p-5 text-center shadow-sm rounded-4 mb-5">
                        <div className="spinner-border text-warning mb-3" role="status" style={{ width: "3rem", height: "3rem" }}></div>
                        <h3>Yapay Zeka Çalışıyor... 🤖</h3>
                        <p>Senin için en uygun planı hazırlıyorum, lütfen bekle.</p>
                    </div>
                ) : (
                    <div className="row g-4 mb-5">
                        <div className="col-12 col-md-4">
                            <button onClick={handleCreateDiet} className="action-card-btn btn-diet">
                                <span className="action-icon">🍽️</span><span className="action-title">AI Diyet Yaz</span>
                            </button>
                        </div>
                        <div className="col-12 col-md-4">
                            <button onClick={handleCreateWorkout} className="action-card-btn btn-workout">
                                <span className="action-icon">🏋️</span><span className="action-title">AI Spor Programı</span>
                            </button>
                        </div>
                        <div className="col-12 col-md-4">
                            <button onClick={() => navigate("/chat")} className="action-card-btn btn-chat">
                                <span className="action-icon">💬</span><span className="action-title">AI Koç ile Konuş</span>
                            </button>
                        </div>
                    </div>
                )}

                {!aiLoading && (
                    <>
                        <div className="row mb-4">
                            <div className="col-12"><h4 className="fw-bold mb-3 text-secondary">📊 Veri Girişi & Analiz</h4></div>
                        </div>
                        <div className="row g-4 mb-5">
                            <div className="col-6 col-md-4 col-lg-3">
                                <button onClick={() => navigate("/add-measurement")} className="action-card-btn">
                                    <span className="action-icon">📏</span><span className="action-title">Ölçüm Gir</span>
                                </button>
                            </div>
                            <div className="col-6 col-md-4 col-lg-3">
                                <button onClick={() => navigate("/add-goal")} className="action-card-btn" style={{ color: '#198754' }}>
                                    <span className="action-icon" style={{ background: '#d1e7dd', color: '#198754' }}>🎯</span><span className="action-title">Hedef Belirle</span>
                                </button>
                            </div>
                            <div className="col-6 col-md-4 col-lg-3">
                                <button onClick={() => navigate("/body-analysis")} className="action-card-btn btn-analysis">
                                    <span className="action-icon">📸</span><span className="action-title">Vücut Analizi</span>
                                </button>
                            </div>
                            <div className="col-6 col-md-4 col-lg-3">
                                <button onClick={() => navigate("/blood-test")} className="action-card-btn btn-blood">
                                    <span className="action-icon">🩸</span><span className="action-title">Tahlil Yükle</span>
                                </button>
                            </div>
                            <div className="col-6 col-md-4 col-lg-3">
                                <button onClick={() => navigate("/add-health")} className="action-card-btn" style={{ color: '#dc3545' }}>
                                    <span className="action-icon" style={{ background: '#f8d7da', color: '#dc3545' }}>🩺</span>
                                    <span className="action-title">Sağlık Ekle</span>
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {(dietPlan || workoutPlan) && (
                    <div className="row g-4 mb-5">

                        {dietPlan && (
                            <div className={workoutPlan ? "col-lg-6" : "col-12"}>
                                <div className="dashboard-card h-100 p-4">
                                    <div className="d-flex justify-content-between align-items-center plan-header">
                                        <h3 className="text-primary fw-bold mb-0">🥗 Diyet Planı</h3>
                                        <div>
                                            <button onClick={() => downloadPDF('diet-content', 'Diyet.pdf')} className="btn btn-sm btn-light border me-2">PDF</button>
                                            <button onClick={handleCreateDiet} className="btn btn-sm btn-primary">↻</button>
                                        </div>
                                    </div>
                                    <div id="diet-content">
                                        <div className="plan-scroll-container" style={{ height: '400px', overflowY: 'auto' }}>
                                            <div className='plan-image-container'>
                                                <img src={diyetImage} alt='diet'/>
                                            </div>
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{dietPlan.aiResponse}</ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {workoutPlan && (
                            <div className={dietPlan ? "col-lg-6" : "col-12"}>
                                <div className="dashboard-card h-100 p-4">
                                    <div className="d-flex justify-content-between align-items-center plan-header">
                                        <h3 className="text-warning fw-bold mb-0">💪 Spor Planı</h3>
                                        <div>
                                            <button onClick={() => downloadPDF('workout-content', 'Spor.pdf')} className="btn btn-sm btn-light border me-2">PDF</button>
                                            <button onClick={handleCreateWorkout} className="btn btn-sm btn-warning text-white">↻</button>
                                        </div>
                                    </div>
                                    <div id="workout-content">
                                        <div className="plan-scroll-container" style={{ height: '400px', overflowY: 'auto' }}>
                                            <div className='plan-image-container'>
                                                <img src={fitnessImage} alt='spor'/>
                                            </div>
                                            <ReactMarkdown>{workoutPlan.aiResponse}</ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
};

export default Home;
