// // import type { ProjectStatus } from "@/types/project";
// import { cn } from "@/lib/utils";

// type StatusBadgeProps = {
//   // status: ProjectStatus;
//   className?: string;
// };

// // export function StatusBadge({ status, className }: StatusBadgeProps) {
//   // const isComplete = status === "Completed";

//   return (
//     <span
//       className={cn(
//         "inline-flex items-center gap-2 whitespace-nowrap border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em]",
//         isComplete
//           ? "border-accent bg-accent text-button-text"
//           : "border-accent bg-card text-white",
//         className,
//       )}
//     >
//       <span
//         aria-hidden="true"
//         className={cn(
//           "h-1.5 w-1.5",
//           isComplete ? "bg-button-text" : "rounded-full bg-accent",
//         )}
//       />
//       {/* {status} */}
//     </span>
//   );
// }
