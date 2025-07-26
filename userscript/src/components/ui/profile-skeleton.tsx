import { Skeleton } from "./skeleton";

export function ProfileSkeleton() {
  return (
    <div className="ppm:p-4 ppm:space-y-6">
      {/* Header Skeleton */}
      <div className="ppm:flex ppm:items-start ppm:space-x-8">
        <Skeleton className="ppm:w-24 ppm:h-24 ppm:rounded-full" />
        <div className="ppm:flex-1 ppm:space-y-4">
          {/* Username */}
          <div className="ppm:flex ppm:items-center ppm:space-x-4">
            <Skeleton className="ppm:h-6 ppm:w-32" />
          </div>
          {/* Estatísticas */}
          <div className="ppm:flex ppm:space-x-8">
            <Skeleton className="ppm:h-4 ppm:w-16" />
            <Skeleton className="ppm:h-4 ppm:w-20" />
            <Skeleton className="ppm:h-4 ppm:w-16" />
          </div>
          {/* Botão */}
          <Skeleton className="ppm:h-8 ppm:w-24" />
          {/* Nome e Bio */}
          <Skeleton className="ppm:h-4 ppm:w-48" />
          <Skeleton className="ppm:h-3 ppm:w-32" />
        </div>
      </div>
      
      {/* Separator */}
      <Skeleton className="ppm:h-px ppm:w-full" />
      
      {/* Tabs Skeleton */}
      <div className="ppm:flex ppm:space-x-8 ppm:border-b ppm:border-gray-200">
        <Skeleton className="ppm:h-8 ppm:w-16" />
        <Skeleton className="ppm:h-8 ppm:w-20" />
      </div>
      
      {/* Content Skeleton */}
      <div className="ppm:grid ppm:grid-cols-3 ppm:gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <Skeleton key={i} className="ppm:aspect-square ppm:w-full" />
        ))}
      </div>
    </div>
  );
} 