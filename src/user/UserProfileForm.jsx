import styles from './UserProfileForm.css';

const UserProfileForm = () => {
  return (
    <div className={styles.profileFormContainer}>
      <h1 className={styles.profileFormTitle}>User Profile</h1>

      <form>
        <label className={styles.formLabel}>Name</label>
        <input type="text" className={styles.formInput} />

        <label className={styles.formLabel}>Email</label>
        <input type="email" className={styles.formInput} />

        <label className={styles.formLabel}>Gender</label>
        <select className={styles.formSelect}>
          <option value="">Select</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <div className={styles.preferencesContainer}>
          <div className={styles.preferenceOption}>Music</div>
          <div className={`${styles.preferenceOption} ${styles.preferenceOptionSelected}`}>Sports</div>
        </div>

        <button type="submit" className={styles.submitButton}>Submit</button>
      </form>
    </div>
  );
};

export default UserProfileForm;
