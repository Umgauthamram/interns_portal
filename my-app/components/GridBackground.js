import styles from './GridBackground.module.css';

export function GridBackground({ mask = 'fade-edges' }) {
    // Determine mask class
    const maskClass = mask === 'fade-center' ? styles.fadeCenter :
        mask === 'fade-edges' ? styles.fadeEdges : '';

    return (
        <div className={styles.gridContainer}>
            <div className={`${styles.gridPattern} ${maskClass}`}></div>
        </div>
    );
}
