import styles from './emails.module.css';

/* eslint-disable-next-line */
export interface EmailsProps {}

export function Emails(props: EmailsProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to Emails!</h1>
    </div>
  );
}

export default Emails;
