import React from 'react';
import { Text, Dimensions } from 'react-native';

const ThemeText = (props) => {
    const { textStyle } = styles;
    const getTextSize = (size) => {
        const dimensions = Dimensions.get('window');
        let textSize;
        if ((dimensions.width > 1000 || dimensions.height > 900) && dimensions.scale === 1 && size < 16) {
            textSize = size + 2;
        } else {
            textSize = size;
        }
        return textSize;
    };

    return (
        <Text style={[textStyle, props.style, { fontSize: getTextSize(props.style.fontSize) }]}>{props.children}</Text >
    );
};

const styles = {
    textStyle: {
        color: '#395274'
    }
};

export { ThemeText };
