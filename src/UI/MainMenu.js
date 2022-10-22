import home from '../icons/home.svg';
import skillTree from '../icons/family-tree.svg';
import habits from '../icons/trending-up.svg';
import toDo from '../icons/checkbox-multiple-marked.svg';
import post from '../icons/post.svg';
import cog from '../icons/cog.svg';
import menu from '../icons/menu.svg';
import apps from '../icons/apps.svg';

export default class MainMenu {
  static create() {
    const content = document.getElementById('content');
    content.innerHTML += `
      <div class="menu">
        <div class="logo-section sidebar-toggle-container">
          <img src=${menu} class="icon sidebar-toggle">
        </div>
        <h2 class="logo neohabit"></h2>
        <input type="checkbox" class="menu-checkbox" id="menu-checkbox">
        <label class="logo-section" for="menu-checkbox">
          <img src=${apps} class="icon" id="menu-button">
        </label>
        <div class="menu-container">
          <a class="menu-section" href="https://vsein.github.io/profile-page/">
            <img src=${home} class="icon">
            <p class="link">Dashboard</p>
            <div class="ribbon ribbon-top-right ribbon-raw"><span>raw</span></div>
          </a>
          <div class="menu-section">
            <img src=${skillTree} class="icon">
            <p class="link">Skill trees</p>
            <div class="ribbon ribbon-top-right"><span>coming soon</span></div>
          </div>
          <div class="menu-section">
            <img src=${habits} class="icon">
            <p class="link">Habits</p>
            <div class="ribbon ribbon-top-right"><span>coming soon</span></div>
          </div>
          <div class="menu-section active">
            <img src=${toDo} class="icon">
            <p class="link">To-do</p>
          </div>
          <div class="menu-section">
            <img src=${post} class="icon">
            <p class="link">Blog</p>
            <div class="ribbon ribbon-top-right"><span>coming soon</span></div>
          </div>
          <div class="menu-section">
            <img src=${cog} class="icon">
            <p class="link">Settings</p>
            <div class="ribbon ribbon-top-right"><span>coming soon</span></div>
          </div>
        </div>
      </div>
    `;
  }

  static init() {
    window.addEventListener('click', (e) => {
      const input = document.getElementById('menu-checkbox');
      const logo = document.querySelector('.logo-section');
      const container = document.querySelector('.menu-container');
      if (
        !input.contains(e.target)
        && !logo.contains(e.target)
        && !container.contains(e.target)
      ) {
        input.checked = false;
      }
    });

    document.querySelector('.sidebar-toggle-container').addEventListener('click', (e) => {
      document.querySelector('.sidebar').classList.toggle('sidebar-hidden');
    });
  }
}
