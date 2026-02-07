import * as Haptics from 'expo-haptics';

class FeedbackService {
    async triggerMoveFeedback(isCapture: boolean = false) {
        if (isCapture) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    }

    async triggerCheckFeedback() {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }

    async triggerGameOverFeedback() {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
}

export default new FeedbackService();
