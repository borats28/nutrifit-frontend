import React, {useState, useEffect, useRef} from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import UserService from "../services/user.service";

const AiChat = () => {
    const [messages, setMessages] = useState([
        {role: "ai", content: "Merhaba! Ben senin yapay zeka sağlık koçunum. 💪"}
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [dietPlan, setDietPlan] = useState("");
    const [workoutPlan, setWorkoutPlan] = useState("");

    const messagesEndRef = useRef(null);

    const getCleanText = (data) => {
        if (!data) return "";
        if (typeof data === "string") return data;

        const extracted = data.aiResponse || data.response || data.content || data.reply || data.message;

        if (extracted && typeof extracted === "string") return extracted;
        try {
            return JSON.stringify(data);
        } catch (e) {
            return "Veri okunamadı.";
        }
    };

    useEffect(() => {
        scrollToBottom();
        UserService.getLatestDiet().then((res) => {
            if (res.data) setDietPlan(getCleanText(res.data));
        }).catch(err => console.error("Diyet hatası:", err));

        UserService.getLatestWorkout().then((res) => {
            if (res.data) setWorkoutPlan(getCleanText(res.data));
        }).catch(err => console.error("Spor hatası:", err));
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsgText = input;
        setMessages((prev) => [...prev, {role: "user", content: userMsgText}]);
        setInput("");
        setLoading(true);

        try {
            const response = await UserService.sendMessage(userMsgText);
            const aiReply = getCleanText(response.data);
            setMessages((prev) => [...prev, {role: "ai", content: aiReply}]);
        } catch (error) {
            setMessages((prev) => [...prev, {role: "ai", content: "Bağlantı hatası oluştu. MySQL'i kontrol et."}]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-container pt-3" style={{height: "90vh", overflow: "hidden"}}>
            <div className="container-fluid h-100 px-3">
                <div className="row h-100 g-3">

                    {/* DİYET PLANI */}
                    <div className="col-lg-4 d-none d-lg-flex flex-column h-100 pb-4">
                        <div className="card shadow-sm border-0 h-100 rounded-4">
                            <div className="card-header bg-white border-bottom py-3">
                                <h5 className="mb-0 fw-bold text-primary">🥗 Diyet Planı</h5>
                            </div>
                            <div className="card-body p-4 bg-light overflow-auto">
                                {dietPlan ? (
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={{img: () => null}}>
                                        {String(dietPlan)}
                                    </ReactMarkdown>
                                ) : (
                                    <div className="text-center text-muted mt-5"><p>Henüz planın yok.</p></div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* CHAT */}
                    <div className="col-lg-4 col-12 h-100 pb-4">
                        <div className="card shadow-lg border-0 h-100 rounded-4">
                            <div className="card-header bg-white border-bottom text-center py-3">💬 AI Koç</div>
                            <div className="card-body bg-light overflow-auto">
                                {messages.map((msg, index) => (
                                    <div key={index}
                                         className={`d-flex mb-3 ${msg.role === "user" ? "justify-content-end" : "justify-content-start"}`}>
                                        <div
                                            className={`p-3 rounded-4 shadow-sm ${msg.role === "user" ? "bg-primary text-white" : "bg-white text-dark"}`}
                                            style={{maxWidth: "90%"}}>
                                            <ReactMarkdown remarkPlugins={[remarkGfm]} components={{img: () => null}}>
                                                {String(msg.content || "")}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                ))}
                                {loading && (
                                    <div className="d-flex justify-content-start mb-3">
                                        <div className="bg-white p-3 rounded-4 shadow-sm">
                                            <span className="spinner-border spinner-border-sm text-primary me-2"></span>
                                            <small>Yazıyor...</small>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef}/>
                            </div>
                            <div className="card-footer bg-white p-3">
                                <form onSubmit={handleSend} className="d-flex gap-2">
                                    <input type="text" className="form-control rounded-pill" value={input}
                                           onChange={(e) => setInput(e.target.value)} disabled={loading}/>
                                    <button className="btn btn-primary rounded-circle" disabled={loading}>➤</button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* SPOR PLANI */}
                    <div className="col-lg-4 d-none d-lg-flex flex-column h-100 pb-4">
                        <div className="card shadow-sm border-0 h-100 rounded-4">
                            <div className="card-header bg-white border-bottom py-3">
                                <h5 className="mb-0 fw-bold text-warning">💪 Spor Planı</h5>
                            </div>
                            <div className="card-body p-4 bg-light overflow-auto">
                                {workoutPlan ? (
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={{img: () => null}}>
                                        {String(workoutPlan)}
                                    </ReactMarkdown>
                                ) : (
                                    <div className="text-center text-muted mt-5"><p>Henüz planın yok.</p></div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AiChat;