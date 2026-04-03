import collageUrl from "../assets/images/collage.png?url";
import styles from "./AboutSection.module.css";

const AboutSection = () => {
  return (
    <section id="about" className={styles.section}>
      <div className={styles.bg} aria-hidden="true">
        <img className={styles.bgImg} src={collageUrl} alt="" />
        <div className={styles.bgOverlay} />
      </div>
      <div className={styles.inner}>
        <div className={styles.avatarWrap}>
          <div className={styles.avatar}>
            <img
              src="/images/products/master/master-1.webp"
              alt="Мастер"
              className={styles.avatarImg}
            />
          </div>
        </div>
        <div className={styles.content}>
          <h2 className={styles.title}>О мастерице</h2>
          <p className={styles.text}>
            Привет! Меня зовут Елизавета. Я создаю уникальную одежду для
            миниатюрных кукол. Каждый стежок сделан вручную с любовью к деталям,
            чтобы ваши любимцы выглядели безупречно.Я создаю одежду много лет и
            у меня есть много опыта в этой области.Всегда стараюсь создать
            что-то новое и уникальное.Смотрите мои роботы и выбирайте то, что
            вам нравится.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
