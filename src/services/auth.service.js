import axios from "axios";

const API_URL = "http://localhost:8080/api/auth/";

class AuthService {
    //LOGIN
    login(username, password) {
        return axios
            .post(API_URL + "login", {
                username,
                password,
            })
            .then((response) => {
                if (response.data.token) {
                    // Token geldiyse tarayıcıya kaydet
                    sessionStorage.setItem("user", JSON.stringify(response.data));
                }
                return response.data;
            });
    }

    //LOGOUT
    logout() {
        sessionStorage.removeItem("user");
    }

    //REGISTER
    register(username, email, password) {
        return axios.post(API_URL + "signup", {
            username,
            email,
            password
        });
    }

    //MEVCUT KULLANICIYI GETİR
    getCurrentUser() {
        return JSON.parse(sessionStorage.getItem("user"));
    }
}

const authService = new AuthService();
export default authService;