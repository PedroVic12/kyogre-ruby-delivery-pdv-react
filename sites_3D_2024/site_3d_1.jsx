import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Line } from '@react-three/drei';

// Classe para gerenciar linhas
class LineObject {
  color: string;
  points: [number, number, number][];

  constructor(color: string, points: [number, number, number][]) {
    this.color = color;
    this.points = points;
  }

  // Método para renderizar a linha
  render() {
    return (
      <Line
        points={this.points} // Array de pontos (x, y, z)
        color={this.color}   // Cor da linha
        lineWidth={2}        // Espessura da linha
      />
    );
  }
}

// Componente para renderizar a cena
const Scene: React.FC = () => {
  // Instância de linhas
  const blueLine = new LineObject('blue', [
    [-10, 0, 0],
    [0, 10, 0],
    [10, 0, 0],
  ]);

  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      {blueLine.render()}
    </Canvas>
  );
};
