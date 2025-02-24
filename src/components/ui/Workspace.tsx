import styles from './styles/Workspace.module.scss'

const WorkSpace : React.FC<{children: React.ReactNode}> =  ({children}) => {
  return (
    <main className={styles.container}>
      <section className={styles.container__inner} role="presentation">
        {children}
      </section>
    </main>
  )
}

export default WorkSpace