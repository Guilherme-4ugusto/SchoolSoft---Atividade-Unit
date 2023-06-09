import Header from "@/components/header";
import { Roboto } from 'next/font/google';
 
const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
});

export default function Home() {
  return (
    <div className="ConteudoIndex">
      <Header/>
    </div>
  )
}
