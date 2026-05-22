import { Nav } from '@/components/Nav';
import { Hero } from '@/sections/Hero';
import { Problem } from '@/sections/Problem';
import { Solution } from '@/sections/Solution';
import { Features } from '@/sections/Features';
import { HowItWorks } from '@/sections/HowItWorks';
import { Audience } from '@/sections/Audience';
import { Comparison } from '@/sections/Comparison';
import { Waitlist } from '@/sections/Waitlist';

export default function App(): React.JSX.Element {
  return (
    <div id="top" className="min-h-dvh bg-bastion-bg text-bastion-fg">
      <Nav />
      <main>
        <Hero />
        <Problem />
        <Solution />
        <Features />
        <HowItWorks />
        <Audience />
        <Comparison />
        <Waitlist />
      </main>
    </div>
  );
}
