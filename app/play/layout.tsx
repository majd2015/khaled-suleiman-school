import { ProgressProvider } from "@/components/play/Progress";
import "./play.css";
export default function PlayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProgressProvider>
      <div className="play-space">{children}</div>
    </ProgressProvider>
  );
}
