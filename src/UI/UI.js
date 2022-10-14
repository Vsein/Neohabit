import '../styles/UI.css';
import MainMenu from './MainMenu';
import Sidebar from './Sidebar';
import Editor from './Editor';
import Overlay from './Overlay';

export default class UI {
  static load() {
    const content = document.createElement('div');
    content.id = 'content';

    content.appendChild(MainMenu.create());
    content.appendChild(Sidebar.create());
    content.appendChild(Editor.create());
    content.appendChild(Overlay.create());

    document.body.appendChild(content);
  }
}
