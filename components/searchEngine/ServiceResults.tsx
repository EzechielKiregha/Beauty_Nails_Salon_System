export function ServiceResults({ data }: any) {
  if (!data?.length) {
    return <p className="text-sm text-gray-500 mt-4">Aucun service trouvé</p>
  }

  return (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto">
      {data.map((service: any) => (
        <div
          key={service.id}
          className="p-5 border border-pink-100 dark:border-pink-900 rounded-2xl shadow-md bg-white dark:bg-gray-950 hover:shadow-lg transition"
        >
          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {service.name}
          </h3>

          {/* Category */}
          <p className="text-sm text-gray-500 mt-1">
            Catégorie: {service.category?.name || "N/A"}
          </p>

          {/* Price */}
          <p className="text-xl text-pink-600 mt-3 font-semibold">
            {service.price?.toLocaleString()} CDF
          </p>

          {/* Duration */}
          {service.duration && (
            <p className="text-sm text-gray-500 mt-1">
              ⏱ {service.duration} min
            </p>
          )}

          {/* Status */}
          <div className="mt-3">
            <span
              className={`px-2 py-1 rounded-full text-xs ${service.isActive
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30"
                  : "bg-red-100 text-red-700 dark:bg-red-900/30"
                }`}
            >
              {service.isActive ? "Actif" : "Inactif"}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}