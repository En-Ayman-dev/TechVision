import Image from 'next/image';

export default function AboutSection() {
  return (
    <section id="about" className="bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight font-headline sm:text-4xl">
              About TechVision
            </h2>
            <p className="mt-4 text-muted-foreground">
              We are a team of passionate developers, designers, and strategists dedicated to crafting exceptional digital experiences. Our mission is to empower businesses with technology that is not only powerful but also intuitive and elegant.
            </p>
            <div className="mt-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold font-headline">Our Vision</h3>
                <p className="text-muted-foreground">To be a leading force in digital innovation, shaping the future of technology for businesses worldwide.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold font-headline">Our Values</h3>
                <p className="text-muted-foreground">Integrity, Collaboration, and a relentless pursuit of Excellence.</p>
              </div>
            </div>
          </div>
          <div className="w-full h-auto">
            <Image
              src="https://placehold.co/600x400.png"
              alt="Our team at work"
              width={600}
              height={400}
              className="rounded-lg shadow-xl"
              data-ai-hint="team collaboration"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
