import { useRef, useState, useEffect, useCallback } from 'react';
import { Trash2, Download, Pen, Minus, Circle, Square } from 'lucide-react';
import PageLayout from '../../../components/layout/PageLayout';

type DrawMode = 'pen' | 'line' | 'rect' | 'circle' | 'eraser';
type Point = { x: number; y: number };

const COLORS = ['#000000', '#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#ffffff'];
const SIZES = [2, 4, 8, 16];

interface DrawAction { mode: DrawMode; color: string; size: number; points: Point[]; }

const DATA = [
  { label: 'Selenium', value: 35, color: '#22c55e' },
  { label: 'Playwright', value: 28, color: '#3b82f6' },
  { label: 'Cypress', value: 20, color: '#f59e0b' },
  { label: 'REST Assured', value: 10, color: '#ef4444' },
  { label: 'Postman', value: 7, color: '#8b5cf6' },
];

function BarChart() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [clicked, setClicked] = useState<number | null>(null);
  const W = 400, H = 200, PAD = 40;
  const max = Math.max(...DATA.map(d => d.value));
  const barW = (W - PAD * 2) / DATA.length - 10;

  return (
    <div className="overflow-x-auto">
      <svg ref={svgRef} width={W} height={H + 60} viewBox={`0 0 ${W} ${H + 60}`}
        className="w-full max-w-lg" data-testid="svg-bar-chart" aria-label="Bar chart of testing tool popularity"
        role="img">
        <title>Testing Tool Popularity</title>
        {/* Y axis */}
        {[0, 10, 20, 30, 40].map(v => {
          const y = PAD + H - (v / max) * H;
          return (
            <g key={v}>
              <line x1={PAD} x2={W - PAD} y1={y} y2={y} stroke="#e5e7eb" strokeWidth="1" />
              <text x={PAD - 5} y={y + 4} textAnchor="end" fontSize="10" fill="#9ca3af">{v}%</text>
            </g>
          );
        })}
        {/* Bars */}
        {DATA.map((d, i) => {
          const x = PAD + i * ((W - PAD * 2) / DATA.length) + 5;
          const barH = (d.value / max) * H;
          const y = PAD + H - barH;
          return (
            <g key={d.label} data-testid={`bar-${d.label.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => { setClicked(i); console.log(`[ClickAndVerify] Bar clicked: ${d.label} = ${d.value}%`); }}
              onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
              style={{ cursor: 'pointer' }}>
              <rect x={x} y={y} width={barW} height={barH}
                fill={d.color} opacity={hovered === i ? 1 : 0.8}
                rx="3" className="transition-all duration-150"
                data-value={d.value} data-label={d.label} />
              {(hovered === i || clicked === i) && (
                <rect x={x - 5} y={y - 24} width={barW + 10} height={20} fill="black" rx="3" opacity={0.8} />
              )}
              {(hovered === i || clicked === i) && (
                <text x={x + barW / 2} y={y - 9} textAnchor="middle" fontSize="11" fill="white" fontWeight="bold"
                  data-testid={`bar-tooltip-${d.label.toLowerCase().replace(/\s+/g, '-')}`}>
                  {d.value}%
                </text>
              )}
              <text x={x + barW / 2} y={PAD + H + 16} textAnchor="middle" fontSize="9" fill="#6b7280">
                {d.label.split(' ')[0]}
              </text>
            </g>
          );
        })}
        {/* X axis line */}
        <line x1={PAD} x2={W - PAD} y1={PAD + H} y2={PAD + H} stroke="#d1d5db" strokeWidth="1.5" />
      </svg>
      {clicked !== null && (
        <p className="text-xs text-center text-gray-600 dark:text-gray-400 mt-1" data-testid="chart-clicked-info">
          Clicked: <span className="font-semibold text-blue-600 dark:text-blue-400">{DATA[clicked].label}</span> — <span data-testid="chart-clicked-value">{DATA[clicked].value}%</span>
        </p>
      )}
    </div>
  );
}

function DonutChart() {
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);
  const [clickedSlice, setClickedSlice] = useState<number | null>(null);
  const R = 80, CX = 120, CY = 110, INNER = 40;
  let startAngle = -Math.PI / 2;
  const total = DATA.reduce((s, d) => s + d.value, 0);

  const slices = DATA.map(d => {
    const angle = (d.value / total) * 2 * Math.PI;
    const x1 = CX + R * Math.cos(startAngle);
    const y1 = CY + R * Math.sin(startAngle);
    const x2 = CX + R * Math.cos(startAngle + angle);
    const y2 = CY + R * Math.sin(startAngle + angle);
    const ix1 = CX + INNER * Math.cos(startAngle);
    const iy1 = CY + INNER * Math.sin(startAngle);
    const ix2 = CX + INNER * Math.cos(startAngle + angle);
    const iy2 = CY + INNER * Math.sin(startAngle + angle);
    const large = angle > Math.PI ? 1 : 0;
    const midAngle = startAngle + angle / 2;
    const path = `M ${ix1} ${iy1} L ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${INNER} ${INNER} 0 ${large} 0 ${ix1} ${iy1} Z`;
    const labelX = CX + (R + 20) * Math.cos(midAngle);
    const labelY = CY + (R + 20) * Math.sin(midAngle);
    const result = { ...d, path, midAngle, labelX, labelY, startAngle };
    startAngle += angle;
    return result;
  });

  return (
    <div className="overflow-x-auto">
      <svg width="280" height="220" viewBox="0 0 280 220" data-testid="svg-donut-chart" aria-label="Donut chart" role="img" className="w-full max-w-xs">
        <title>Tool Usage Donut Chart</title>
        {slices.map((s, i) => (
          <path key={s.label} d={s.path} fill={s.color}
            opacity={hoveredSlice === i ? 1 : 0.85}
            transform={hoveredSlice === i ? `translate(${Math.cos(s.midAngle) * 5}, ${Math.sin(s.midAngle) * 5})` : ''}
            style={{ cursor: 'pointer', transition: 'all 0.15s' }}
            data-testid={`donut-slice-${s.label.toLowerCase().replace(/\s+/g, '-')}`}
            data-value={s.value}
            onClick={() => { setClickedSlice(i); console.log(`[ClickAndVerify] Donut slice clicked: ${s.label}`); }}
            onMouseEnter={() => setHoveredSlice(i)}
            onMouseLeave={() => setHoveredSlice(null)}
          />
        ))}
        {/* Legend */}
        {DATA.map((d, i) => (
          <g key={d.label} transform={`translate(160, ${20 + i * 18})`} data-testid={`donut-legend-${d.label.toLowerCase().replace(/\s+/g, '-')}`}>
            <rect width="10" height="10" fill={d.color} rx="2" />
            <text x="14" y="9" fontSize="10" fill="#6b7280">{d.label} ({d.value}%)</text>
          </g>
        ))}
        {/* Center label */}
        <text x={CX} y={CY - 6} textAnchor="middle" fontSize="13" fontWeight="bold" fill="#374151" data-testid="donut-center-label">Tools</text>
        <text x={CX} y={CY + 10} textAnchor="middle" fontSize="10" fill="#9ca3af">Click slices</text>
      </svg>
      {clickedSlice !== null && (
        <p className="text-xs text-center text-gray-600 dark:text-gray-400 mt-1" data-testid="donut-clicked-info">
          Selected: <span className="font-semibold" style={{ color: DATA[clickedSlice].color }} data-testid="donut-clicked-label">{DATA[clickedSlice].label}</span>
        </p>
      )}
    </div>
  );
}

export default function CanvasPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<DrawMode>('pen');
  const [color, setColor] = useState('#000000');
  const [size, setSize] = useState(4);
  const [drawing, setDrawing] = useState(false);
  const [lastPos, setLastPos] = useState<Point | null>(null);
  const [startPos, setStartPos] = useState<Point | null>(null);
  const [mousePos, setMousePos] = useState<Point>({ x: 0, y: 0 });
  const [clickLog, setClickLog] = useState<{ x: number; y: number; ts: string }[]>([]);
  const actionsRef = useRef<ImageData[]>([]);

  const getPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ('touches' in e) {
      return { x: (e.touches[0].clientX - rect.left) * scaleX, y: (e.touches[0].clientY - rect.top) * scaleY };
    }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  const saveState = useCallback(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !canvasRef.current) return;
    actionsRef.current = [...actionsRef.current.slice(-19), ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)];
  }, []);

  const undo = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !canvasRef.current || actionsRef.current.length === 0) return;
    const prev = actionsRef.current[actionsRef.current.length - 1];
    actionsRef.current = actionsRef.current.slice(0, -1);
    ctx.putImageData(prev, 0, 0);
  };

  const clear = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !canvasRef.current) return;
    saveState();
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    console.log('[ClickAndVerify] Canvas cleared');
  };

  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    saveState();
    const pos = getPos(e);
    setDrawing(true);
    setLastPos(pos);
    setStartPos(pos);
    const log = { x: Math.round(pos.x), y: Math.round(pos.y), ts: new Date().toLocaleTimeString() };
    setClickLog(l => [log, ...l].slice(0, 8));
    console.log(`[ClickAndVerify] Canvas mousedown: x=${log.x} y=${log.y} mode=${mode}`);
  };

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getPos(e);
    setMousePos(pos);
    if (!drawing || !lastPos) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = mode === 'eraser' ? '#ffffff' : color;
    ctx.lineWidth = mode === 'eraser' ? size * 3 : size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    if (mode === 'pen' || mode === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(lastPos.x, lastPos.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      setLastPos(pos);
    }
  };

  const onMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing || !startPos) return;
    const pos = getPos(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.strokeStyle = color;
      ctx.lineWidth = size;
      if (mode === 'line') {
        ctx.beginPath(); ctx.moveTo(startPos.x, startPos.y); ctx.lineTo(pos.x, pos.y); ctx.stroke();
      } else if (mode === 'rect') {
        ctx.strokeRect(startPos.x, startPos.y, pos.x - startPos.x, pos.y - startPos.y);
      } else if (mode === 'circle') {
        const r = Math.sqrt((pos.x - startPos.x) ** 2 + (pos.y - startPos.y) ** 2);
        ctx.beginPath(); ctx.arc(startPos.x, startPos.y, r, 0, 2 * Math.PI); ctx.stroke();
      }
    }
    setDrawing(false);
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = 'clickandverify-drawing.png';
    a.click();
    console.log('[ClickAndVerify] Canvas downloaded');
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#e5e7eb';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Draw something here!', canvas.width / 2, canvas.height / 2);
  }, []);

  const tools: { id: DrawMode; label: string; icon: React.ReactNode }[] = [
    { id: 'pen', label: 'Pen', icon: <Pen size={14} /> },
    { id: 'line', label: 'Line', icon: <Minus size={14} /> },
    { id: 'rect', label: 'Rect', icon: <Square size={14} /> },
    { id: 'circle', label: 'Circle', icon: <Circle size={14} /> },
    { id: 'eraser', label: 'Eraser', icon: <span className="text-xs">⬜</span> },
  ];

  return (
    <PageLayout title="Canvas & SVG Interactions" description="Drawing canvas and SVG charts. Practice mouse coordinate, click, and pixel-level assertions." difficulty="expert" testId="canvas-page" onReset={clear}>
      <div className="max-w-5xl mx-auto space-y-6">

        {/* SVG Charts */}
        <div className="card p-6" data-testid="section-svg-charts">
          <h2 className="section-header">SVG Charts (Click Interaction)</h2>
          <p className="section-sub">Click bars or donut slices. Verify tooltip text and selected values in assertions.</p>
          <div className="grid sm:grid-cols-2 gap-6">
            <div data-testid="svg-bar-chart-container">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Bar Chart — hover/click bars</p>
              <BarChart />
            </div>
            <div data-testid="svg-donut-chart-container">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Donut Chart — hover/click slices</p>
              <DonutChart />
            </div>
          </div>
        </div>

        {/* Canvas Drawing */}
        <div className="card p-6" data-testid="section-canvas-drawing">
          <h2 className="section-header">Canvas Drawing Widget</h2>
          <p className="section-sub">Use mouse/touch to draw. Practice coordinate-based actions.</p>

          {/* Toolbar */}
          <div className="flex flex-wrap gap-3 items-center mb-3" data-testid="canvas-toolbar">
            <div className="flex gap-1" role="group" aria-label="Drawing tools">
              {tools.map(t => (
                <button key={t.id} onClick={() => setMode(t.id)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium border transition-all ${mode === t.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                  data-testid={`canvas-tool-${t.id}`} aria-pressed={mode === t.id}>
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
            <div className="flex gap-1" data-testid="canvas-colors" role="group" aria-label="Color palette">
              {COLORS.map(c => (
                <button key={c} onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-full border-2 transition-transform ${color === c ? 'scale-125 border-blue-500' : 'border-transparent hover:border-gray-400'}`}
                  style={{ backgroundColor: c }} data-testid={`canvas-color-${c.slice(1)}`}
                  aria-label={`Color ${c}`} aria-pressed={color === c} />
              ))}
            </div>
            <div className="flex gap-1" role="group" aria-label="Brush size">
              {SIZES.map(s => (
                <button key={s} onClick={() => setSize(s)}
                  className={`w-7 h-7 rounded flex items-center justify-center border transition-all ${size === s ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-400'}`}
                  data-testid={`canvas-size-${s}`} aria-pressed={size === s}>
                  <div className="rounded-full bg-gray-700 dark:bg-gray-300" style={{ width: s, height: s }} />
                </button>
              ))}
            </div>
            <div className="ml-auto flex gap-2">
              <button onClick={undo} className="btn-secondary text-xs" data-testid="canvas-undo">↩ Undo</button>
              <button onClick={clear} className="btn-secondary text-xs" data-testid="canvas-clear"><Trash2 size={12} /> Clear</button>
              <button onClick={downloadCanvas} className="btn-primary text-xs" data-testid="canvas-download"><Download size={12} /> Download PNG</button>
            </div>
          </div>

          {/* Canvas */}
          <div className="relative border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden" data-testid="canvas-wrapper">
            <canvas ref={canvasRef} width={800} height={400}
              className="w-full cursor-crosshair block"
              style={{ touchAction: 'none' }}
              data-testid="drawing-canvas"
              data-mode={mode}
              data-color={color}
              data-size={size}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={() => setDrawing(false)}
              aria-label="Drawing canvas" role="img" />
            {/* Coordinates display */}
            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded font-mono" data-testid="canvas-coordinates">
              x: <span data-testid="canvas-x">{Math.round(mousePos.x)}</span>, y: <span data-testid="canvas-y">{Math.round(mousePos.y)}</span>
            </div>
          </div>

          {/* Click log */}
          {clickLog.length > 0 && (
            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg" data-testid="canvas-click-log">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Mouse Down Log (for coordinate assertions)</p>
              <div className="flex flex-wrap gap-2">
                {clickLog.map((c, i) => (
                  <span key={i} className="text-xs font-mono bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 px-2 py-0.5 rounded" data-testid={`canvas-click-${i}`}>
                    ({c.x}, {c.y}) @ {c.ts}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SVG interactive elements */}
        <div className="card p-6" data-testid="section-svg-interactive">
          <h2 className="section-header">SVG Interactive Elements</h2>
          <p className="section-sub">Click, hover, and drag SVG shapes. Good for testing coordinate-based mouse interactions.</p>
          <svg width="100%" height="160" viewBox="0 0 500 160" data-testid="svg-interactive" aria-label="Interactive SVG shapes">
            <title>Interactive SVG shapes for automation practice</title>
            {[
              { x: 60, y: 80, r: 40, color: '#3b82f6', id: 'svg-circle-blue', label: 'Circle' },
              { x: 180, y: 80, r: 35, color: '#22c55e', id: 'svg-circle-green', label: 'Click me' },
              { x: 300, y: 80, r: 30, color: '#f59e0b', id: 'svg-circle-yellow', label: 'Hover' },
              { x: 420, y: 80, r: 45, color: '#ef4444', id: 'svg-circle-red', label: 'Target' },
            ].map(c => (
              <g key={c.id}>
                <circle cx={c.x} cy={c.y} r={c.r} fill={c.color} opacity="0.85"
                  data-testid={c.id} data-cx={c.x} data-cy={c.y}
                  className="cursor-pointer hover:opacity-100 transition-opacity"
                  onClick={() => console.log(`[ClickAndVerify] SVG circle clicked: ${c.id} at (${c.x}, ${c.y})`)}
                  style={{ cursor: 'pointer' }}
                />
                <text x={c.x} y={c.y + 4} textAnchor="middle" fontSize="11" fill="white" fontWeight="bold" style={{ pointerEvents: 'none' }}>
                  {c.label}
                </text>
              </g>
            ))}
            {/* Draggable rect indicator */}
            <rect x="10" y="130" width="480" height="20" fill="#f3f4f6" rx="4" />
            <text x="250" y="144" textAnchor="middle" fontSize="11" fill="#9ca3af">
              All shapes have data-testid, data-cx, data-cy attributes for precise targeting
            </text>
          </svg>
        </div>
      </div>
    </PageLayout>
  );
}
