export default function DoctorCardSkeleton() {
    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/60 flex flex-col gap-6 w-full animate-pulse">
            {/* Header Skeleton */}
            <div className="flex justify-between items-start gap-4">
                <div className="space-y-3 flex-1">
                    <div className="h-6 bg-slate-200 rounded-md w-3/4"></div>
                    <div className="h-5 bg-slate-200 rounded-md w-1/2"></div>
                </div>
                <div className="h-8 bg-slate-200 rounded-full w-16 shrink-0"></div>
            </div>

            {/* Contact Details Skeleton */}
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-200 rounded-xl shrink-0"></div>
                    <div className="h-4 bg-slate-200 rounded-md w-full"></div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-200 rounded-xl shrink-0"></div>
                    <div className="h-4 bg-slate-200 rounded-md w-2/3"></div>
                </div>
            </div>

            {/* Tags Skeleton */}
            <div className="pt-4 border-t border-slate-100 flex gap-2">
                <div className="h-6 bg-slate-200 rounded-full w-16"></div>
                <div className="h-6 bg-slate-200 rounded-full w-20"></div>
                <div className="h-6 bg-slate-200 rounded-full w-24"></div>
            </div>

            {/* Feedback Skeleton */}
            <div className="mt-auto pt-2">
                <div className="h-16 bg-slate-200 rounded-2xl rounded-tl-none"></div>
            </div>
        </div>
    );
}