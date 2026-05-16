import api from "./api";

class UserService {
    // GENEL
    getPublicContent() {
        return api.get("all");
    }

    getUserBoard() {
        return api.get("user");
    }

    // ÖLÇÜM METODLARI
    addMeasurement(data) {
        return api.post("measurements/add", data);
    }

    getHistory() {
        return api.get("measurements/history");
    }

    // HEDEF METODLARI
    addGoal(data) {
        return api.post("goals/add", data);
    }

    getMyGoals() {
        return api.get("goals/my-goals");
    }

    // PLAN METODLARI (AI Diyet ve Spor)
    createDietPlan() {
        return api.post("plans/diet", {});
    }

    getLatestDiet() {
        return api.get("plans/diet/latest");
    }

    createWorkoutPlan() {
        return api.post("plans/workout", {});
    }

    getLatestWorkout() {
        return api.get("plans/workout/latest");
    }

    // SAĞLIK BİLGİSİ METODLARI
    addHealthRecord(data) {
        return api.post("health/add", data);
    }

    getHealthRecords() {
        return api.get("health/list");
    }

    updateHealth(id, data) {
        return api.put(`health/update/${id}`, data);
    }

    deleteHealth(id) {
        return api.delete(`health/delete/${id}`);
    }

    // KAN TAHLİLİ METODLARI
    uploadBloodTest(file) {
        let formData = new FormData();
        formData.append("image", file);
        return api.post("blood-test/upload", formData, {
            headers: {"Content-Type": "multipart/form-data"}
        });
    }

    getBloodTestHistory() {
        return api.get("blood-test/history");
    }

    updateBloodTest(id, text) {
        return api.put(`blood-test/update/${id}`,
            {analysisResult: text}
        );
    }

    deleteBloodTest(id) {
        return api.delete(`blood-test/delete/${id}`);
    }

    // CHAT VE AI ANALİZ METODLARI
    sendMessage(message) {
        return api.post("chat/send", {message});
    }

    // VÜCUT ANALİZİ
    analyzeBodyImage(formData) {
        return api.post("chat/analyze-body", formData, {
            headers: {"Content-Type": "multipart/form-data"}
        });
    }
}

const userServiceInstance = new UserService();
export default userServiceInstance;