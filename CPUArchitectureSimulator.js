import React, { useState, useEffect, useRef } from 'react';
import * as Plotly from 'plotly';

// Instruction library with categories
const INSTRUCTION_LIBRARY = {
  memory: [
    { name: 'LOAD', desc: 'Load data from memory to register', color: 'bg-green-500' },
    { name: 'STORE', desc: 'Store register data to memory', color: 'bg-green-500' },
    { name: 'MOV', desc: 'Move data between registers', color: 'bg-green-500' },
    { name: 'PUSH', desc: 'Push data onto stack', color: 'bg-green-500' },
    { name: 'POP', desc: 'Pop data from stack', color: 'bg-green-500' }
  ],
  arithmetic: [
    { name: 'ADD', desc: 'Add two register values', color: 'bg-blue-500' },
    { name: 'SUB', desc: 'Subtract two register values', color: 'bg-blue-500' },
    { name: 'MUL', desc: 'Multiply two register values', color: 'bg-blue-500' },
    { name: 'DIV', desc: 'Divide two register values', color: 'bg-blue-500' },
    { name: 'AND', desc: 'Bitwise AND operation', color: 'bg-blue-500' },
    { name: 'OR', desc: 'Bitwise OR operation', color: 'bg-blue-500' },
    { name: 'XOR', desc: 'Bitwise XOR operation', color: 'bg-blue-500' },
    { name: 'CMP', desc: 'Compare two values', color: 'bg-blue-500' }
  ],
  control: [
    { name: 'JMP', desc: 'Unconditional jump to address', color: 'bg-orange-500' },
    { name: 'CALL', desc: 'Call a subroutine', color: 'bg-orange-500' },
    { name: 'RET', desc: 'Return from subroutine', color: 'bg-orange-500' },
    { name: 'BRANCH', desc: 'Conditional branch instruction', color: 'bg-orange-500' }
  ]
};

