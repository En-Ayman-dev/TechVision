import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Twitter, Linkedin } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { getTeamAction } from '@/app/actions';

export default async function TeamSection() {
  const t = await getTranslations('TeamSection');
  const teamMembers = await getTeamAction();

  return (
    <section id="team" className="bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight font-headline sm:text-4xl">{t('title')}</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg leading-8 text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
           {teamMembers.map((member) => (
            <Card key={member.id} className="text-center">
              <CardContent className="p-6">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={150}
                  height={150}
                  className="rounded-full mx-auto mb-4"
                  data-ai-hint={member.dataAiHint}
                />
                <h3 className="text-lg font-semibold font-headline">{member.name}</h3>
                <p className="text-primary">{member.role}</p>
                <div className="mt-4 flex justify-center gap-4">
                  <Button variant="outline" size="icon" asChild>
                    <Link href={member.social.twitter || '#'} aria-label={`${member.name}'s Twitter`}>
                        <Twitter className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <Link href={member.social.linkedin || '#'} aria-label={`${member.name}'s LinkedIn`}>
                        <Linkedin className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
           ))}
        </div>
      </div>
    </section>
  );
}
