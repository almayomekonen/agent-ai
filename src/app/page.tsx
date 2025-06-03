import InteractiveAgent from "@/app/components/agent-ui/InteractiveAgent";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";

export default function HomePage() {
  return (
    <ErrorBoundary>
      <InteractiveAgent />
    </ErrorBoundary>
  );
}
