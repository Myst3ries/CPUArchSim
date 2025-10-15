# CPU Architecture Simulator

### 3D Interactive Comparison of RISC, CISC, and EPIC Architectures

This project visualizes how **RISC**, **CISC**, and **EPIC (Itanium)** architectures handle instruction execution cycles.  
It is built using **React**, **Tailwind CSS**, and **Plotly.js** for rich, interactive 3D visualization.

---

## 🚀 Live Demo
👉 **[View the Simulator](https://myst3ries.github.io/CPUArchSim/)**  

---

Features
- **Instruction Library** – Add memory, arithmetic, or control operations dynamically.
- **Architecture Comparison** – Visualizes RISC, CISC, and EPIC execution cycles in 3D.
- **Plotly Visualization** – Real-time updates for each added instruction.
- **Reset & Modify** – Instantly reset or modify instruction sets.
- **Compact UI** – Built with Tailwind CSS for responsiveness and clarity.

---

Tech Stack
| Tool | Purpose |
|------|----------|
| **React (CDN)** | Component logic and state management |
| **Plotly.js** | 3D data visualization |
| **Tailwind CSS** | UI styling |
| **GitHub Pages** | Hosting and deployment |

---

Architecture Logic

| Architecture | Cycle Model | Key Trait |
|---------------|--------------|------------|
| **RISC** | 1 cycle per instruction | Simple, predictable, low power |
| **CISC** | 2–4 cycles per instruction | Complex, multi-cycle ops |
| **EPIC** | Bundled (3 per cycle) | Parallel execution, compiler-driven |

---

## 📂 File Structure

cpu-architecture-simulator/
│
├── index.html # Entry point (loads React & Plotly)
├── CPUArchitectureSimulator.js # Main React component
└── README.md # Project documentation
