import { CheckCircle, Clock, XCircle } from "lucide-react";
import { Badge } from "../ui/badge";
import { useState } from "react";

export function AppointmentResults({ data }: any) {

  const [statusFilter, setStatusFilter] = useState("");

  if (!data?.length) {
    return <p className="text-sm text-gray-500 mt-4">Aucun rendez-vous trouvé</p>
  }

  const filteredAppointments = data?.filter((a: any) =>
    a.status === statusFilter || !statusFilter
  );

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Confirmé
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            <Clock className="w-3 h-3 mr-1" />
            En attente
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Terminé
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            <XCircle className="w-3 h-3 mr-1" />
            Annulé
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="mt-4 space-y-4 max-h-100 overflow-y-auto">
      <select
        onChange={(e) => setStatusFilter(e.target.value)}
        className="p-2 border rounded-lg"
      >
        <option value="">Tous</option>
        <option value="completed">Complété</option>
        <option value="confirmed">Confirmé</option>
        <option value="missed">Manqué</option>
        <option value="cancelled">Annulé</option>
      </select>
      {filteredAppointments?.map((appointment: any) => (
        <div
          key={appointment.id}
          className="p-5 border border-pink-100 dark:border-pink-900 rounded-2xl shadow-md bg-white dark:bg-gray-950"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              {appointment.service?.name}
            </h3>
            {getStatusBadge(appointment.status)}
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm mt-3">
            <span>📅 {new Date(appointment.date).toLocaleDateString()}</span>
            <span>⏰ {appointment.time}</span>
            <span>👤 {appointment.client?.user?.name}</span>
            <span>💅 {appointment.worker?.user?.name}</span>
          </div>

          <div className="mt-3 text-sm text-gray-500">
            TX: {appointment.paymentIntent?.transactionId}
          </div>
        </div>
      ))}
    </div>
  )
}