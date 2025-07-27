import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { getMessagesAction } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';

export default async function MessagesPage() {
  const messages = await getMessagesAction();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Messages</h1>
      <Card>
        <CardHeader>
          <CardTitle>Inbox</CardTitle>
          <CardDescription>
            Here are the messages submitted through your contact form.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Sender</TableHead>
                <TableHead>Message</TableHead>
                <TableHead className="w-[180px]">Received</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.length > 0 ? (
                messages.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell>
                      <div className="font-medium">{message.name}</div>
                      <div className="text-sm text-muted-foreground">{message.email}</div>
                    </TableCell>
                    <TableCell>{message.message}</TableCell>
                    <TableCell>
                      {format(new Date(message.submittedAt), "PPP p")}
                    </TableCell>
                    <TableCell>
                      {/* Action buttons will go here */}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No messages found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
