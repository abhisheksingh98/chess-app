import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

interface PieceProps {
    type: 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
    color: 'w' | 'b';
    size: number;
}

// Simplified SVG components for each piece to ensure premium look
const Pawn = ({ color }: { color: string }) => (
    <G fill={color} stroke="#000" strokeWidth="1.5">
        <Path d="M22 35s4-2 4-7c0-5-4-7-4-7s-4 2-4 7c0 5 4 7 4 7z" />
        <Path d="M12 35h20v2H12zM15 32h14v2H15z" />
    </G>
);

const Knight = ({ color }: { color: string }) => (
    <G fill={color} stroke="#000" strokeWidth="1.5">
        <Path d="M22 10s5 2 5 7-5 15-5 15h-8s-2-15 3-22c0 0 2-5 5-5z" />
    </G>
);

const Bishop = ({ color }: { color: string }) => (
    <G fill={color} stroke="#000" strokeWidth="1.5">
        <Path d="M22 10s5 4 5 10-5 15-5 15-5-5-5-15 5-10 5-10zM18 12l8 8" />
    </G>
);

const Rook = ({ color }: { color: string }) => (
    <G fill={color} stroke="#000" strokeWidth="1.5">
        <Path d="M12 10v25h20V10h-4v4h-3V10h-2v4h-3V10h-2v4h-3V10h-3z" />
    </G>
);

const Queen = ({ color }: { color: string }) => (
    <G fill={color} stroke="#000" strokeWidth="1.5">
        <Path d="M10 10l5 5h14l5-5v25H10z" />
        <Path d="M22 5s3 2 3 5-3 5-3 5-3-2-3-5 3-5 3-5z" />
    </G>
);

const King = ({ color }: { color: string }) => (
    <G fill={color} stroke="#000" strokeWidth="1.5">
        <Path d="M10 35h24v2H10zM12 32h20v2H12zM15 10l2 22h10l2-22z" />
        <Path d="M20 5h4v10h-4zM18 8h8v4h-8z" />
    </G>
);

export const ChessPiece: React.FC<PieceProps> = React.memo(({ type, color, size }) => {
    const pieceColor = color === 'w' ? '#FFFFFF' : '#333333';

    const renderPiece = () => {
        switch (type) {
            case 'p': return <Pawn color={pieceColor} />;
            case 'n': return <Knight color={pieceColor} />;
            case 'b': return <Bishop color={pieceColor} />;
            case 'r': return <Rook color={pieceColor} />;
            case 'q': return <Queen color={pieceColor} />;
            case 'k': return <King color={pieceColor} />;
        }
    };

    return (
        <View style={styles.container}>
            <Svg width={size} height={size} viewBox="0 0 45 45">
                {renderPiece()}
            </Svg>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 3,
    },
});
