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

            // 400: Validation Errors (Javax Validation) - Sadece belirtilen dizi formatı için
            if (err.response.status === 400) {
                const data = err.response.data;

                // Sadece errors bir DIZI (Array) ise toast göster
                if (data && Array.isArray(data.errors)) {
                    data.errors.forEach(errorObj => {
                        const msg = errorObj.defaultMessage;
                        if (msg) {
                            toast.error(msg);
                        }
                    });
                }
            }

            // Diğer hata durumları için genel mesaj
            errorMessage = data.message || `Hata oluştu: ${err.response.status}`;
            if (err.response.status !== 400 && err.response.status !== 401) {
                toast.error(errorMessage);
            }

            return Promise.reject(data);
        } else if (err.message) {
            errorMessage = err.message;
            toast.error(errorMessage);
        }

        return Promise.reject(err);
    }
);

export default instance;