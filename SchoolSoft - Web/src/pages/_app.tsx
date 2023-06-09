import '@/styles/globals.css'
import '@/styles/style.css'
import type { AppProps } from 'next/app'
import { Roboto } from 'next/font/google';
 
const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={roboto.className}>
        <Component {...pageProps}/>
    </main>
  )
  
}
