import { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, RotateCcw, CheckSquare, Square } from 'lucide-react';
import PageLayout from '../../../components/layout/PageLayout';

interface Task { id: string; title: string; priority: 'low' | 'medium' | 'high'; done: boolean; }

const INITIAL_TASKS: Task[] = [
  { id: 't1', title: 'Write login automation tests', priority: 'high', done: false },
  { id: 't2', title: 'Set up CI/CD pipeline', priority: 'high', done: false },
  { id: 't3', title: 'Document test data requirements', priority: 'medium', done: true },
  { id: 't4', title: 'Review pull request #42', priority: 'medium', done: false },
  { id: 't5', title: 'Update Selenium grid configuration', priority: 'low', done: false },
  { id: 't6', title: 'Add smoke test suite', priority: 'high', done: false },
  { id: 't7', title: 'Fix flaky test in checkout flow', priority: 'high', done: false },
  { id: 't8', title: 'Generate test coverage report', priority: 'low', done: true },
];

const PRIORITY_COLORS: Record<string, string> = {
  low: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

function SortableItem({ task, onToggle }: { task: Task; onToggle: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 10 : undefined };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3.5 rounded-lg border transition-all bg-white dark:bg-gray-900 ${
        isDragging ? 'shadow-xl border-blue-300 dark:border-blue-600 scale-[1.01]' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
      } ${task.done ? 'opacity-60' : ''}`}
      data-testid={`drag-item-${task.id}`}
      data-priority={task.priority}
      data-done={task.done}
      aria-label={`${task.title}, priority: ${task.priority}`}
    >
      <button
        {...attributes}
        {...listeners}
        className="text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 cursor-grab active:cursor-grabbing touch-none"
        data-testid={`drag-handle-${task.id}`}
        aria-label={`Drag handle for ${task.title}`}
      >
        <GripVertical size={18} />
      </button>
      <button
        onClick={() => onToggle(task.id)}
        className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors shrink-0"
        data-testid={`drag-toggle-${task.id}`}
        aria-label={task.done ? `Mark "${task.title}" as incomplete` : `Mark "${task.title}" as done`}
        aria-pressed={task.done}
      >
        {task.done ? <CheckSquare size={18} className="text-green-500" /> : <Square size={18} />}
      </button>
      <span className={`flex-1 text-sm font-medium text-gray-800 dark:text-gray-200 ${task.done ? 'line-through text-gray-400' : ''}`} data-testid={`drag-title-${task.id}`}>
        {task.title}
      </span>
      <span className={`badge text-xs ${PRIORITY_COLORS[task.priority]}`} data-testid={`drag-priority-${task.id}`}>
        {task.priority}
      </span>
    </div>
  );
}

export default function DragDropPage() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [dragLog, setDragLog] = useState<string[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setTasks((items) => {
        const from = items.findIndex((i) => i.id === active.id);
        const to = items.findIndex((i) => i.id === over.id);
        const moved = items[from].title;
        const entry = `Moved "${moved}" from position ${from + 1} → ${to + 1}`;
        setDragLog((l) => [entry, ...l].slice(0, 5));
        console.log(`[ClickAndVerify] Drag drop: ${entry}`);
        return arrayMove(items, from, to);
      });
    }
  };

  const toggleDone = (id: string) => {
    setTasks((t) => t.map((item) => item.id === id ? { ...item, done: !item.done } : item));
    const task = tasks.find((t) => t.id === id);
    console.log(`[ClickAndVerify] Toggle task done: ${task?.title}`);
  };

  const doneCount = tasks.filter((t) => t.done).length;

  return (
    <PageLayout title="Drag & Drop Reorder" description="Reorder tasks by dragging the grip handle. Keyboard-navigable too (Tab + Space/Enter)." difficulty="intermediate" testId="drag-drop-page"
      onReset={() => { setTasks(INITIAL_TASKS); setDragLog([]); }}>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Progress */}
        <div className="card p-4 flex items-center justify-between" data-testid="drag-progress">
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Task Progress</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              <span data-testid="drag-done-count">{doneCount}</span> / <span data-testid="drag-total-count">{tasks.length}</span> completed
            </p>
          </div>
          <div className="w-40 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-2 bg-green-500 rounded-full transition-all duration-500"
              style={{ width: `${(doneCount / tasks.length) * 100}%` }}
              data-testid="drag-progress-bar"
            />
          </div>
        </div>

        {/* List */}
        <div data-testid="drag-list">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-700 dark:text-gray-300 text-sm">
              Tasks <span className="text-gray-400">— drag to reorder</span>
            </h2>
          </div>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2" data-testid="sortable-list" role="list" aria-label="Reorderable task list">
                {tasks.map((task) => (
                  <SortableItem key={task.id} task={task} onToggle={toggleDone} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        {/* Order readout */}
        <div className="card p-4" data-testid="current-order">
          <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">Current Order (for test assertions)</h3>
          <ol className="space-y-1">
            {tasks.map((t, i) => (
              <li key={t.id} className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400" data-testid={`order-item-${i + 1}`}>
                <span className="font-mono w-4">{i + 1}.</span>
                <span data-testid={`order-id-${i + 1}`} className="font-mono text-blue-600 dark:text-blue-400">{t.id}</span>
                <span className="text-gray-400">—</span>
                <span>{t.title}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Log */}
        {dragLog.length > 0 && (
          <div className="card p-4" data-testid="drag-log">
            <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">Recent Moves</h3>
            <ul className="space-y-1">
              {dragLog.map((entry, i) => (
                <li key={i} className="text-xs text-gray-500 dark:text-gray-400 font-mono" data-testid={`drag-log-entry-${i}`}>
                  ↕ {entry}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
