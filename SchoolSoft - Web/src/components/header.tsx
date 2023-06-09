import styles from '../styles/header.module.css';
import Link from 'next/link';
import Button from '@mui/material/Button';
import { useRouter } from 'next/router';

export default function Header(){
  const route = useRouter();
  return(
    <div className={route.asPath == '/' ? styles.Nav : styles.NavColored}>
        <div className={styles.Links}>
            <Link className={styles.Link} href="/professores">Professores</Link>
            <Link className={styles.Link} href="/alunos">Alunos</Link>
            <Link className={styles.Link} href="/diciplinas">Diciplinas</Link>
            <Link className={styles.Link} href="/relatorio">Relatorio</Link>
        </div>
        <div className={styles.LogoBox}>
              <Link href="/">
                <img  src='../logo_white.png'  className={styles.Logo} />
              </Link>
        </div>
        <div className={styles.Espacamento}><br/></div>
    </div>
  )
}