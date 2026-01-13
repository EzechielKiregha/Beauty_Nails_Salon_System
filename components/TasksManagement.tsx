"use client"
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { useTasks, useUpdateTask, useDeleteTask } from '@/lib/hooks/useTasks';
import CreateTaskModal from './modals/CreateTaskModal';

export default function TasksManagement() {
  const { data, isLoading } = useTasks({ page: 1, limit: 6 });
  const tasks = data?.tasks || [];

  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const markCompleted = (id: string) => {
    updateTask.mutate({ id, payload: { status: 'completed', completedAt: new Date().toISOString() } });
  };

  const onDelete = (id: string) => {
    if (!confirm('Supprimer la tâche ?')) return;
    deleteTask.mutate(id);
  };

  return (
    <Card className="border-0 shadow-lg rounded-2xl p-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Tâches récentes</h3>
        <div className="flex items-center gap-2">
          <CreateTaskModal triggerLabel="+ Nouvelle tâche" />
          <Button variant="ghost" size="sm">Voir tout</Button>
        </div>
      </div>

      {isLoading ? (
        <p>Chargement des tâches...</p>
      ) : tasks.length === 0 ? (
        <p className="text-sm text-gray-500">Aucune tâche trouvée.</p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((t: any) => (
            <li key={t.id} className="flex items-start justify-between bg-muted/40 p-3 rounded-lg">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{t.title}</h4>
                  <Badge className={`${t.priority === 'high' ? 'bg-red-500' : t.priority === 'urgent' ? 'bg-red-700' : 'bg-gray-300'} text-white text-xs`}>{t.priority}</Badge>
                </div>
                <p className="text-sm text-gray-600 mt-1">{t.description || '-'}</p>
                <p className="text-xs text-gray-500 mt-2">Assigné à: {t.assignedTo?.user?.name || '—'} · Créé par: {t.createdBy?.name || '—'}</p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <Badge className={`${t.status === 'completed' ? 'bg-green-500' : t.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-300'} text-white text-xs`}>{t.status}</Badge>
                <div className="flex items-center gap-2">
                  {t.status !== 'completed' && (
                    <Button size="sm" onClick={() => markCompleted(t.id)}>Compléter</Button>
                  )}
                  <Button size="sm" variant="destructive" onClick={() => onDelete(t.id)}>Supprimer</Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
