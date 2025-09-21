import { getMessageById } from "@/app/actions";
import AIChat from "@/components/admin/AIChat";
import { notFound } from "next/navigation";

interface ReplyPageProps {
    params: {
        locale: string;
        id: string;
    };
}

export default async function ReplyPage({ params }: ReplyPageProps) {
    const { id } = await params;
    const message = await getMessageById(id);

    if (!message) {
        notFound();
    }

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col">
            <AIChat originalMessage={message} />
        </div>
    );
}