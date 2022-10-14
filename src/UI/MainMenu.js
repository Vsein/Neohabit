import home from '../icons/home.svg';
import skillTree from '../icons/family-tree.svg';
import habits from '../icons/trending-up.svg';
import toDo from '../icons/checkbox-multiple-marked.svg';
import post from '../icons/post.svg';
import cog from '../icons/cog.svg';

export default class MainMenu {
  static create() {
    const mainMenu = document.createElement('div');
    mainMenu.classList.add('menu');

    mainMenu.appendChild(this.createLogo());

    const sections = [
      {
        name: 'Dashboard',
        image: home,
        row: 3,
      },
      {
        name: 'Skill trees',
        image: skillTree,
        row: 4,
      },
      {
        name: 'Current habits',
        image: habits,
        row: 5,
      },
      {
        name: 'To-do',
        image: toDo,
        row: 6,
        active: true,
      },
      {
        name: 'Blog',
        image: post,
        row: 7,
      },
      {
        name: 'Settings',
        image: cog,
        row: 9,
      },
    ];

    sections.forEach((section) => {
      mainMenu.appendChild(this.createSection(section));
    });

    return mainMenu;
  }

  static createLogo() {
    const logo = document.createElement('h2');
    logo.classList.add('logo', 'neohabit');

    return logo;
  }

  static createSection({
    name, image, row, active,
  }) {
    const section = document.createElement('div');
    section.classList.add('menu-section');
    if (active) {
      section.classList.add('active');
    }
    section.style.gridRow = row;

    const img = document.createElement('img');
    img.src = image;
    img.classList.add('icon');

    const p = document.createElement('p');
    p.textContent = name;
    p.classList.add('link');

    section.appendChild(img);
    section.appendChild(p);

    return section;
  }
}
