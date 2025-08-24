import { notFound } from "next/navigation";
import { Inter } from "next/font/google";
import { getMessages } from "next-intl/server";
import { unstable_setRequestLocale } from "next-intl/server";
import { locales } from "@/i18n";
import I18nProviderClient from "@/components/I18nProviderClient";
import "@/app/globals.css";

const inter = Inter({ subsets: ["latin"] });

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const messages = await getMessages();
  const t = (messages as any).Metadata;

  if (!t) {
    console.error(`Missing 'Metadata' in messages for locale: ${locale}`);
    return {};
  }

  return {
    title: t.title,
    description: t.description,
  };
}

export default async function LocaleLayout({ children, params: { locale } }: Props) {
  if (!locales.includes(locale)) notFound();
  unstable_setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <I18nProviderClient locale={locale} messages={messages}>
          {children}
        </I18nProviderClient>
      </body>
    </html>
  );
}