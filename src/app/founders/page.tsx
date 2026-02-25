import { Section } from '@/components/primitives/Section';
import { SectionTitle } from '@/components/primitives/SectionTitle';
import { TeamGrid } from '@/components/team/TeamGrid';
import { founders } from '@/data/founders';

export default function FoundersPage() {
  return (
    <Section>
      <SectionTitle>Founders</SectionTitle>
      <TeamGrid founders={founders} />
    </Section>
  );
}
