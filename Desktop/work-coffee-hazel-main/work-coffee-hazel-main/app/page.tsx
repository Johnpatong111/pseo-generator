import { redirect } from 'next/navigation'

export default function Page() {
  // Przekierowuje użytkownika bezpośrednio na /pl, wymuszając kod języka w URL
  redirect('/pl')
}