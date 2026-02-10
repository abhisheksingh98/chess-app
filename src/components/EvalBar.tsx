import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

interface EvalBarProps {
    evaluation: number; // Positive = white leads, negative = black leads
}

export const EvalBar: React.FC<EvalBarProps> = ({ evaluation }) => {
    const whitePercentage = useSharedValue(50);

    useEffect(() => {
        // Clamp evaluation between -10 and 10 and map to 0-100 percentage
        const clamped = Math.max(-10, Math.min(10, evaluation));
        // Normalize: -10 -> 0%, 0 -> 50%, 10 -> 100%
        const percentage = ((clamped + 10) / 20) * 100;
        whitePercentage.value = withSpring(percentage, { damping: 15, stiffness: 60 });
    }, [evaluation]);

    const animatedWhiteStyle = useAnimatedStyle(() => ({
        height: `${whitePercentage.value}%`,
    }));

    const animatedBlackStyle = useAnimatedStyle(() => ({
        height: `${100 - whitePercentage.value}%`,
    }));

    // Display string
    const evalText = evaluation > 0 ? `+${evaluation.toFixed(1)}` : evaluation.toFixed(1);

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.blackBar, animatedBlackStyle]}>
                {evaluation < -1 && <Text style={styles.evalTextBlack}>{evalText}</Text>}
            </Animated.View>
            <Animated.View style={[styles.whiteBar, animatedWhiteStyle]}>
                {evaluation > 1 && <Text style={styles.evalTextWhite}>{evalText}</Text>}
                {Math.abs(evaluation) <= 1 && <Text style={styles.centerText}>{evalText}</Text>}
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 14,
        height: '100%',
        backgroundColor: '#000',
        borderRadius: 2,
        overflow: 'hidden',
        marginRight: 4,
    },
    blackBar: {
        width: '100%',
        backgroundColor: '#403d39',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 4,
    },
    whiteBar: {
        width: '100%',
        backgroundColor: '#fff',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 4,
    },
    evalTextBlack: {
        color: '#fff',
        fontSize: 8,
        fontWeight: 'bold',
    },
    evalTextWhite: {
        color: '#000',
        fontSize: 8,
        fontWeight: 'bold',
    },
    centerText: {
        position: 'absolute',
        top: '50%',
        transform: [{ translateY: -5 }],
        color: '#888',
        fontSize: 8,
        fontWeight: 'bold',
        zIndex: 10,
    }
});
