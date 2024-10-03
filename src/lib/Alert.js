import AlertModal from "../components/Alert";

class Alert {
    static Error(message, title) {
        AlertModal(message,title)
    }
}

export default Alert;