import { Alert } from 'react-native';

class AlertQueue {
  constructor() {
    this.queue = [];
    this.isShowingAlert = false;
  }

  addAlert({ message, title, buttonLabel, onDismiss }) {
    this.queue.push({ message, title, buttonLabel, onDismiss });
    this.showNextAlert();
  }

  showNextAlert() {
    if (this.isShowingAlert || this.queue.length === 0) {
      return;
    }

    this.isShowingAlert = true;
    const { message, title, buttonLabel, onDismiss } = this.queue.shift();

    Alert.alert(
      title || 'Alert',
      message,
      [
        {
          text: buttonLabel || 'OK',
          onPress: () => {
            this.isShowingAlert = false;
            if (onDismiss) onDismiss();
            this.showNextAlert();
          }
        }
      ],
      { cancelable: true }
    );
  }
}

const MultiAlert = new AlertQueue();
export default MultiAlert;
