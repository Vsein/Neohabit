import cog from '../icons/cog.svg'
import skillTree from '../icons/family-tree.svg'
import home from '../icons/home.svg'
import post from '../icons/post.svg'
import habits from '../icons/trending-up.svg'
import toDo from '../icons/checkbox-multiple-marked.svg'
import '../styles/UI.css'

export default function loadUI() {
  const content = document.createElement('div');
  content.id = 'content';

  content.appendChild(createMainMenu());

  document.body.appendChild(content);
}

function createMainMenu() {
  const mainMenu = document.createElement('div');
  mainMenu.classList.add('menu');

  mainMenu.appendChild(createLogo());

  mainMenu.appendChild(createSectionHeader(
    "Dashboard", home, 3
  ));

  mainMenu.appendChild(createSectionHeader(
    "Skill trees", skillTree, 4
  ));

  mainMenu.appendChild(createSectionHeader(
    "Current habits", habits, 5
  ));

  mainMenu.appendChild(createSectionHeader(
    "To-do", toDo, 6
  ));

  mainMenu.appendChild(createSectionHeader(
    "Blog", post, 7
  ));

  mainMenu.appendChild(createSectionHeader(
    "Settings", cog, 9
  ));

  return mainMenu;
}

function createLogo() {
  const logo = document.createElement('h2');
  logo.classList.add('logo');

  const span = document.createElement('span');
  span.style.color = "#144e12";
  span.textContent = 'neo';
  const text = document.createTextNode('habit');

  logo.appendChild(span);
  logo.appendChild(text);

  return logo;
}

function createSectionHeader(name, image, row) {
  const section = document.createElement('div');
  section.classList.add(`menu-section`);
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
