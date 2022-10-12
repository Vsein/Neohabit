import cog from '../icons/cog.svg'
import skillTree from '../icons/family-tree.svg'
import home from '../icons/home.svg'
import post from '../icons/post.svg'
import habits from '../icons/trending-up.svg'
import toDo from '../icons/checkbox-multiple-marked.svg'
import arrowDown from '../icons/chevron-down.svg'
import today from '../icons/calendar-today-outline.svg'
import week from '../icons/calendar-week-outline.svg'
import star from '../icons/star.svg'
import all from '../icons/square-small.svg'
import plus from '../icons/plus.svg'
import '../styles/UI.css'

export default function loadUI() {
  const content = document.createElement('div');
  content.id = 'content';

  content.appendChild(createMainMenu());
  content.appendChild(createSidebar());
  content.appendChild(createEditor());

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

function createNeohabitTextNode() {
  const wrapper = document.createElement('span');

  const span = document.createElement('span');
  span.style.color = "#144e12";
  span.textContent = 'neo';

  const text = document.createTextNode('habit');

  wrapper.appendChild(span);
  wrapper.appendChild(text);

  return wrapper;
}

function createLogo() {
  const logo = document.createElement('h2');
  logo.classList.add('logo');

  logo.appendChild(createNeohabitTextNode());

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

function createSidebar() {
  const sidebar = document.createElement('div');
  sidebar.classList.add('sidebar');

  sidebar.appendChild(createFilterSections());

  sidebar.appendChild(createProjectsNav());

  return sidebar;
}

function createFilterSections() {
  const filterSections = document.createElement('div');
  filterSections.classList.add('task-sections');

  filterSections.appendChild(createFilterSection('All', all));
  filterSections.appendChild(createFilterSection('Today', today));
  filterSections.appendChild(createFilterSection('Week', week));
  filterSections.appendChild(createFilterSection('Important', star));

  return filterSections;
}

function createFilterSection(name, image) {
  const filterSection = document.createElement('div');
  filterSection.classList.add('task-section');

  const icon = document.createElement('img');
  icon.style.height = "20px";
  icon.style.width = "20px";
  icon.src = image;

  const p = document.createElement('p');
  p.textContent = name;

  filterSection.appendChild(icon);
  filterSection.appendChild(p);

  return filterSection;
}

function createProjectsNav() {
  const projects = document.createElement('div');
  projects.classList.add('projects');

  projects.appendChild(createProjectHeader());

  projects.appendChild(createProjectTile({
    name: createNeohabitTextNode(),
    icon: home,
    color: "#144e12"
  }));

  projects.appendChild(createProjectTile({
    name: "Cooking",
    icon: home,
    color: "#EDAD0E"
  }));

  projects.appendChild(createProjectTile({
    name: "Languages",
    icon: home,
    color: "#00ED76"

  }));

  return projects;
}

function createProjectHeader() {
  const header = document.createElement('div');
  header.classList.add('projects-header');

  const text = document.createElement('p');
  text.textContent = "Projects";

  const icon = document.createElement('img');
  icon.classList.add('icon');
  icon.src = arrowDown;

  header.appendChild(text);
  header.appendChild(icon);

  return header;
}

function createCenteringDiv(height, width = '') {
  if (!width) width = height;
  const div = document.createElement('div');
  div.classList.add('centering');
  div.style.height = height;
  div.style.width = width;

  return div;
}

function createProjectTile(project) {
  const projectTile = document.createElement('div');
  projectTile.classList.add('project');

  const text = document.createElement('p');
  text.append(project.name);
  text.height = "12px";

  const wrapper = createCenteringDiv('20px');

  const icon = document.createElement('div');
  icon.style.backgroundColor = project.color;
  icon.style.height = "12px";
  icon.style.width = "12px";
  icon.style.borderRadius = "50%";

  wrapper.appendChild(icon);

  projectTile.appendChild(wrapper);
  projectTile.appendChild(text);

  return projectTile;
}

function createEditor() {
  const editor = document.createElement('div');
  editor.id = 'editor';

  editor.appendChild(createEditorHeader());
  editor.appendChild(createEditorList());

  return editor;
}

function createEditorHeader() {
  const header = document.createElement('div');
  header.classList.add('editor-header');

  const sectionName = document.createElement('h3');
  sectionName.textContent = 'Today';

  header.appendChild(sectionName);

  return header;
}

function createEditorList() {
  const list = document.createElement('div');
  list.classList.add('editor-list');

  list.appendChild(createTask(
    {
      title: "Get ahead"
    }
  ));

  list.appendChild(createTask(
    {
      title: "Get further ahead"
    }
  ));

  list.appendChild(createTask(
    {
      title: "Get even further beyond"
    }
  ));

  list.appendChild(createNewTaskButton());

  return list;
}

function createNewTaskButton() {
  const btn = document.createElement('div');
  btn.classList.add('new-task-btn');

  const img = document.createElement('img');
  img.style.height = "30px";
  img.style.width = "30px";
  img.src = plus;

  const text = document.createElement('text');
  text.textContent = "Add task";

  btn.appendChild(img);
  btn.appendChild(text);

  return btn;
}

function createTask(task) {
  const taskDiv = document.createElement('div');
  taskDiv.classList.add('task');

  taskDiv.appendChild(createCheckbox());

  const text = document.createElement('p');
  text.textContent = task.title;

  taskDiv.appendChild(text);

  return taskDiv;
}

function createCheckbox() {
  const checkbox = document.createElement('div');
  checkbox.classList.add('checkbox');

  return checkbox;
}
