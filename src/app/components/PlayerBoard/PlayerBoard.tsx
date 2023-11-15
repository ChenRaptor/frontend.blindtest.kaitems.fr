import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const people = [
  {
    name: 'Leslie Alexander',
    email: 'leslie.alexander@example.com',
    role: 'Co-Founder / CEO',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    state: "Ready"
  },
  {
    name: 'Michael Foster',
    email: 'michael.foster@example.com',
    role: 'Co-Founder / CTO',
    imageUrl:
      'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    state: "Not ready"
  },
  {
    name: 'Dries Vincent',
    email: 'dries.vincent@example.com',
    role: 'Business Relations',
    imageUrl:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    state: "Ready"
  },
  {
    name: 'Lindsay Walton',
    email: 'lindsay.walton@example.com',
    role: 'Front-end Developer',
    imageUrl:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    state: "Ready"
  }
]


export default function PlayerBoard() {
  return (
    <Card className="h-full w-full overflow-hidden">
      <CardHeader className="bg-primary-100">
        <CardTitle>Joueur</CardTitle>
        <CardDescription>{people.length} joueurs dans la salle</CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-2">
        <ul role="list" className="divide-y divide-primary-300">
        {people.map((person) => (
          <li key={person.email} className="flex justify-between gap-x-6 py-5">
            <div className="flex items-center justify-center min-w-0 gap-x-4">
              <Avatar>
                <AvatarImage src={person.imageUrl} alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex items-center justify-center">
                <p className="text-sm font-semibold leading-6 text-gray-900">{person.name}</p>
              </div>
            </div>
            <div className="min-w-0 flex items-center justify-center">
              <p className="text-sm font-semibold leading-6 text-gray-900">{person.state}</p>
            </div>
          </li>
        ))}
        </ul>
      </CardContent>
    </Card>
  );
}