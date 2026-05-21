import { Hero } from '@/sections/Hero';
import { Problem } from '@/sections/Problem';

export default function App(): React.JSX.Element {
  return (
    <main className="min-h-dvh bg-bastion-bg text-bastion-fg">
      <Hero />
      <Problem />
    </main>
  );
}