const CPUArchitectureSimulator = () => {
  const [selectedInstructions, setSelectedInstructions] = useState([]);
  const [simulationData, setSimulationData] = useState(null);
  const plotRef = useRef(null);
  const containerRef = useRef(null);

  // Calculate cycles for each architecture
  const calculateCycles = (instructions) => {
    const riscCycles = instructions.map(() => 1);
    const ciscCycles = instructions.map(() => Math.floor(Math.random() * 3) + 2);
    
    const epicCycles = [];
    for (let i = 0; i < instructions.length; i++) {
      epicCycles.push(Math.floor(i / 3) + 1);
    }

    return { riscCycles, ciscCycles, epicCycles };
  };

  // Update 3D visualization with responsive sizing
  useEffect(() => {
    if (!plotRef.current) return;

    if (selectedInstructions.length === 0) {
      // Completely purge and clear the plot
      Plotly.purge(plotRef.current);
      setSimulationData(null);
      return;
    }

    const { riscCycles, ciscCycles, epicCycles } = calculateCycles(selectedInstructions);

    const createTrace = (archIndex, cycles, color, name) => {
      return {
        type: 'scatter3d',
        mode: 'markers',
        name: name,
        x: Array(cycles.length).fill(archIndex),
        y: cycles.map((_, i) => i),
        z: cycles,
        marker: {
          size: 10,
          color: color,
          symbol: 'square',
          line: { width: 1, color: '#333' }
        },
        text: cycles.map((c, i) => `${selectedInstructions[i]}: ${c} cycle${c > 1 ? 's' : ''}`),
        hovertemplate: '<b>%{text}</b><extra></extra>'
      };
    };

    const createBars = (archIndex, cycles, color) => {
      const traces = [];
      cycles.forEach((cycle, i) => {
        traces.push({
          type: 'scatter3d',
          mode: 'lines',
          x: [archIndex, archIndex],
          y: [i, i],
          z: [0, cycle],
          line: { width: 18, color: color },
          showlegend: false,
          hoverinfo: 'skip'
        });
      });
      return traces;
    };

    const riscBars = createBars(0, riscCycles, '#4CAF50');
    const ciscBars = createBars(1, ciscCycles, '#2196F3');
    const epicBars = createBars(2, epicCycles, '#FF5722');

    const traces = [
      ...riscBars,
      ...ciscBars,
      ...epicBars,
      createTrace(0, riscCycles, '#4CAF50', 'RISC'),
      createTrace(1, ciscCycles, '#2196F3', 'CISC'),
      createTrace(2, epicCycles, '#FF5722', 'EPIC')
    ];

    const layout = {
      autosize: true,
      title: {
        text: 'CPU Architecture Comparison',
        font: { size: 16, color: '#1f2937' }
      },
      scene: {
        xaxis: {
          title: { text: 'Architecture', font: { size: 11 } },
          tickvals: [0, 1, 2],
          ticktext: ['RISC', 'CISC', 'EPIC'],
          gridcolor: '#d1d5db',
          backgroundcolor: '#ffffff'
        },
        yaxis: {
          title: { text: 'Instruction', font: { size: 11 } },
          gridcolor: '#d1d5db',
          backgroundcolor: '#ffffff'
        },
        zaxis: {
          title: { text: 'Cycles', font: { size: 11 } },
          gridcolor: '#d1d5db',
          backgroundcolor: '#ffffff'
        },
        camera: {
          eye: { x: 1.5, y: 1.5, z: 1.2 }
        },
        bgcolor: '#ffffff'
      },
      paper_bgcolor: '#ffffff',
      plot_bgcolor: '#ffffff',
      font: { color: '#1f2937', size: 10 },
      margin: { l: 0, r: 0, t: 30, b: 0 },
      showlegend: true,
      legend: {
        x: 0.75,
        y: 0.98,
        bgcolor: 'rgba(255, 255, 255, 0.9)',
        bordercolor: '#d1d5db',
        borderwidth: 1,
        font: { size: 10 }
      }
    };

    const config = {
      responsive: true,
      displayModeBar: true,
      displaylogo: false,
      modeBarButtonsToRemove: ['toImage']
    };

    Plotly.newPlot(plotRef.current, traces, layout, config);

    // Handle window resize
    const handleResize = () => {
      if (plotRef.current) {
        Plotly.Plots.resize(plotRef.current);
      }
    };
    window.addEventListener('resize', handleResize);

    const riscTotal = riscCycles.reduce((a, b) => a + b, 0);
    const ciscTotal = ciscCycles.reduce((a, b) => a + b, 0);
    const epicTotal = Math.ceil(selectedInstructions.length / 3);

    setSimulationData({
      risc: { total: riscTotal, count: selectedInstructions.length },
      cisc: { total: ciscTotal, count: selectedInstructions.length },
      epic: { total: epicTotal, count: selectedInstructions.length }
    });

    return () => window.removeEventListener('resize', handleResize);
  }, [selectedInstructions]);

  const addInstruction = (instruction) => {
    setSelectedInstructions([...selectedInstructions, instruction.name]);
  };

  const removeInstruction = (index) => {
    setSelectedInstructions(selectedInstructions.filter((_, i) => i !== index));
  };

  const resetSimulation = () => {
    // Clear all data first
    setSelectedInstructions([]);
    setSimulationData(null);
    
    // Force immediate plot cleanup
    if (plotRef.current) {
      Plotly.purge(plotRef.current);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Left Sidebar - Instruction Library */}
      <div className="w-64 bg-gray-800 text-gray-100 border-r border-gray-700 overflow-y-auto flex-shrink-0">
        <div className="p-3 border-b border-gray-700 sticky top-0 bg-gray-800 z-10">
          <h2 className="text-base font-bold text-white">📚 Instruction Library</h2>
          <p className="text-xs text-gray-400 mt-0.5">Click to add</p>
        </div>

        {/* Memory Operations */}
        <div className="p-3">
          <h3 className="text-xs font-semibold text-green-400 mb-2 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
            Memory
          </h3>
          {INSTRUCTION_LIBRARY.memory.map((instr, idx) => (
            <InstructionCard key={idx} instruction={instr} onAdd={addInstruction} />
          ))}
        </div>

        <div className="p-3">
          <h3 className="text-xs font-semibold text-blue-400 mb-2 flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-1.5"></span>
            Arithmetic/Logic
          </h3>
          {INSTRUCTION_LIBRARY.arithmetic.map((instr, idx) => (
            <InstructionCard key={idx} instruction={instr} onAdd={addInstruction} />
          ))}
        </div>

        <div className="p-3">
          <h3 className="text-xs font-semibold text-orange-400 mb-2 flex items-center">
            <span className="w-2 h-2 bg-orange-500 rounded-full mr-1.5"></span>
            Control Flow
          </h3>
          {INSTRUCTION_LIBRARY.control.map((instr, idx) => (
            <InstructionCard key={idx} instruction={instr} onAdd={addInstruction} />
          ))}
        </div>

        <div className="p-3 bg-gray-900 m-3 rounded border border-gray-700">
          <h3 className="text-xs font-semibold text-white mb-1.5">🔍 Architecture Info</h3>
          <div className="text-xs text-gray-300 space-y-1.5 leading-tight">
            <p><strong className="text-green-400">RISC:</strong> 1 cycle/instruction</p>
            <p><strong className="text-blue-400">CISC:</strong> 2-4 cycles/instruction</p>
            <p><strong className="text-orange-400">EPIC:</strong> Parallel bundles</p>
          </div>
        </div>
      </div>

      {/* Right Panel - Simulation Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Compact Header */}
        <div className="bg-gray-100 border-b border-gray-300 py-2 px-4 flex-shrink-0">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-lg font-bold text-gray-900">CPU Architecture Simulator</h1>
              <p className="text-xs text-gray-600">3D visualization of RISC, CISC, and EPIC</p>
            </div>
            <button
              onClick={resetSimulation}
              className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded transition-colors font-medium"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Compact Controls Section */}
        <div className="bg-gray-50 border-b border-gray-300 flex-shrink-0">
          {/* Current Instructions */}
          {selectedInstructions.length > 0 && (
            <div className="px-4 py-2 border-b border-gray-200">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">Program ({selectedInstructions.length}):</span>
                {selectedInstructions.map((instr, idx) => (
                  <div key={idx} className="bg-white border border-gray-300 px-2 py-0.5 rounded-full text-xs flex items-center gap-1.5">
                    <span className="text-gray-700">{idx + 1}. {instr}</span>
                    <button
                      onClick={() => removeInstruction(idx)}
                      className="text-red-600 hover:text-red-700 font-bold leading-none"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Compact Stats */}
          {simulationData && (
            <div className="px-4 py-2">
              <div className="flex gap-3">
                <div className="bg-green-50 border border-green-300 rounded px-3 py-1.5 flex-1">
                  <div className="text-green-700 font-semibold text-xs">RISC</div>
                  <div className="text-lg font-bold text-green-900">{simulationData.risc.total}</div>
                  <div className="text-xs text-green-600">{simulationData.risc.count} instructions</div>
                </div>
                <div className="bg-blue-50 border border-blue-300 rounded px-3 py-1.5 flex-1">
                  <div className="text-blue-700 font-semibold text-xs">CISC</div>
                  <div className="text-lg font-bold text-blue-900">{simulationData.cisc.total}</div>
                  <div className="text-xs text-blue-600">{simulationData.cisc.count} instructions</div>
                </div>
                <div className="bg-orange-50 border border-orange-300 rounded px-3 py-1.5 flex-1">
                  <div className="text-orange-700 font-semibold text-xs">EPIC</div>
                  <div className="text-lg font-bold text-orange-900">{simulationData.epic.total}</div>
                  <div className="text-xs text-orange-600">{Math.ceil(simulationData.epic.count / 3)} bundles</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3D Visualization - Maximum Space */}
        <div ref={containerRef} className="flex-1 bg-white overflow-hidden">
          {selectedInstructions.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="text-5xl mb-3">🎯</div>
                <h3 className="text-lg font-semibold mb-1 text-gray-700">No Instructions Selected</h3>
                <p className="text-xs text-gray-600">Click instructions from the sidebar to begin</p>
              </div>
            </div>
          ) : (
            <div ref={plotRef} className="w-full h-full"></div>
          )}
        </div>
      </div>
    </div>
  );
};

// Compact Instruction Card Component
const InstructionCard = ({ instruction, onAdd }) => {
  return (
    <div className="bg-gray-700 rounded p-2 mb-1.5 hover:bg-gray-600 transition-colors">
      <div className="flex flex-col mb-1.5">
        <div className="font-bold text-white text-xs mb-0.5">{instruction.name}</div>
        <div className="text-xs text-gray-300 leading-snug">{instruction.desc}</div>
      </div>
      <button
        onClick={() => onAdd(instruction)}
        className={`w-full ${instruction.color} hover:opacity-90 text-white text-xs py-1 px-2 rounded transition-opacity font-medium`}
      >
        + Add
      </button>
    </div>
  );
};

export default CPUArchitectureSimulator;
