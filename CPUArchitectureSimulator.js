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

function CPUArchitectureSimulator() {
  const [selectedInstructions, setSelectedInstructions] = React.useState([]);
  const [simulationData, setSimulationData] = React.useState(null);
  const plotRef = React.useRef(null);

  // Function to calculate cycles for RISC, CISC, and EPIC
  const calculateCycles = (instructions) => {
    const riscCycles = instructions.map(() => 1);
    const ciscCycles = instructions.map(() => Math.floor(Math.random() * 3) + 2);
    const epicCycles = [];
    for (let i = 0; i < instructions.length; i++) {
      epicCycles.push(Math.floor(i / 3) + 1);
    }
    return { riscCycles, ciscCycles, epicCycles };
  };

  // 3D Visualization Effect
  React.useEffect(() => {
    if (!plotRef.current) return;

    if (selectedInstructions.length === 0) {
      Plotly.purge(plotRef.current);
      setSimulationData(null);
      return;
    }

    const { riscCycles, ciscCycles, epicCycles } = calculateCycles(selectedInstructions);

    const createTrace = (archIndex, cycles, color, name) => ({
      type: 'scatter3d',
      mode: 'markers',
      name,
      x: Array(cycles.length).fill(archIndex),
      y: cycles.map((_, i) => i),
      z: cycles,
      marker: { size: 10, color, symbol: 'square', line: { width: 1, color: '#333' } },
      text: cycles.map((c, i) => `${selectedInstructions[i]}: ${c} cycle${c > 1 ? 's' : ''}`),
      hovertemplate: '<b>%{text}</b><extra></extra>'
    });

    const createBars = (archIndex, cycles, color) =>
      cycles.map((cycle, i) => ({
        type: 'scatter3d',
        mode: 'lines',
        x: [archIndex, archIndex],
        y: [i, i],
        z: [0, cycle],
        line: { width: 18, color },
        showlegend: false,
        hoverinfo: 'skip'
      }));

    const traces = [
      ...createBars(0, riscCycles, '#4CAF50'),
      ...createBars(1, ciscCycles, '#2196F3'),
      ...createBars(2, epicCycles, '#FF5722'),
      createTrace(0, riscCycles, '#4CAF50', 'RISC'),
      createTrace(1, ciscCycles, '#2196F3', 'CISC'),
      createTrace(2, epicCycles, '#FF5722', 'EPIC')
    ];

    const layout = {
      autosize: true,
      title: { text: 'CPU Architecture Comparison', font: { size: 16, color: '#1f2937' } },
      scene: {
        xaxis: { title: 'Architecture', tickvals: [0, 1, 2], ticktext: ['RISC', 'CISC', 'EPIC'] },
        yaxis: { title: 'Instruction' },
        zaxis: { title: 'Cycles' },
        bgcolor: '#ffffff'
      },
      paper_bgcolor: '#ffffff',
      showlegend: true,
      legend: { x: 0.75, y: 0.98 }
    };

    Plotly.newPlot(plotRef.current, traces, layout, { responsive: true });
  }, [selectedInstructions]);

  const addInstruction = (instruction) =>
    setSelectedInstructions([...selectedInstructions, instruction.name]);

  const removeInstruction = (index) =>
    setSelectedInstructions(selectedInstructions.filter((_, i) => i !== index));

  const resetSimulation = () => {
    setSelectedInstructions([]);
    setSimulationData(null);
    if (plotRef.current) Plotly.purge(plotRef.current);
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-gray-100 border-r border-gray-700 overflow-y-auto flex-shrink-0">
        <div className="p-3 border-b border-gray-700 sticky top-0 bg-gray-800 z-10">
          <h2 className="text-base font-bold text-white">📚 Instruction Library</h2>
          <p className="text-xs text-gray-400 mt-0.5">Click to add</p>
        </div>

        {/* Memory Operations */}
        <InstructionCategory title="Memory" color="green" data={INSTRUCTION_LIBRARY.memory} onAdd={addInstruction} />
        <InstructionCategory title="Arithmetic/Logic" color="blue" data={INSTRUCTION_LIBRARY.arithmetic} onAdd={addInstruction} />
        <InstructionCategory title="Control Flow" color="orange" data={INSTRUCTION_LIBRARY.control} onAdd={addInstruction} />

        <div className="p-3 bg-gray-900 m-3 rounded border border-gray-700">
          <h3 className="text-xs font-semibold text-white mb-1.5">🔍 Architecture Info</h3>
          <div className="text-xs text-gray-300 space-y-1.5">
            <p><strong className="text-green-400">RISC:</strong> 1 cycle/instruction</p>
            <p><strong className="text-blue-400">CISC:</strong> 2–4 cycles/instruction</p>
            <p><strong className="text-orange-400">EPIC:</strong> Parallel bundles</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gray-100 border-b border-gray-300 py-2 px-4 flex-shrink-0 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-gray-900">CPU Architecture Simulator</h1>
            <p className="text-xs text-gray-600">3D visualization of RISC, CISC, and EPIC</p>
          </div>
          <button
            onClick={resetSimulation}
            className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded font-medium"
          >
            Reset
          </button>
        </div>

        {/* Instruction Display */}
        {selectedInstructions.length > 0 && (
          <div className="px-4 py-2 border-b border-gray-200">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-gray-700">Program ({selectedInstructions.length}):</span>
              {selectedInstructions.map((instr, idx) => (
                <div key={idx} className="bg-white border border-gray-300 px-2 py-0.5 rounded-full text-xs flex items-center gap-1.5">
                  <span>{idx + 1}. {instr}</span>
                  <button onClick={() => removeInstruction(idx)} className="text-red-600 hover:text-red-700 font-bold">×</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3D Plot */}
        <div className="flex-1 bg-white overflow-hidden">
          {selectedInstructions.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
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
}

function InstructionCategory({ title, color, data, onAdd }) {
  const colorClass = {
    green: 'text-green-400 bg-green-500',
    blue: 'text-blue-400 bg-blue-500',
    orange: 'text-orange-400 bg-orange-500'
  }[color];

  return (
    <div className="p-3">
      <h3 className={`text-xs font-semibold ${colorClass.split(' ')[0]} mb-2 flex items-center`}>
        <span className={`w-2 h-2 ${colorClass.split(' ')[1]} rounded-full mr-1.5`}></span>
        {title}
      </h3>
      {data.map((instr, idx) => (
        <div key={idx} className="bg-gray-700 rounded p-2 mb-1.5 hover:bg-gray-600 transition-colors">
          <div className="flex flex-col mb-1.5">
            <div className="font-bold text-white text-xs mb-0.5">{instr.name}</div>
            <div className="text-xs text-gray-300 leading-snug">{instr.desc}</div>
          </div>
          <button
            onClick={() => onAdd(instr)}
            className={`w-full ${instr.color} hover:opacity-90 text-white text-xs py-1 px-2 rounded font-medium`}
          >
            + Add
          </button>
        </div>
      ))}
    </div>
  );
}
