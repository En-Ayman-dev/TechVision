import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Code, Cloud, PenTool, Database, Shield, LineChart } from 'lucide-react';
import type { Service } from '@/lib/types';

const services: Service[] = [
  {
    icon: Code,
    title: 'Web Development',
    description: 'Creating responsive and high-performance websites and web applications tailored to your needs.',
  },
  {
    icon: Cloud,
    title: 'Cloud Solutions',
    description: 'Leveraging cloud infrastructure for scalable, secure, and efficient business operations.',
  },
  {
    icon: PenTool,
    title: 'UI/UX Design',
    description: 'Designing intuitive and beautiful user interfaces that enhance user engagement and satisfaction.',
  },
  {
    icon: Database,
    title: 'Data Engineering',
    description: 'Building robust data pipelines and architectures to turn raw data into actionable insights.',
  },
  {
    icon: Shield,
    title: 'Cybersecurity',
    description: 'Protecting your digital assets with advanced security protocols and threat mitigation strategies.',
  },
  {
    icon: LineChart,
    title: 'Business Analytics',
    description: 'Providing data-driven insights to help you make informed decisions and drive business growth.',
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight font-headline sm:text-4xl">Our Services</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg leading-8 text-muted-foreground">
            We offer a comprehensive suite of technology services designed to help you achieve your business goals.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.title} className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground mb-4">
                  <service.icon className="h-6 w-6" />
                </div>
                <CardTitle className="font-headline">{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
