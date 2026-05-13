import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
    return (
        <div>
            {/* (GİRİŞ) */}
            <header className="hero-section text-white text-center py-5" style={{ background: "linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)" }}>
                <div className="container py-5">
                    <h1 className="display-3 fw-bold mb-3">NutriFit ile Dönüşüme Başla 🚀</h1>
                    <p className="lead mb-4 fs-3">
                        Yapay Zeka destekli kişisel diyetisyeniniz ve spor koçunuz cebinizde.
                        <br />
                        Fotoğrafını yükle, hedefini seç, gerisini AI halletsin.
                    </p>
                    <div className="d-flex justify-content-center gap-3">
                        <Link to="/register" className="btn btn-warning btn-lg px-5 py-3 fw-bold shadow">
                            Hemen Ücretsiz Başla
                        </Link>
                        <Link to="/login" className="btn btn-outline-light btn-lg px-5 py-3 fw-bold">
                            Giriş Yap
                        </Link>
                    </div>
                </div>
            </header>

            {/* ÖZELLİKLER */}
            <section className="py-5 bg-light">
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 className="fw-bold text-dark">Neden NutriFit?</h2>
                        <p className="text-muted">Sıradan listeleri unutun. Size özel, yaşayan bir plan sunuyoruz.</p>
                    </div>

                    <div className="row g-4">
                        {/* Kart 1 */}
                        <div className="col-md-4">
                            <div className="card h-100 border-0 shadow-sm text-center p-4">
                                <div className="display-4 text-primary mb-3">🧠</div>
                                <h4 className="card-title">Gemini AI Destekli</h4>
                                <p className="card-text text-muted">
                                    En güncel yapay zeka teknolojisi ile metabolizmanıza ve hedeflerinize %100 uygun diyet listeleri hazırlar.
                                </p>
                            </div>
                        </div>

                        {/* Kart 2 */}
                        <div className="col-md-4">
                            <div className="card h-100 border-0 shadow-sm text-center p-4">
                                <div className="display-4 text-warning mb-3">📸</div>
                                <h4 className="card-title">Görsel Vücut Analizi</h4>
                                <p className="card-text text-muted">
                                    Sadece kilonuzu yazmayın, fotoğrafınızı yükleyin. AI, vücut tipinizi analiz etsin ve eksik bölgelerinizi söylesin.
                                </p>
                            </div>
                        </div>

                        {/* Kart 3 */}
                        <div className="col-md-4">
                            <div className="card h-100 border-0 shadow-sm text-center p-4">
                                <div className="display-4 text-success mb-3">🥗</div>
                                <h4 className="card-title">Kişiselleştirilmiş Plan</h4>
                                <p className="card-text text-muted">
                                    Alerjileriniz mi var? Vejetaryen misiniz? NutriFit sağlık durumunuza göre planı anında revize eder.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-5">
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 className="fw-bold">Nasıl Çalışır?</h2>
                    </div>

                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <div className="list-group list-group-flush fs-5">
                                <div className="list-group-item border-0 ps-0">
                                    <span className="badge bg-primary rounded-pill me-3">1</span>
                                    <strong>Profilini Oluştur:</strong> Boy, kilo ve yaş bilgilerini gir.
                                </div>
                                <div className="list-group-item border-0 ps-0">
                                    <span className="badge bg-primary rounded-pill me-3">2</span>
                                    <strong>Hedefini Seç:</strong> Kilo vermek, kas yapmak veya form korumak.
                                </div>
                                <div className="list-group-item border-0 ps-0">
                                    <span className="badge bg-primary rounded-pill me-3">3</span>
                                    <strong>AI Analizi:</strong> Yapay zeka saniyeler içinde sana özel planı ve görseli oluştursun.
                                </div>
                                <div className="list-group-item border-0 ps-0">
                                    <span className="badge bg-primary rounded-pill me-3">4</span>
                                    <strong>Koçla Konuş:</strong> Aklına takılanı 7/24 AI koçuna sor.
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 text-center">
                            <img
                                src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                alt="Fitness App"
                                className="img-fluid rounded-4 shadow-lg"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-5 text-center bg-dark text-white">
                <div className="container">
                    <h2 className="mb-4">Hayalindeki Vücuda Ulaşmak İçin Bekleme</h2>
                    <p className="lead mb-4">Binlerce satır kod ve en gelişmiş AI modelleri senin sağlığın için çalışıyor.</p>
                    <Link to="/register" className="btn btn-success btn-lg px-5 py-3 shadow">
                        Şimdi Ücretsiz Kayıt Ol
                    </Link>
                </div>
            </section>

            <footer className="py-4 bg-black text-center text-white-50">
                <div className="container">
                    <small>&copy; 2025 NutriFit AI. Tüm hakları saklıdır. | Designed by Bora</small>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;