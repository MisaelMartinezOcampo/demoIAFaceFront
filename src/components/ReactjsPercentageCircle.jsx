import React from 'react';
import Circle from 'react-circle';

const ReactjsPercentageCircle = ({ radius, borderWidth, percent, color, children }) => {
  const textStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: '1rem',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Circle
        progress={percent}
        animate={true}
        responsive={true}
        size={radius * 2}
        lineWidth={borderWidth}
        progressColor={color}
        bgColor="#ddd"
        textColor="#444"
        roundedStroke={true}
        showPercentageSymbol={false}
      >
        {children}
      </Circle>
      <p style={textStyle}>{percent}%</p>
    </div>
  );
};
export default ReactjsPercentageCircle;