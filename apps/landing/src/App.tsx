import { Hero } from '@/sections/Hero';
import { Problem } from '@/sections/Problem';
import { Solution } from '@/sections/Solution';
import { Features } from '@/sections/Features';
import { HowItWorks } from '@/sections/HowItWorks';

export default function App(): React.JSX.Element {
  return (
    <main className="min-h-dvh bg-bastion-bg text-bastion-fg">
      <Hero />
      <Problem />
      <Solution />
      <Features />
      <HowItWorks />
    </main>
  );
}
