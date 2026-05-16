import axios from "axios";
import AuthService from "./auth.service";

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

        if (originalConfig.url !== "/auth/login" && err.response) {
            if (err.response.status === 401 && !originalConfig._retry) {
                originalConfig._retry = true;
                AuthService.logout();
                window.location.href = "/login";
                return Promise.reject("Oturumunuz sona erdi. Lütfen tekrar giriş yapın.");
            }
        }

        let errorMessage = "Sunucuyla bağlantı kurulurken bir hata oluştu.";

        if (err.response && err.response.data && err.response.data.message) {
            errorMessage = err.response.data.message;
        } else if (err.message) {
            errorMessage = err.message;
        }

        return Promise.reject(errorMessage);
    }
);

export default instance;