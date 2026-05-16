import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import html2pdf from 'html2pdf.js';
import UserService from "../services/user.service";
import AuthService from "../services/auth.service";
import fitnessImage from "../images/fitnes2.png";
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
        UserService.getHistory().then((res) => {
            if (res.data.length > 0) setLastMeasurement(res.data[0]);
        });
        UserService.getMyGoals().then((res) => {
            if (res.data.length > 0) setCurrentGoal(res.data[0]);
        });
        UserService.getLatestDiet().then((res) => {
            if (res.data) setDietPlan(res.data);
        });
        UserService.getLatestWorkout().then((res) => {
            if (res.data) setWorkoutPlan(res.data);
        });
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
            image: {type: 'jpeg', quality: 0.98},
            html2canvas: {scale: 2, useCORS: true, scrollY: 0},
            jsPDF: {unit: 'mm', format: 'a4', orientation: 'portrait'}
        };

        html2pdf().set(opt).from(element).save().then(() => {
            if (scrollContainer) {
                scrollContainer.style.height = originalHeight || '75vh';
                scrollContainer.style.overflowY = originalOverflow || 'auto';
            }
        });
    };

    const handleCreateDiet = () => {
        setAiLoading(true);
        setDietPlan(null);
        setWorkoutPlan(null);
        UserService.createDietPlan().then((res) => {
            setDietPlan(res.data);
            setAiLoading(false);
        }, () => {
            setAiLoading(false);
            alert("Hata oluştu.");
        });
    };

    const handleCreateWorkout = () => {
        setAiLoading(true);
        setWorkoutPlan(null);
        setDietPlan(null);
        UserService.createWorkoutPlan().then((res) => {
            setWorkoutPlan(res.data);
            setAiLoading(false);
        }, () => {
            setAiLoading(false);
            alert("Hata oluştu.");
        });
    };

    if (!currentUser) return <div className="container mt-5 text-center">Yükleniyor...</div>;

    return (
        <div className="pt-4"
             style={{width: "100vw", marginLeft: "calc(-50vw + 50%)", paddingLeft: "1.5rem", paddingRight: "1.5rem"}}>

            <div className="row justify-content-between m-0">

                {/* DİYET PLANI */}
                <div className="col-12 col-xl-3 order-2 order-xl-1 mb-4">
                    {dietPlan && (
                        <div className="dashboard-card h-100 p-4 shadow-sm w-100 bg-white rounded-4 border">
                            <div className="d-flex justify-content-between align-items-center plan-header mb-3">
                                <h3 className="text-primary fw-bold mb-0">🥗 Diyet Planı</h3>
                                <div>
                                    <button onClick={() => downloadPDF('diet-content', 'Diyet.pdf')}
                                            className="btn btn-sm btn-light border me-2">PDF
                                    </button>
                                    <button onClick={handleCreateDiet} className="btn btn-sm btn-primary">↻</button>
                                </div>
                            </div>
                            <div id="diet-content">
                                <div className="plan-scroll-container pe-2"
                                     style={{height: '75vh', minHeight: '600px', overflowY: 'auto'}}>
                                    <div className='plan-image-container mb-4 text-center'>
                                        <img src={diyetImage} alt='diet' className="img-fluid rounded"
                                             style={{maxHeight: "250px", objectFit: "contain", width: "100%"}}/>
                                    </div>
                                    <div className="fs-5 lh-lg text-break">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{dietPlan.aiResponse}</ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* ANA İÇERİK */}
                <div className="col-12 col-xl-5 order-1 order-xl-2 mb-4 px-3 bg-white p-4 rounded-4 shadow-sm border"
                     style={{height: "fit-content"}}>
                    <div className="row mb-5">
                        <div className="col-12">
                            <h1 className="fw-bold text-dark display-5">Merhaba, {currentUser.username}! 👋</h1>
                            <p className="text-muted fs-5">Bugün hedeflerine bir adım daha yaklaşmak için ne yapmak
                                istersin?</p>
                        </div>
                    </div>

                    <div className="row mb-5 g-3">
                        <div className="col-6 col-md-3">
                            <div className="stat-card" style={{borderLeftColor: '#0d6efd'}}>
                                <div className="stat-value">{lastMeasurement?.kilo || "-"} <small
                                    className="fs-6 text-muted">kg</small></div>
                                <div className="stat-label">Mevcut Kilo</div>
                            </div>
                        </div>
                        <div className="col-6 col-md-3">
                            <div className="stat-card" style={{borderLeftColor: '#198754'}}>
                                <div className="stat-value">{currentGoal?.hedefKilo || "-"} <small
                                    className="fs-6 text-muted">kg</small></div>
                                <div className="stat-label">Hedef Kilo</div>
                            </div>
                        </div>
                        <div className="col-6 col-md-3">
                            <div className="stat-card" style={{borderLeftColor: '#ffc107'}}>
                                <div className="stat-value">{lastMeasurement?.calculations?.bmiValue || "-"}</div>
                                <div className="stat-label">Vücut Kitle Endeksi</div>
                            </div>
                        </div>
                        <div className="col-6 col-md-3">
                            <div className="stat-card" style={{borderLeftColor: '#dc3545'}}>
                                <div className="stat-value">{lastMeasurement?.calculations?.bmrValue || "-"} <small
                                    className="fs-6 text-muted">kcal</small></div>
                                <div className="stat-label">Günlük İhtiyaç</div>
                            </div>
                        </div>
                    </div>

                    <div className="row mb-4">
                        <div className="col-12"><h4 className="fw-bold mb-3 text-secondary">🚀 Yapay Zeka & Planlama</h4>
                        </div>
                    </div>

                    {aiLoading ? (
                        <div className="alert alert-warning p-5 text-center shadow-sm rounded-4 mb-5">
                            <div className="spinner-border text-warning mb-3" role="status"
                                 style={{width: "3rem", height: "3rem"}}></div>
                            <h3>Yapay Zeka Çalışıyor... 🤖</h3>
                            <p>Senin için en uygun planı hazırlıyorum, lütfen bekle.</p>
                        </div>
                    ) : (
                        <div className="row g-3 mb-5">
                            <div className="col-12 col-md-4">
                                <button onClick={handleCreateDiet} className="action-card-btn btn-diet w-100">
                                    <span className="action-icon">🍽️</span><span
                                    className="action-title">AI Diyet Yaz</span>
                                </button>
                            </div>
                            <div className="col-12 col-md-4">
                                <button onClick={handleCreateWorkout} className="action-card-btn btn-workout w-100">
                                    <span className="action-icon">🏋️</span><span className="action-title">AI Spor Programı</span>
                                </button>
                            </div>
                            <div className="col-12 col-md-4">
                                <button onClick={() => navigate("/chat")} className="action-card-btn btn-chat w-100">
                                    <span className="action-icon">💬</span><span className="action-title">AI Koç ile Konuş</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {!aiLoading && (
                        <>
                            <div className="row mb-4">
                                <div className="col-12"><h4 className="fw-bold mb-3 text-secondary">📊 Veri Girişi &
                                    Analiz</h4></div>
                            </div>
                            <div className="row g-3 mb-5 justify-content-start">
                                <div className="col-6 col-md-4 col-xl-auto flex-grow-1">
                                    <button onClick={() => navigate("/add-measurement")}
                                            className="action-card-btn w-100">
                                        <span className="action-icon">📏</span><span
                                        className="action-title">Ölçüm Gir</span>
                                    </button>
                                </div>
                                <div className="col-6 col-md-4 col-xl-auto flex-grow-1">
                                    <button onClick={() => navigate("/add-goal")} className="action-card-btn w-100"
                                            style={{color: '#198754'}}>
                                        <span className="action-icon"
                                              style={{background: '#d1e7dd', color: '#198754'}}>🎯</span><span
                                        className="action-title">Hedef Belirle</span>
                                    </button>
                                </div>
                                <div className="col-6 col-md-4 col-xl-auto flex-grow-1">
                                    <button onClick={() => navigate("/body-analysis")}
                                            className="action-card-btn btn-analysis w-100">
                                        <span className="action-icon">📸</span><span className="action-title">Vücut Analizi</span>
                                    </button>
                                </div>
                                <div className="col-6 col-md-4 col-xl-auto flex-grow-1">
                                    <button onClick={() => navigate("/blood-test")}
                                            className="action-card-btn btn-blood w-100">
                                        <span className="action-icon">🩸</span><span className="action-title">Tahlil Yükle</span>
                                    </button>
                                </div>
                                <div className="col-6 col-md-4 col-xl-auto flex-grow-1">
                                    <button onClick={() => navigate("/add-health")} className="action-card-btn w-100"
                                            style={{color: '#dc3545'}}>
                                        <span className="action-icon"
                                              style={{background: '#f8d7da', color: '#dc3545'}}>🩺</span>
                                        <span className="action-title">Sağlık Ekle</span>
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* SAĞ SÜTUN - SPOR PLANI */}
                <div className="col-12 col-xl-3 order-3 order-xl-3 mb-4">
                    {workoutPlan && (
                        <div className="dashboard-card h-100 p-4 shadow-sm w-100 bg-white rounded-4 border">
                            <div className="d-flex justify-content-between align-items-center plan-header mb-3">
                                <h3 className="text-warning fw-bold mb-0">💪 Spor Planı</h3>
                                <div>
                                    <button onClick={() => downloadPDF('workout-content', 'Spor.pdf')}
                                            className="btn btn-sm btn-light border me-2">PDF
                                    </button>
                                    <button onClick={handleCreateWorkout}
                                            className="btn btn-sm btn-warning text-white">↻
                                    </button>
                                </div>
                            </div>
                            <div id="workout-content">
                                <div className="plan-scroll-container pe-2"
                                     style={{height: '75vh', minHeight: '600px', overflowY: 'auto'}}>
                                    <div className='plan-image-container mb-4 text-center'>
                                        <img src={fitnessImage} alt='spor' className="img-fluid rounded"
                                             style={{maxHeight: "250px", objectFit: "contain", width: "100%"}}/>
                                    </div>
                                    <div className="fs-5 lh-lg text-break">
                                        <ReactMarkdown>{workoutPlan.aiResponse}</ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Home;