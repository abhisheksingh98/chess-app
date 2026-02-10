import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Svg, { Line, Path } from 'react-native-svg';
import { Colors } from '../constants/Theme';

interface EvalGraphProps {
    evaluations: number[]; // Array of scores (-10 to 10)
    width?: number;
    height?: number;
}

export const EvalGraph: React.FC<EvalGraphProps> = ({
    evaluations,
    width = Dimensions.get('window').width - 40,
    height = 100
}) => {
    if (evaluations.length < 2) return null;

    const padding = 10;
    const chartWidth = width - (padding * 2);
    const chartHeight = height - (padding * 2);

    const getX = (index: number) => {
        return padding + (index / (evaluations.length - 1)) * chartWidth;
    };

    const getY = (score: number) => {
        // Map -10 to 10 onto chartHeight to padding
        const clamped = Math.max(-10, Math.min(10, score));
        const normalized = (clamped + 10) / 20; // 0 to 1
        return height - (padding + normalized * chartHeight);
    };

    const pathData = evaluations.map((score, idx) => {
        const command = idx === 0 ? 'M' : 'L';
        return `${command}${getX(idx)} ${getY(score)}`;
    }).join(' ');

    return (
        <View style={styles.container}>
            <Svg width={width} height={height}>
                {/* Zero line */}
                <Line
                    x1={padding}
                    y1={getY(0)}
                    x2={width - padding}
                    y2={getY(0)}
                    stroke={Colors.textMuted}
                    strokeWidth="1"
                    strokeDasharray="4 2"
                />

                {/* Eval Path */}
                <Path
                    d={pathData}
                    fill="none"
                    stroke={Colors.buttonPrimary}
                    strokeWidth="2"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                />
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.backgroundSecondary,
        borderRadius: 8,
        marginVertical: 10,
        overflow: 'hidden',
    }
});
