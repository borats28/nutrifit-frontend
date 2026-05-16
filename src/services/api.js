import axios from "axios";
import AuthService from "./auth.service";
import { toast } from "react-toastify";

const instance = axios.create({
    baseURL: "http://localhost:8080/api/",
    headers: {
        "Content-Type": "application/json",
    },
});

instance.interceptors.request.use(
    (config) => {
        const user = AuthService.getCurrentUser();
        if (user && user.token) {
            config.headers["Authorization"] = 'Bearer ' + user.token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// HATA YÖNETİMİ İÇİN
instance.interceptors.response.use(
    (res) => {
        return res;
    },
    async (err) => {
        const originalConfig = err.config;
        let errorMessage = "Sunucuyla bağlantı kurulurken bir hata oluştu.";

        if (err.response) {
            const data = err.response.data;

            // 401: Unauthorized - Oturum Sonlanmış
            if (err.response.status === 401 && !originalConfig.url.includes("auth/login") && !originalConfig._retry) {
                originalConfig._retry = true;
                AuthService.logout();
                window.location.href = "/login";
                errorMessage = "Oturumunuz sona erdi. Lütfen tekrar giriş yapın.";
                toast.error(errorMessage);
                return Promise.reject(errorMessage);
            }

            // 400: Validation Errors (Javax Validation)
            if (err.response.status === 400) {
                const data = err.response.data;

                // Eğer errors bir DIZI (Array) ise (Kullanıcının paylaştığı yeni format)
                if (Array.isArray(data.errors)) {
                    data.errors.forEach(errorObj => {
                        const msg = errorObj.defaultMessage || errorObj.message;
                        if (msg) toast.error(msg);
                    });
                    errorMessage = "Lütfen formdaki hataları düzeltin.";
                }
                // Eğer errors bir NESNE (Object/Map) ise (Örn: {username: "hata", email: "hata"})
                else if (data.errors && typeof data.errors === 'object') {
                    Object.values(data.errors).forEach(msg => {
                        if (typeof msg === 'string') toast.error(msg);
                    });
                    errorMessage = "Lütfen formdaki hataları düzeltin.";
                }
                // Eğer doğrudan data bir nesneyse ve alanlar barındırıyorsa
                else if (typeof data === 'object' && !data.message && !data.errors) {
                    Object.values(data).forEach(msg => {
                        if (typeof msg === 'string') toast.error(msg);
                    });
                    errorMessage = "Lütfen formdaki hataları düzeltin.";
                }
                // Tek bir mesaj varsa
                else if (data.message) {
                    errorMessage = data.message;
                    toast.error(errorMessage);
                }
                
                return Promise.reject(errorMessage);
            }

            // Diğer hata durumları için genel mesaj
            errorMessage = data.message || `Hata oluştu: ${err.response.status}`;
            if (err.response.status !== 400 && err.response.status !== 401) {
                toast.error(errorMessage);
            }
        } else if (err.message) {
            errorMessage = err.message;
            toast.error(errorMessage);
        }

        return Promise.reject(errorMessage);
    }
);

export default instance;