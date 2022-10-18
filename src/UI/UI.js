import '../styles/UI.css';
import MainMenu from './MainMenu';
import Sidebar from './Sidebar';
import Editor from './Editor';
import Overlay from './Overlay';

export default class UI {
  static load() {
    const content = document.createElement('div');
    content.id = 'content';
    document.body.appendChild(content);

    MainMenu.create();
    Sidebar.create();
    Editor.create();
    content.appendChild(Overlay.create());

    Sidebar.init();
    Editor.changeListTo('All');
  }
}
